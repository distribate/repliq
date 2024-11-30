import { serve } from 'https://deno.land/std@0.170.0/http/supabase-client.ts'
import { handler } from './handler.tsx'

serve(handler)

console.log('Serving og-images function')
