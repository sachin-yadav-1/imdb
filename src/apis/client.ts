import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://befervnjouvkhcinvdja.supabase.co';
export const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlZmVydm5qb3V2a2hjaW52ZGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDE1MTYsImV4cCI6MjA2NDQ3NzUxNn0.QJXRdZPwqH94NcujUCy128RL6pps-Roi1fuybMOshXw';

const API_CLIENT = createClient(SUPABASE_URL, SUPABASE_KEY);
export default API_CLIENT;
