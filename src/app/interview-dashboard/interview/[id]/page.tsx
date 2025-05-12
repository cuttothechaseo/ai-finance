"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { use } from "react";
import { supabase } from "@/lib/supabase";
import { getUserWithDetails } from "@/lib/auth";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/lib/interview/constants";

interface Question {
  question: string;
  expectedAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  category: "technical" | "behavioral" | "conceptual";
  topic: string;
}

interface Interview {
  id: string;
  company: string;
  role: string;
  interview_type: "technical" | "behavioral" | "mixed";
  questions: Question[];
  status: "pending" | "generated" | "completed" | "analyzed";
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

export default function InterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [sessionTranscript, setSessionTranscript] = useState<SavedMessage[]>(
    []
  );
  const [isEndingCall, setIsEndingCall] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        // Check auth first
        const user = await getUserWithDetails();

        // Fetch interview data
        const { data, error: dbError } = await supabase
          .from("generated_interviews")
          .select("*")
          .eq("id", resolvedParams.id)
          .single();

        if (dbError) throw dbError;
        if (!data) throw new Error("Interview not found");

        setInterview(data);
      } catch (error) {
        console.error("Error:", error);
        if (
          error instanceof Error &&
          error.message.includes("not authenticated")
        ) {
          router.push("/login");
        } else {
          setError(
            error instanceof Error ? error.message : "Failed to load interview"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [resolvedParams.id, router]);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      console.log("[Vapi] Call started");
      console.log("[Frontend] Current interview state:", interview);
    };

    const onCallEnd = async () => {
      setCallStatus(CallStatus.FINISHED);
      console.log("[Vapi] Call ended");
      console.log("[Frontend] Current interview state at call end:", interview);

      // Store the interview session via API route
      if (!interview) {
        console.error("[Frontend] No interview object available:", {
          interview,
        });
        return;
      }

      if (!interview.id) {
        console.error("[Frontend] Interview object has no ID:", { interview });
        return;
      }

      try {
        console.log("[Frontend] Starting interview session storage", {
          interviewId: interview.id,
          transcriptLength: sessionTranscript.length,
          transcriptSample: sessionTranscript.slice(0, 2), // Log first two messages as sample
          fullInterview: interview, // Log the full interview object
        });

        const {
          data: { session },
          error: userError,
        } = await supabase.auth.getSession();

        if (userError || !session) {
          console.error("[Frontend] Authentication error:", userError);
          throw new Error("Not authenticated");
        }

        console.log("[Frontend] Authentication successful", {
          userId: session.user?.id,
          hasAccessToken: !!session.access_token,
        });

        const sentBody = {
          interview_id: interview.id,
          status: "completed",
          transcript: sessionTranscript,
        };

        console.log("[Frontend] Preparing to send request", {
          endpoint: "/api/interview/session",
          bodyPreview: {
            ...sentBody,
            transcript: sentBody.transcript.slice(0, 2), // Log first two messages as sample
          },
        });

        const response = await fetch("/api/interview/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(sentBody),
        });

        console.log("[Frontend] Received API response", {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
        });

        if (!response.ok) {
          let errorData = {};
          try {
            errorData = await response.json();
            console.error("[Frontend] API error response:", {
              status: response.status,
              errorData,
              sentBody: {
                ...sentBody,
                transcript: sentBody.transcript.slice(0, 2),
              },
            });
          } catch (e) {
            console.error("[Frontend] Failed to parse error response:", e);
            errorData = {
              parseError: "Could not parse error response as JSON",
              originalError: e instanceof Error ? e.message : String(e),
            };
          }
          let errorMessage =
            "Failed to save interview session. Please try again.";
          if (
            errorData &&
            typeof errorData === "object" &&
            "error" in errorData &&
            typeof (errorData as any).error === "string"
          ) {
            errorMessage = (errorData as any).error;
          }
          console.error("[Frontend] Setting error state:", errorMessage);
          setError(errorMessage);
          return;
        }

        const data = await response.json();
        console.log("[Frontend] Interview session successfully saved:", {
          responseData: data,
          sessionId: data.session?.id,
        });
      } catch (err) {
        console.error("[Frontend] Unexpected error in session storage:", {
          error: err instanceof Error ? err.message : String(err),
          fullError: err,
        });
        setError("Failed to save interview session. Please try again.");
      }
      router.push("/interview-dashboard/generated-interviews");
    };

    const onMessage = (message: any) => {
      console.log("[Vapi] Message event:", message);

      // Handle conversation updates
      if (message.type === "conversation-update") {
        console.log("[Vapi] Full conversation state:", {
          conversation: message.conversation,
          messages: message.messages,
          formattedMessages: message.messagesOpenAIFormatted,
        });
      }

      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role,
          content: message.transcript,
        };
        setMessages((prev) => [...prev, newMessage]);
        setLastMessage(message.transcript);
        // Accumulate transcript for session storage
        setSessionTranscript((prev) => [...prev, newMessage]);

        // Log when we receive a final transcript
        console.log("[Vapi] Final transcript received:", {
          role: message.role,
          content: message.transcript,
        });
      } else {
        console.log("[Vapi] Non-transcript message:", message);
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
      console.log("[Vapi] Speech started");
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
      console.log("[Vapi] Speech ended");
    };

    const onError = (error: Error) => {
      console.error("[Vapi] Error event:", error);
      setError("Call error occurred. Please try again.");
      setCallStatus(CallStatus.INACTIVE);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [router, interview, sessionTranscript]);

  const handleStartCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);

      if (!interview?.questions) {
        throw new Error("No questions found for interview");
      }

      console.log("Interview data:", interview);

      // Format questions with more context
      const formattedQuestions = interview.questions
        .map(
          (q, index) =>
            `Question ${index + 1} (${q.category} - ${q.difficulty}):\n${
              q.question
            }\nTopic: ${q.topic}`
        )
        .join("\n\n");

      console.log(
        "Formatted questions being sent to Vapi:",
        formattedQuestions
      );

      await vapi.start({
        name: "Finance Interviewer",
        firstMessage:
          "Hello! I'm your finance interviewer today. I'll be asking you questions about your experience and knowledge in finance. Are you ready to begin the interview?",
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en",
        },
        voice: {
          provider: "11labs",
          voiceId: "sarah",
          stability: 0.4,
          similarityBoost: 0.8,
          speed: 0.9,
          style: 0.5,
          useSpeakerBoost: true,
        },
        model: {
          provider: "openai",
          model: "gpt-4",
          temperature: 0.7,
          messages: [
            {
              role: "system" as const,
              content: `You are a professional finance job interviewer conducting a real-time voice interview.

Instructions:
1. After your greeting, IMMEDIATELY ask the first question below, without waiting for a response.
2. After each candidate response, acknowledge briefly and move to the next question.
3. Here are the questions to ask, in order. Ask them exactly as written:

${formattedQuestions}

Important:
- Do not wait for prompting to ask questions.
- Ask questions exactly as written.
- Keep your responses concise.
- Maintain a professional tone.
- End the interview professionally after all questions are asked.`,
            },
            {
              role: "user" as const,
              content: "Yes, I'm ready.",
            },
          ],
        },
      });
      console.log("[Vapi] Call started successfully");

      // Log the complete configuration for debugging
      console.log("[Vapi] Complete configuration:", {
        name: "Finance Interviewer",
        model: {
          provider: "openai",
          model: "gpt-4",
          temperature: 0.7,
          messages: [
            /* messages array */
          ],
        },
      });
    } catch (error) {
      console.error("[Vapi] Failed to start call:", error);
      setError("Failed to start call. Please try again.");
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleEndCall = async () => {
    console.log("[Frontend] Starting call end process");
    setIsEndingCall(true);

    try {
      // Check if interview data is loaded
      if (!interview?.id) {
        console.log("[Frontend] Waiting for interview data to load...");
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds

        if (!interview?.id) {
          console.error(
            "[Frontend] Interview data still not available after waiting"
          );
          setError(
            "Failed to end call: Interview data not available. Please try again."
          );
          setIsEndingCall(false);
          return;
        }
      }

      console.log("[Frontend] Interview data confirmed, stopping call", {
        interviewId: interview.id,
      });
      setCallStatus(CallStatus.FINISHED);
      vapi.stop();
    } catch (error) {
      console.error("[Frontend] Error ending call:", error);
      setError("Failed to end call. Please try again.");
      setIsEndingCall(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#59B7F2] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-[#59B7F2] flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 text-white">
          {error || "Interview not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#59B7F2] p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          {interview.company} - {interview.role} Interview
        </h1>
      </div>

      {/* Cards Container */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Interviewer Card */}
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center relative">
          <div className="bg-[#E0F2FE] rounded-full p-6 mb-4 relative">
            <Image
              src="/assets/logos/wallstreetai-logo.svg"
              alt="AI Interviewer"
              width={64}
              height={64}
              className="w-16 h-16"
            />
            {isSpeaking && (
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-500 animate-pulse rounded-full" />
            )}
          </div>
          <h2 className="text-xl font-semibold text-[#1E3A8A] mb-2">
            AI Interviewer
          </h2>
        </div>

        {/* User Card */}
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center">
          <div className="bg-[#E0F2FE] rounded-full p-6 mb-4">
            <Image
              src="/assets/icons/user-placeholder.svg"
              alt="You"
              width={64}
              height={64}
              className="w-16 h-16"
            />
          </div>
          <h2 className="text-xl font-semibold text-[#1E3A8A] mb-2">You</h2>
        </div>
      </div>

      {/* Last Message */}
      {lastMessage && (
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4">
            <p className="text-white text-center">{lastMessage}</p>
          </div>
        </div>
      )}

      {/* Call Button */}
      <div className="max-w-4xl mx-auto mt-8">
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            onClick={handleStartCall}
            disabled={callStatus === CallStatus.CONNECTING}
            className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white py-4 rounded-xl font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {callStatus === CallStatus.CONNECTING ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              <>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>Start Interview</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleEndCall}
            disabled={isEndingCall || !interview?.id}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isEndingCall ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Ending call...</span>
              </div>
            ) : (
              <>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>End Call</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Interview Info */}
      <div className="max-w-4xl mx-auto mt-6 flex justify-between items-center px-4">
        <div className="text-white/80">
          <p className="text-lg">
            {interview.company} - {interview.role}
          </p>
          <p className="text-lg">
            {interview.questions.length} questions • {interview.interview_type}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-lg font-medium bg-white/10 text-white">
          {interview.interview_type.charAt(0).toUpperCase() +
            interview.interview_type.slice(1)}
        </span>
      </div>
    </div>
  );
}
