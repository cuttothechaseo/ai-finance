import Vapi from "@vapi-ai/web";

if (process.env.NODE_ENV === "development") {
  // Log the Vapi API key for debugging in development only
  // eslint-disable-next-line no-console
  console.log("[Vapi] NEXT_PUBLIC_VAPI_WEB_TOKEN:", process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN);
}

export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);