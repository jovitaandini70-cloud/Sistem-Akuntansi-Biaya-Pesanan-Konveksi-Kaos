import { createClient } from '@supabase/supabase-js';

// Env variable dipakai saat development (dari .env)
// Fallback hardcoded dipakai saat deploy ke GitHub Pages
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://wyregioulsmolaltauym.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cmVnaW91bHNtb2xhbHRhdXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1OTQ3NjMsImV4cCI6MjEwNjE3MDc2M30.qqogm2fYYrAiijMCdypMeY4AlFnulObXhpVGUPMDEI4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
