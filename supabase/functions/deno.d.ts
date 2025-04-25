// Type definitions for Deno-specific features

declare namespace Deno {
  interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    toObject(): { [key: string]: string };
  }

  const env: Env;
}

declare module 'https://deno.land/std@0.131.0/http/server.ts' {
  export function serve(
    handler: (request: Request) => Response | Promise<Response>,
    options?: {
      port?: number;
      hostname?: string;
      signal?: AbortSignal;
      onListen?: (params: { hostname: string; port: number }) => void;
    }
  ): Promise<void>;
}

declare module 'https://esm.sh/@supabase/supabase-js@2.0.0' {
  export function createClient(supabaseUrl: string, supabaseKey: string, options?: any): any;
} 