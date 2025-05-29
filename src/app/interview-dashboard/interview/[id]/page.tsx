"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { use } from "react";
import { supabase } from "@/lib/supabaseClient";
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState<
    { role: "assistant" | "user"; content: string }[]
  >([]);
  const [isListening, setIsListening] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [reminderTimeout, setReminderTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [showReminder, setShowReminder] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const recordingRef = useRef<any>(null);
  const router = useRouter();
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

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
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const avatarUrl =
        data?.user?.user_metadata?.avatar_url ||
        data?.user?.user_metadata?.picture ||
        null;
      setUserAvatar(avatarUrl);
    };
    fetchUser();
  }, []);

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

        // Automatically trigger analysis after session completion
        if (data.session?.id) {
          try {
            const analysisResponse = await fetch("/api/interview/analyze", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ session_id: data.session.id }),
            });

            if (!analysisResponse.ok) {
              const error = await analysisResponse.json();
              console.error(
                "Failed to analyze interview automatically:",
                error
              );
            } else {
              console.log("Interview analysis triggered automatically.");
            }
          } catch (err) {
            console.error("Error triggering automatic analysis:", err);
          }
        }
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
          "Hello! I'm your AI interviewer. Are you ready to begin the interview?",
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

  // Helper: Start listening for user answer
  const startListening = () => {
    setIsListening(true);
    setShowReminder(false);
    // Start voice recording here (integrate with vapi or your voice SDK)
    if (recordingRef.current) recordingRef.current.start();
    // Set reminder timeout (e.g., 60 seconds)
    if (reminderTimeout) clearTimeout(reminderTimeout);
    setReminderTimeout(setTimeout(() => setShowReminder(true), 60000));
  };

  // Helper: Stop listening
  const stopListening = () => {
    setIsListening(false);
    if (recordingRef.current) recordingRef.current.stop();
    if (reminderTimeout) clearTimeout(reminderTimeout);
    setShowReminder(false);
  };

  // When a new question is to be asked (after interviewStarted)
  useEffect(() => {
    if (
      interviewStarted &&
      interview &&
      currentQuestionIndex < interview.questions.length
    ) {
      // Set the pending question, but do not display it yet
      setPendingQuestion(interview.questions[currentQuestionIndex].question);
      // Here, trigger the AI to speak the question (if not already handled by vapi)
      // The chat bubble will be shown after 'speech-end' event
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, interviewStarted, interview]);

  // Listen for vapi 'speech-end' event to display the question
  useEffect(() => {
    const handleSpeechEnd = () => {
      if (pendingQuestion) {
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: pendingQuestion },
        ]);
        setPendingQuestion(null);
        startListening();
      }
    };
    vapi.on("speech-end", handleSpeechEnd);
    return () => {
      vapi.off("speech-end", handleSpeechEnd);
    };
  }, [pendingQuestion]);

  // Handle starting the interview
  const handleStartInterview = async () => {
    setInterviewStarted(true);
    setCurrentQuestionIndex(0);
    setChatHistory([]);
    // Start the call (voice SDK)
    await handleStartCall();
    // The first question will be shown after the simulated AI ask delay in useEffect above
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
    <div className="min-h-screen bg-[#59B7F2] flex flex-col items-center justify-center p-6">
      {/* Centered Interview Header */}
      <div className="max-w-4xl w-full mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          {interview.company} - {interview.role} Interview
        </h1>
      </div>

      {/* Cards Container */}
      <div className="max-w-2xl w-full mx-auto grid grid-cols-2 gap-6 mb-8">
        {/* AI Interviewer Card */}
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center relative">
          <div
            className="bg-[#E0F2FE] rounded-full flex items-center justify-center mb-4"
            style={{ width: 120, height: 120 }}
          >
            <Image
              src="/assets/logos/wallstreetai-logo.svg"
              alt="AI Interviewer"
              width={96}
              height={96}
              className="w-24 h-24"
            />
          </div>
          <h2 className="text-xl font-semibold text-[#1E3A8A] mb-2">
            AI Interviewer
          </h2>
        </div>
        {/* User Card */}
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center">
          <div
            className="bg-[#E0F2FE] rounded-full flex items-center justify-center mb-4"
            style={{ width: 120, height: 120 }}
          >
            {userAvatar ? (
              <Image
                src={userAvatar}
                alt="You"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <Image
                src="/assets/icons/user-placeholder.svg"
                alt="You"
                width={96}
                height={96}
                className="w-24 h-24"
              />
            )}
          </div>
          <h2 className="text-xl font-semibold text-[#1E3A8A] mb-2">You</h2>
        </div>
      </div>

      {/* Start Interview Button (centered, only before interview starts) */}
      {!interviewStarted && (
        <div className="flex flex-col items-center justify-center w-full">
          <button
            onClick={handleStartInterview}
            className="bg-[#1E3A8A] hover:bg-[#22357A] text-white px-8 py-4 rounded-lg font-semibold text-xl shadow-md transition-colors mb-8"
          >
            Start Interview
          </button>
        </div>
      )}

      {/* Chat UI, Listening, and Submit only after interview starts */}
      {interviewStarted && (
        <div className="flex flex-col items-center justify-center w-full">
          {/* Chat UI (centered) */}
          <div className="w-full flex flex-col items-center justify-center mb-8">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "assistant" ? "justify-center" : "justify-center"
                } mb-2 w-full`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[70%] text-center mx-auto ${
                    msg.role === "assistant"
                      ? "bg-white text-[#1E3A8A]"
                      : "bg-[#1E3A8A] text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Listening Indicator & Reminder */}
          {isListening && (
            <div className="flex flex-col items-center mb-4">
              <div className="flex items-center space-x-2">
                <span className="animate-pulse w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-white font-semibold">Listening...</span>
              </div>
              {showReminder && (
                <div className="mt-2 text-yellow-200 text-sm">
                  Still there? Please answer the question when you're ready.
                </div>
              )}
            </div>
          )}

          {/* End Call Button (voice only) */}
          {isListening && (
            <div className="flex justify-center mb-8">
              <button
                onClick={handleEndCall}
                className="bg-[#1E3A8A] hover:bg-[#22357A] text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-colors"
              >
                End Call
              </button>
            </div>
          )}
        </div>
      )}

      {/* Interview Info (always show at bottom) */}
      <div className="max-w-4xl mx-auto mt-6 flex flex-row justify-between items-center px-4 gap-16">
        <div className="text-white/80">
          <p className="text-lg">
            {interview.company} - {interview.role}
          </p>
          <p className="text-lg">
            {interview.questions.length} Questions • {interview.interview_type}
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
