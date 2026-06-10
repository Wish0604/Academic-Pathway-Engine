import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, BrainCircuit } from 'lucide-react';
import UserForm from '../components/UserForm';
import RecommendationCard from '../components/RecommendationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getRecommendation } from '../services/recommendationEngine';
import { getAiRecommendation } from '../services/geminiService';
import { createSubmission } from '../services/supabase';
import { RecommendationResult, Submission } from '../types';

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recResult, setRecResult] = useState<{
    result: RecommendationResult;
    email: string;
  } | null>(null);

  const handleFormSubmit = async (
    formData: Omit<Submission, 'id' | 'recommendation' | 'reason' | 'created_at'> & { engineMode: 'rules' | 'ai' }
  ) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Calculate Recommendation (AI or Rule-Based)
      let calculatedRec: RecommendationResult;

      if (formData.engineMode === 'ai') {
        calculatedRec = await getAiRecommendation({
          qualification: formData.qualification,
          experience: formData.experience,
          career_goal: formData.career_goal,
          profession: formData.profession,
          full_name: formData.full_name,
        });
      } else {
        calculatedRec = getRecommendation({
          qualification: formData.qualification,
          experience: formData.experience,
          career_goal: formData.career_goal,
          profession: formData.profession,
          full_name: formData.full_name,
        });
        // Artificial short delay for high-quality professional loading experience
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      // 2. Persist to Firestore DB / Supabase DB / local storage
      await createSubmission({
        full_name: formData.full_name,
        email: formData.email,
        qualification: formData.qualification,
        experience: formData.experience,
        profession: formData.profession,
        career_goal: formData.career_goal,
        recommendation: calculatedRec.recommendation,
        reason: calculatedRec.reason,
      });

      // 3. Show resulting card
      setRecResult({
        result: calculatedRec,
        email: formData.email,
      });
    } catch (err: any) {
      console.error('Submission failed', err);
      setErrorMsg(err.message || 'There was an issue processing your submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRecResult(null);
    setErrorMsg(null);
  };

  return (
    <div id="home-page-view" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-10 max-w-3xl mx-auto flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-bold shadow-xs">
          <BrainCircuit className="h-4 w-4" />
          Scoring-Based Assessment Platform
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 sm:leading-tight">
          Find Your Perfect <span className="text-blue-600 relative inline-block">Academic Pathway <span className="absolute bottom-1.5 left-0 w-full h-1 bg-blue-100/60 -z-10" /></span>
        </h2>
        
        <p className="text-sm sm:text-base font-medium text-slate-500 leading-relaxed max-w-2xl">
          Instantly evaluate your academic background, experience, and professional goals using our rule-weighted pathway model. 
          Discover tailored, accredited educational strategies that maximize your career ROI.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Main interactive area */}
        <AnimatePresence mode="wait">
          {isSubmitting && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 bg-white border border-slate-200 shadow-xl rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto/10"
            >
              <LoadingSpinner
                message="Analyzing Profile & Computing Scores..."
                subMessage="Calculating weights, mapping experience, and saving validated pathway schemas to our cloud database..."
              />
            </motion.div>
          )}

          {!isSubmitting && recResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto"
            >
              <RecommendationCard
                result={recResult.result}
                email={recResult.email}
                onReset={handleReset}
              />
            </motion.div>
          )}

          {!isSubmitting && !recResult && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Side: Elegant Live Design Illustration without card */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center select-none w-full">
                  <div className="w-full max-w-[340px] sm:max-w-[380px] lg:max-w-full mx-auto">
                    <svg viewBox="0 0 400 320" className="w-full h-auto drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Ground Shadow */}
                      <ellipse cx="200" cy="295" rx="130" ry="7" fill="#E2E8F0" />
                      
                      {/* Bookshelf Frame */}
                      {/* Left Pillar */}
                      <rect x="135" y="125" width="6" height="155" rx="3" fill="#94A3B8" />
                      <circle cx="138" cy="122" r="4.5" fill="#3B82F6" />
                      
                      {/* Right Pillar */}
                      <rect x="259" y="125" width="6" height="155" rx="3" fill="#94A3B8" />
                      <circle cx="262" cy="122" r="4.5" fill="#3B82F6" />
                      
                      {/* Shelves */}
                      {/* Shelf 1 (Top) */}
                      <rect x="120" y="136" width="160" height="6" rx="3" fill="#64748B" />
                      {/* Shelf 2 (Middle) */}
                      <rect x="120" y="195" width="160" height="6" rx="3" fill="#64748B" />
                      {/* Shelf 3 (Bottom) */}
                      <rect x="120" y="254" width="160" height="6" rx="3" fill="#64748B" />

                      {/* Top Shelf Items */}
                      {/* Document Filing Box */}
                      <rect x="145" y="86" width="36" height="50" rx="3" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
                      <rect x="151" y="102" width="24" height="6" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
                      <path d="M145 94H181" stroke="#64748B" strokeWidth="2" />
                      <rect x="155" y="78" width="16" height="8" rx="1" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />

                      {/* The Person Sitting on Shelf */}
                      {/* Dangling Legs (Green, dangling down over the top shelf) */}
                      {/* Left Leg */}
                      <path d="M202 135V168C202 173 195 175 195 178" stroke="#22C55E" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M202 135V168C202 173 195 175 195 178" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      {/* Right Leg */}
                      <path d="M222 135V168C222 173 229 175 229 178" stroke="#22C55E" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M222 135V168C222 173 229 175 229 178" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                      {/* Body/Dress (Spotted circle/pattern) */}
                      <ellipse cx="212" cy="118" rx="18" ry="22" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
                      {/* Dots on Shirt */}
                      <circle cx="206" cy="110" r="2" fill="#94A3B8" />
                      <circle cx="218" cy="108" r="2" fill="#94A3B8" />
                      <circle cx="209" cy="122" r="2" fill="#94A3B8" />
                      <circle cx="219" cy="120" r="2" fill="#94A3B8" />

                      {/* Neck */}
                      <rect x="209" y="86" width="6" height="10" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />

                      {/* Head */}
                      <circle cx="212" cy="76" r="14" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
                      
                      {/* Hair (Blue) */}
                      <path d="M198 76C198 64 202 62 212 62C222 62 226 64 226 76C226 80 222 82 222 86C220 80 218 78 212 78C206 78 204 80 202 86C202 82 198 80 198 76Z" fill="#93C5FD" stroke="#2563EB" strokeWidth="2" strokeLinejoin="round" />
                      
                      {/* Face/Smile */}
                      <path d="M209 78Q212 81 215 78" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="208" cy="73" r="1" fill="#64748B" />
                      <circle cx="216" cy="73" r="1" fill="#64748B" />

                      {/* Arms holding paper */}
                      {/* Left Arm */}
                      <path d="M196 112C190 119 194 127 204 125" stroke="#64748B" strokeWidth="2" strokeLinecap="round" fill="none" />
                      {/* Right Arm */}
                      <path d="M228 112C234 119 230 127 220 125" stroke="#64748B" strokeWidth="2" strokeLinecap="round" fill="none" />

                      {/* White Document Paper */}
                      <g className="animate-pulse">
                        <rect x="224" y="81" width="22" height="30" rx="1.5" fill="white" stroke="#64748B" strokeWidth="2" transform="rotate(-12 235 96)" />
                        {/* Lines on paper */}
                        <line x1="227" y1="88" x2="240" y2="85" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" transform="rotate(-12 235 96)" />
                        <line x1="226" y1="94" x2="241" y2="91" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" transform="rotate(-12 235 96)" />
                        <line x1="225" y1="100" x2="237" y2="97" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" transform="rotate(-12 235 96)" />
                      </g>

                      {/* Middle Shelf Items */}
                      {/* Stacked Books on left */}
                      <rect x="140" y="181" width="30" height="14" rx="1.5" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
                      <rect x="144" y="173" width="22" height="8" rx="1" fill="#93C5FD" stroke="#2563EB" strokeWidth="2" />

                      {/* Bottom Shelf Items */}
                      {/* Stack of Books in center */}
                      <rect x="165" y="240" width="30" height="14" rx="1.5" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
                      <rect x="168" y="234" width="24" height="6" rx="1" fill="#22C55E" stroke="#166534" strokeWidth="2" />

                      {/* Table/Mantle Clock on right */}
                      <circle cx="225" cy="235" r="11" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
                      <path d="M225 246L222 250H228L225 246Z" fill="#64748B" stroke="#64748B" strokeWidth="1.5" />
                      {/* Clock hands */}
                      <line x1="225" y1="235" x2="225" y2="229" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="225" y1="235" x2="231" y2="235" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  
                  <div className="text-center space-y-1.5 mt-6 max-w-xs">
                    <h4 className="text-sm font-bold text-slate-700">Explore Degree Tracks</h4>
                    <p className="text-xs font-semibold text-slate-400">
                      Compare post-graduate degree pathways matching your profiles.
                    </p>
                  </div>
                </div>

                {/* Right Side: The Form inside its own separate card */}
                <div className="lg:col-span-7 bg-white border border-slate-200 shadow-xl rounded-2xl p-6 sm:p-8">
                  <div className="border-b border-slate-100 pb-5 mb-5 select-none text-slate-800">
                    <h3 className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      Academic & Professional Profile
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">Please fill in yours or your target profile credentials below</p>
                  </div>

                  {errorMsg && (
                    <div id="error-message-banner" className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm font-semibold text-red-800 flex items-start gap-2">
                      <span className="shrink-0 text-lg">⚠️</span>
                      <p>{errorMsg}</p>
                    </div>
                  )}

                  <UserForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
