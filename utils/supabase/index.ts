// Server-side Supabase client (use in Server Components and API routes)
export { createClient as createServerClient } from "./server";

// Browser-side Supabase client (use in Client Components with 'use client')
export { createClient as createBrowserClient } from "./client";

// Middleware Supabase client (use in middleware.ts)
export { createClient as createMiddlewareClient } from "./middleware";
