import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ktmvcsnuvbvqytahrcli.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bXZjc251dmJ2cXl0YWhyY2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NDgzNjgsImV4cCI6MjA3MDAyNDM2OH0.bpvV0ruhNSs9Yco0rYfKBrbxep-Aqy7BIKNGB8966Go"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase