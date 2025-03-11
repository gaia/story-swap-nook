
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = 'https://cifpcgurdgshdrykeoch.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZnBjZ3VyZGdzaGRyeWtlb2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2OTEyNjAsImV4cCI6MjA1NzI2NzI2MH0.xe-_8fitCONDGqFNG3cZF34LL6JHxE9uVGr83nTEn7Q';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
