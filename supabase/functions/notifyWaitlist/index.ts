// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "https://esm.sh/resend@1.0.0";

console.log("Starting notifyWaitlist function...");

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Resend
const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
const resend = new Resend(resendApiKey);

// Log API key availability
console.log("Resend API Key available:", !!resendApiKey);
console.log("Supabase URL available:", !!supabaseUrl);
console.log("Supabase Service Role Key available:", !!supabaseKey);

serve(async (req) => {
  try {
    console.log("Received request");

    // Parse request
    const { name, email, university, interest } = await req.json();
    console.log("Parsed request:", { name, email, university, interest });

    // Validate request fields
    if (!name || !email || !university || !interest) {
      console.error("Missing required fields!");
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Log before sending the email
    console.log("Sending email via Resend API...");

    const { error } = await resend.emails.send({
      from: "waitlist@wallstreetai.app",
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
    });

    // If email sending failed, log it
    if (error) {
      console.error("Resend API Error:", error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Email sent successfully!");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Server Error:", error);
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
