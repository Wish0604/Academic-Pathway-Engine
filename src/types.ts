export interface Submission {
  id?: string;
  full_name: string;
  email: string;
  qualification: 'High School' | 'Diploma' | "Bachelor's Degree" | "Master's Degree" | 'PhD';
  experience: number;
  profession: string;
  career_goal: string;
  recommendation: string;
  reason: string;
  created_at: any; // Timestamp or ISO string
}

export interface RecommendationResult {
  recommendation: string;
  reason: string;
}
