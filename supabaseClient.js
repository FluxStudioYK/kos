const SUPABASE_URL = "https://gsejpxkofpdjthcsvocn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzZWpweGtvZnBkanRoY3N2b2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjEwMzMsImV4cCI6MjA3NjA5NzAzM30.aB_Hhk0GPKrNu_s-MCbT0sKizw1nwLPh8xUD3P56RtU";

window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Supabase client initialized:", SUPABASE_URL);
