/**
 * Supabase Edge Function for Waitlist Email Notifications
 * 
 * This function sends an email notification when a new user joins the waitlist.
 * It's triggered by a database trigger on the waitlist table.
 */

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Resend API configuration
const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
const resendEndpoint = "https://api.resend.com/emails";

// Email template for waitlist notifications
const generateEmailHtml = (name: string, email: string, university: string, interest: string) => `
  <h2>New Waitlist Signup</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>University:</strong> ${university}</p>
  <p><strong>Interest:</strong> ${interest}</p>
  <p><em>Time: ${new Date().toISOString()}</em></p>
`;

serve(async (req: Request) => {
  try {
    // Parse and validate request data
    const { name, email, university, interest } = await req.json();
    
    if (!name || !email || !university || !interest) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required fields" 
        }), 
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Verify API key is available
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email service configuration error" 
        }), 
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Send email notification
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
        html: generateEmailHtml(name, email, university, interest),
      }),
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: result.message || "Failed to send email notification" 
        }), 
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Notification sent successfully" 
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Server error processing notification request" 
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}); /* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/notifyWaitlist' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"John Doe", "email":"john@example.com", "university":"Harvard", "interest":"Investment Banking"}'

*/ 
