/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://xllppukhwuxdvonfcokj.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_cetI1zLsNvW3h4aq8lEY9w_s9d4IsPk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
