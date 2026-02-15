import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Validate user with anon client
    const anonClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await anonClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { quiz_id, selected_answers } = await req.json();

    if (!quiz_id || !selected_answers || typeof selected_answers !== "object") {
      return new Response(JSON.stringify({ error: "Missing quiz_id or selected_answers" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to access quiz_answers (students can't read is_correct before completion)
    const adminClient = createClient(supabaseUrl, supabaseKey);

    // Fetch quiz
    const { data: quiz, error: quizErr } = await adminClient
      .from("quizzes")
      .select("id, passing_score")
      .eq("id", quiz_id)
      .single();

    if (quizErr || !quiz) {
      return new Response(JSON.stringify({ error: "Quiz not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch questions
    const { data: questions, error: qErr } = await adminClient
      .from("quiz_questions")
      .select("id, points")
      .eq("quiz_id", quiz_id);

    if (qErr || !questions) {
      return new Response(JSON.stringify({ error: "Failed to load questions" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const questionIds = questions.map((q: any) => q.id);

    // Fetch correct answers using service role
    const { data: answers, error: aErr } = await adminClient
      .from("quiz_answers")
      .select("id, question_id, is_correct")
      .in("question_id", questionIds);

    if (aErr) {
      return new Response(JSON.stringify({ error: "Failed to load answers" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Score
    let score = 0;
    let maxScore = 0;
    const responses: any[] = [];

    for (const question of questions) {
      const pts = question.points || 1;
      maxScore += pts;
      const selectedId = selected_answers[question.id];
      const correctAnswer = (answers || []).find(
        (a: any) => a.question_id === question.id && a.is_correct
      );
      const isCorrect = !!(selectedId && correctAnswer && selectedId === correctAnswer.id);
      if (isCorrect) score += pts;

      if (selectedId) {
        responses.push({
          question_id: question.id,
          selected_answer_id: selectedId,
          is_correct: isCorrect,
        });
      }
    }

    const passingScore = quiz.passing_score || 70;
    const passed = maxScore > 0 ? (score / maxScore) * 100 >= passingScore : false;

    // Upsert attempt using service role (then link to user)
    const { data: attempt, error: attemptErr } = await adminClient
      .from("quiz_attempts")
      .upsert({
        user_id: user.id,
        quiz_id: quiz.id,
        score,
        max_score: maxScore,
        passed,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (attemptErr) {
      return new Response(JSON.stringify({ error: "Failed to save attempt" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save responses
    if (responses.length > 0) {
      const responsesWithAttempt = responses.map((r) => ({
        ...r,
        attempt_id: attempt.id,
      }));
      await adminClient.from("quiz_responses").insert(responsesWithAttempt);
    }

    return new Response(
      JSON.stringify({ score, maxScore, passed, attempt }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("submit-quiz error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
