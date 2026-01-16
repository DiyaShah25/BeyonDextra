import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, Trash2, MessageSquare, Bot, User, Loader2, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/Layout';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const AIChat = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch conversations
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation.id);
    } else {
      setMessages([]);
    }
  }, [currentConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversations',
        variant: 'destructive',
      });
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Type cast the data to ensure role is properly typed
      const typedMessages: Message[] = (data || []).map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        created_at: msg.created_at,
      }));
      
      setMessages(typedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const createNewConversation = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({ user_id: user.id, title: 'New Chat' })
        .select()
        .single();

      if (error) throw error;
      setConversations(prev => [data, ...prev]);
      setCurrentConversation(data);
      setMessages([]);
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new chat',
        variant: 'destructive',
      });
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;

      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }

      toast({
        title: 'Chat deleted',
        description: 'The conversation has been removed',
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete chat',
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user) return;

    let conversationId = currentConversation?.id;

    // Create a new conversation if none exists
    if (!conversationId) {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .insert({ user_id: user.id, title: inputMessage.slice(0, 50) })
          .select()
          .single();

        if (error) throw error;
        conversationId = data.id;
        setConversations(prev => [data, ...prev]);
        setCurrentConversation(data);
      } catch (error) {
        console.error('Error creating conversation:', error);
        toast({
          title: 'Error',
          description: 'Failed to start conversation',
          variant: 'destructive',
        });
        return;
      }
    }

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message to UI immediately
    const tempUserMessage: Message = {
      id: `temp-user-${Date.now()}`,
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      // Save user message to database
      const { data: savedUserMessage, error: saveError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          role: 'user',
          content: userMessage,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Update the temp message with the real one
      const typedSavedUserMessage: Message = {
        id: savedUserMessage.id,
        role: savedUserMessage.role as 'user' | 'assistant',
        content: savedUserMessage.content,
        created_at: savedUserMessage.created_at,
      };
      
      setMessages(prev => prev.map(m => 
        m.id === tempUserMessage.id ? typedSavedUserMessage : m
      ));

      // Call AI edge function
      const { data: aiData, error: aiError } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: userMessage,
          conversationId,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
        },
      });

      if (aiError) throw aiError;

      if (!aiData.success) {
        throw new Error(aiData.error || 'Failed to get response');
      }

      // Save assistant message to database
      const { data: savedAssistantMessage, error: assistantSaveError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: aiData.message,
        })
        .select()
        .single();

      if (assistantSaveError) throw assistantSaveError;

      const typedAssistantMessage: Message = {
        id: savedAssistantMessage.id,
        role: savedAssistantMessage.role as 'user' | 'assistant',
        content: savedAssistantMessage.content,
        created_at: savedAssistantMessage.created_at,
      };

      setMessages(prev => [...prev, typedAssistantMessage]);

      // Update conversation title if it's the first message
      if (messages.length === 0) {
        await supabase
          .from('conversations')
          .update({ title: userMessage.slice(0, 50) })
          .eq('id', conversationId);
        
        setConversations(prev => prev.map(c => 
          c.id === conversationId ? { ...c, title: userMessage.slice(0, 50) } : c
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      // Remove the temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (authLoading) {
    return (
      <Layout hideFooter>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <div className="flex h-[calc(100vh-4rem)] bg-background">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-72 border-r border-border bg-card flex flex-col"
            >
              <div className="p-4 border-b border-border">
                <Button
                  onClick={createNewConversation}
                  className="w-full gap-2"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {loadingConversations ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : conversations.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4 text-sm">
                      No conversations yet
                    </p>
                  ) : (
                    conversations.map(conversation => (
                      <div
                        key={conversation.id}
                        className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                          currentConversation?.id === conversation.id
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setCurrentConversation(conversation)}
                      >
                        <MessageSquare className="h-4 w-4 shrink-0" />
                        <span className="flex-1 truncate text-sm">
                          {conversation.title}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversation(conversation.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b border-border flex items-center px-4 gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <h1 className="font-semibold">BeyonDextra AI</h1>
            </div>
          </header>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="h-16 w-16 mx-auto text-primary/50 mb-4" />
                  <h2 className="text-xl font-semibold mb-2">How can I help you today?</h2>
                  <p className="text-muted-foreground">
                    Ask me anything about your courses, learning strategies, or get study tips!
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-secondary-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))
              )}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="max-w-3xl mx-auto flex gap-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIChat;
