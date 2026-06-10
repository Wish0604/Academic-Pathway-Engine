import { createClient } from '@supabase/supabase-js';
import { Submission } from '../types';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// Detect if real Supabase configuration is present and non-placeholder
const isSupabaseConfigured =
  supabaseUrl &&
  supabaseUrl !== '' &&
  !supabaseUrl.includes('your-project-id') &&
  supabaseAnonKey &&
  supabaseAnonKey !== '' &&
  !supabaseAnonKey.includes('your-anon-key');

// Lazy initializer for Supabase client
let supabaseClient: any = null;

export function getSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

export function isUsingCloudDb(): boolean {
  return !!isSupabaseConfigured;
}

export async function createSubmission(submissionData: Omit<Submission, 'id' | 'created_at'>): Promise<string> {
  const client = getSupabaseClient();
  const timestamp = new Date().toISOString();

  if (client) {
    try {
      const { data, error } = await client
        .from('submissions')
        .insert([
          {
            full_name: submissionData.full_name,
            email: submissionData.email,
            qualification: submissionData.qualification,
            experience: Number(submissionData.experience),
            profession: submissionData.profession,
            career_goal: submissionData.career_goal,
            recommendation: submissionData.recommendation,
            reason: submissionData.reason,
            created_at: timestamp,
          }
        ])
        .select();

      if (error) {
        throw error;
      }
      return data?.[0]?.id || 'supabase-success';
    } catch (err) {
      console.error('Supabase Insertion failed, falling back to local storage:', err);
      // Fallback gracefully so the process is block-free
      const submissions = getLocalSubmissions();
      const newId = 'local-fallback-' + Math.random().toString(36).substring(2, 11);
      const newRecord: Submission = {
        id: newId,
        ...submissionData,
        created_at: timestamp,
      };
      submissions.unshift(newRecord);
      localStorage.setItem('academic_pathway_records', JSON.stringify(submissions));
      return newId;
    }
  } else {
    // Local Storage Mock Mode
    const submissions = getLocalSubmissions();
    const newId = 'local-' + Math.random().toString(36).substring(2, 11);
    const newRecord: Submission = {
      id: newId,
      ...submissionData,
      created_at: timestamp,
    };
    submissions.unshift(newRecord);
    localStorage.setItem('academic_pathway_records', JSON.stringify(submissions));
    return newId;
  }
}

export async function fetchSubmissions(): Promise<Submission[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map((sub: any) => ({
        id: sub.id,
        full_name: sub.full_name,
        email: sub.email,
        qualification: sub.qualification,
        experience: Number(sub.experience),
        profession: sub.profession,
        career_goal: sub.career_goal,
        recommendation: sub.recommendation,
        reason: sub.reason,
        created_at: sub.created_at ? new Date(sub.created_at) : null,
      }));
    } catch (err) {
      console.error('Supabase Query Error, falling back to localStorage:', err);
      return getLocalSubmissions().map(sub => ({
        ...sub,
        created_at: sub.created_at ? new Date(sub.created_at) : null
      }));
    }
  } else {
    return getLocalSubmissions().map(sub => ({
      ...sub,
      created_at: sub.created_at ? new Date(sub.created_at) : null
    }));
  }
}

function getLocalSubmissions(): Submission[] {
  try {
    const raw = localStorage.getItem('academic_pathway_records');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Local Storage parsing error:', e);
  }
  // Return initial seed data for immediate demonstration if empty
  const defaultSeeds: Submission[] = [
    {
      id: 'seed-1',
      full_name: 'Jane Doe',
      email: 'jane.doe@example.com',
      qualification: 'Master\'s Degree',
      experience: 12,
      profession: 'Research Fellow',
      career_goal: 'Conduct foundational AI studies to solve sustainable power grids.',
      recommendation: 'PhD (Doctor of Philosophy)',
      reason: 'Research-oriented goals align well with doctoral studies, and her qualification matches advanced postgraduate study.',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
    },
    {
      id: 'seed-2',
      full_name: 'John Smith',
      email: 'john.smith@example.com',
      qualification: 'Bachelor\'s Degree',
      experience: 16,
      profession: 'Operations Director',
      career_goal: 'Pivot to an executive C-suite role managing major cloud infrastructure.',
      recommendation: 'Honorary Doctorate',
      reason: 'Extensive industry contribution and operational leadership experience across more than 15 years.',
      created_at: new Date(Date.now() - 3600000 * 48).toISOString() // 2 days ago
    },
    {
      id: 'seed-3',
      full_name: 'Marcus Aurelius',
      email: 'marcus@philosophy.edu',
      qualification: 'Bachelor\'s Degree',
      experience: 6,
      profession: 'Strategy Lead',
      career_goal: 'Develop corporate leadership strategy frameworks on a systemic level.',
      recommendation: 'DBA (Doctor of Business Administration)',
      reason: 'Leadership and management aspirations fit DBA programs.',
      created_at: new Date(Date.now() - 3600000 * 72).toISOString() // 3 days ago
    }
  ];
  localStorage.setItem('academic_pathway_records', JSON.stringify(defaultSeeds));
  return defaultSeeds;
}
