import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not set');
      throw new Error('AI service is not configured');
    }

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization required');
    }

    // Create Supabase client with user's auth token
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      throw new Error('Unauthorized');
    }

    const { message, conversationId, messages: previousMessages } = await req.json();
    console.log('Received request:', { message, conversationId, userId: user.id });

    // Build conversation history for context
    const conversationHistory = previousMessages?.map((msg: { role: string; content: string }) => ({
      role: msg.role,
      content: msg.content,
    })) || [];

    // Add the new message
    conversationHistory.push({
      role: 'user',
      content: message,
    });

    // Call Lovable AI Gateway
    console.log('Calling Lovable AI Gateway...');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are BeyonDextra AI, a helpful and friendly learning assistant for an inclusive educational platform. 
Your role is to:
- Help users with their learning journey
- Answer questions about courses, topics, and concepts
- Provide study tips and learning strategies
- Be encouraging and supportive
- Adapt your communication style to be clear and accessible
- Keep responses concise but informative

Always be warm, patient, and supportive. Remember that users may have different learning needs and abilities.`,
          },
          ...conversationHistory,
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', errorText);
      throw new Error('Failed to get AI response');
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');

    const assistantMessage = aiData.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

    return new Response(
      JSON.stringify({
        success: true,
        message: assistantMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: errorMessage === 'Unauthorized' ? 401 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
