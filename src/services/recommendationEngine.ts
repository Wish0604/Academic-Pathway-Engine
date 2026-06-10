import { RecommendationResult } from '../types';

interface RecommendationInput {
  qualification: 'High School' | 'Diploma' | "Bachelor's Degree" | "Master's Degree" | 'PhD';
  experience: number;
  career_goal: string;
  profession: string;
  full_name: string;
}

export function getRecommendation(data: RecommendationInput): RecommendationResult {
  const { qualification, experience, career_goal, profession } = data;
  const goalLower = career_goal.toLowerCase();
  const profLower = profession.toLowerCase();

  // Scoring weights for options
  let phdScore = 0;
  let dbaScore = 0;
  let mastersScore = 0;
  let bachelorsScore = 0;
  let certScore = 0;
  let honoraryScore = 0;

  // 1. Analyze Career Goals (Keyword Matching)
  if (
    goalLower.includes('research') || 
    goalLower.includes('academia') || 
    goalLower.includes('thesis') || 
    goalLower.includes('scientific') || 
    goalLower.includes('innovation') || 
    goalLower.includes('r&d') || 
    goalLower.includes('rnd') ||
    goalLower.includes('teaching') ||
    goalLower.includes('professor')
  ) {
    phdScore += 6;
    mastersScore += 2;
  }

  if (
    goalLower.includes('leadership') || 
    goalLower.includes('management') || 
    goalLower.includes('executive') || 
    goalLower.includes('c-suite') || 
    goalLower.includes('director') || 
    goalLower.includes('ceo') || 
    goalLower.includes('business') || 
    goalLower.includes('consulting') ||
    goalLower.includes('strategy')
  ) {
    dbaScore += 5;
    mastersScore += 2;
  }

  if (
    goalLower.includes('specialize') || 
    goalLower.includes('knowledge') || 
    goalLower.includes('advanced') || 
    goalLower.includes('pivot') || 
    goalLower.includes('deepen') || 
    goalLower.includes('promotion')
  ) {
    mastersScore += 4;
    certScore += 2;
  }

  if (
    goalLower.includes('hands-on') || 
    goalLower.includes('skill') || 
    goalLower.includes('coding') || 
    goalLower.includes('practical') || 
    goalLower.includes('quick') || 
    goalLower.includes('certification') || 
    goalLower.includes('bootcamp') ||
    goalLower.includes('tool')
  ) {
    certScore += 5;
  }

  // 2. Analyze Work Experience
  if (experience >= 15) {
    honoraryScore += 8;
    dbaScore += 4;
  } else if (experience >= 8) {
    dbaScore += 5;
    mastersScore += 3;
    phdScore += 2;
  } else if (experience >= 3) {
    mastersScore += 4;
    certScore += 3;
  } else {
    // Junior or entry level
    certScore += 4;
    bachelorsScore += 3;
  }

  // 3. Analyze Current Qualification Boundaries (Feasibility checks)
  if (qualification === 'PhD') {
    // Already has a PhD - unlikely to get another PhD or Bachelor's.
    phdScore = -10;
    bachelorsScore = -10;
    certScore += 6; // Certification is great for PhDs keeping skills sharp
    dbaScore += 4;  // DBA can act as a professional doctorate extension
    honoraryScore += 3;
  } else if (qualification === "Master's Degree") {
    phdScore += 5;
    dbaScore += 4;
    mastersScore = -2; // unlikely to repeat same level unless pivoting careers
    bachelorsScore = -10;
    certScore += 2;
  } else if (qualification === "Bachelor's Degree") {
    mastersScore += 5;
    dbaScore += 2;
    phdScore += 1; // Can sometimes transition directly to PhD
    bachelorsScore = -10;
    certScore += 2;
  } else if (qualification === 'Diploma') {
    bachelorsScore += 5;
    mastersScore = -5;
    phdScore = -10;
    dbaScore = -10;
    certScore += 3;
  } else if (qualification === 'High School') {
    bachelorsScore += 7;
    certScore += 4;
    mastersScore = -10;
    phdScore = -10;
    dbaScore = -10;
  }

  // 4. Profession Alignment
  if (profLower.includes('manager') || profLower.includes('director') || profLower.includes('lead')) {
    dbaScore += 2;
  }
  if (profLower.includes('researcher') || profLower.includes('scientist') || profLower.includes('analyst')) {
    phdScore += 2;
  }
  if (profLower.includes('student') || profLower.includes('unemployed')) {
    certScore += 2;
    bachelorsScore += 2;
  }

  // Find the highest score
  const options = [
    { name: 'PhD (Doctor of Philosophy)', score: phdScore, val: 'PhD' },
    { name: 'DBA (Doctor of Business Administration)', score: dbaScore, val: 'DBA' },
    { name: 'Honorary Doctorate', score: honoraryScore, val: 'Honorary Doctorate' },
    { name: 'Master’s Degree', score: mastersScore, val: 'Master\'s Degree' },
    { name: 'Bachelor’s Degree', score: bachelorsScore, val: 'Bachelor\'s Degree' },
    { name: 'Professional Certification Program', score: certScore, val: 'Professional Certification' },
  ];

  // Soft sort descending
  options.sort((a, b) => b.score - a.score);
  const bestOption = options[0];

  let calculatedRecommendation = bestOption.name;
  let finalReason = '';

  // Tailored reasoning output
  switch (bestOption.val) {
    case 'PhD':
      finalReason = `Based on your highest qualification (${qualification}) and focus on "${career_goal}", you align perfectly with scholastic inquiry or scientific R&D. Doctoral studies will enable you to lead breakthrough research, publish original papers, and hold esteemed positions in academia or high-tech advanced laboratories.`;
      break;
    case 'DBA':
      finalReason = `With an impressive ${experience} years of experience and clear indicators toward organizational leadership, a Doctor of Business Administration is the premium executive fit. Unlike a PhD, the DBA focuses on applying advanced theory to complex real-world boardrooms, solving core strategic challenges, and accelerating C-suite visibility.`;
      break;
    case 'Honorary Doctorate':
      finalReason = `Your distinguished landmark background of ${experience} years points to widespread systemic impact. We recommend an Honorary Doctorate pathway to formally recognize your vast industrial expertise, thought leadership, and contributions to state-of-the-art practice without traditional coursework constraints.`;
      break;
    case 'Master\'s Degree':
      finalReason = `Transitioning from a ${qualification}, an advanced Master’s Degree offers the optimal balance of depth and career acceleration. Your goal of reaching "${career_goal}" is highly obtainable by augmenting your foundational ${profession} skills with structured postgraduate coursework.`;
      break;
    case 'Bachelor\'s Degree':
      finalReason = `As you currently hold a ${qualification}, establishing a rigorous, multi-year Bachelor's degree from an accredited institution is the bedrock foundation needed to transition successfully into a qualified ${profession}. This opens fundamental doors to fulfill your vision of becoming a contributor in your target domain.`;
      break;
    case 'Professional Certification':
    default:
      if (qualification === 'PhD' || qualification === "Master's Degree") {
        finalReason = `Since you already possess high academic credentials (${qualification}), a brief, focused Professional Certification is recommended to quickly bridge modern industry toolkits. It provides maximum tactical ROI to apply to "${career_goal}" without another full-length multi-year program list.`;
      } else {
        finalReason = `To safely accelerate into your target field of "${career_goal}" quickly and cost-effectively, we recommend a modern, applied Professional Certification or Boot Camp. This delivers hyper-focused technical competencies to make your profile highly employable immediately.`;
      }
      break;
  }

  return {
    recommendation: calculatedRecommendation,
    reason: finalReason,
  };
}
