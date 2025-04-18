import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client with environment variables
const supabaseUrl = "https://spxvizsylxnpafhqnkru.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNweHZpenN5bHhucGFmaHFua3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NDU5OTgsImV4cCI6MjA2MDUyMTk5OH0.NeRYEt3U-K9pJwtzESlqi9cdd90mqTCKtrAW2hJYFHA";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
