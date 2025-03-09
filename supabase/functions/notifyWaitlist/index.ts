// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

console.log("Hello from Functions!");

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Resend API details
const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
const resendEndpoint = "https://api.resend.com/emails";

// Check if Resend API Key is loaded
console.log("Resend API Key available:", !!resendApiKey);

serve(async (req) => {
  try {
    const { name, email, university, interest } = await req.json();
    if (!name || !email || !university || !interest) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Send email using fetch instead of Resend package
    const emailResponse = await fetch(resendEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: "chaseottimo@gmail.com",
        subject: "New Waitlist Signup!",
        html: `
          <h2>New Waitlist Signup</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>University:</strong> ${university}</p>
          <p><strong>Interest:</strong> ${interest}</p>
          <p><em>Time: ${new Date().toISOString()}</em></p>
        `,
      }),
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      return new Response(JSON.stringify({ error: result.message || "Failed to send email" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}); /* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/notifyWaitlist' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"John Doe", "email":"john@example.com", "university":"Harvard", "interest":"Investment Banking"}'

*/ 
