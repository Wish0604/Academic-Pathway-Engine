import { motion } from 'motion/react';
import { Award, RefreshCw, Send, CheckCircle2, Bookmark, ExternalLink } from 'lucide-react';
import { RecommendationResult } from '../types';

interface RecommendationCardProps {
  result: RecommendationResult;
  onReset: () => void;
  email: string;
}

export default function RecommendationCard({ result, onReset, email }: RecommendationCardProps) {
  const getBadgeStyles = (pathName: string) => {
    const norm = pathName.toLowerCase();
    if (norm.includes('phd')) {
      return {
        bg: 'bg-indigo-50 border-indigo-100',
        text: 'text-indigo-800',
        badge: '🎓 Doctoral Research',
        glow: 'shadow-indigo-500/5',
      };
    }
    if (norm.includes('dba')) {
      return {
        bg: 'bg-emerald-50 border-emerald-100',
        text: 'text-emerald-800',
        badge: '👔 Executive Leadership',
        glow: 'shadow-emerald-500/5',
      };
    }
    if (norm.includes('honorary')) {
      return {
        bg: 'bg-amber-50 border-amber-100',
        text: 'text-amber-800',
        badge: '🎖 Landmark Contribution',
        glow: 'shadow-amber-500/5',
      };
    }
    if (norm.includes('master')) {
      return {
        bg: 'bg-sky-50 border-sky-100',
        text: 'text-sky-800',
        badge: '📚 Advanced Specialization',
        glow: 'shadow-sky-500/5',
      };
    }
    if (norm.includes('bachelor')) {
      return {
        bg: 'bg-blue-50 border-blue-100',
        text: 'text-blue-800',
        badge: '🏛 Academic Core',
        glow: 'shadow-blue-500/5',
      };
    }
    return {
      bg: 'bg-rose-50 border-rose-100',
      text: 'text-rose-800',
      badge: '⚡ Career Acceleration',
      glow: 'shadow-rose-500/5',
    };
  };

  const style = getBadgeStyles(result.recommendation);

  return (
    <motion.div
      id="recommendation-result-card"
      initial={{ opacity: 0, scale: 0.98, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className={`rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl ${style.glow}`}
    >
      <div className="flex flex-col gap-6">
        {/* Card Header Decors */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">Analysis Complete</span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Your Academic Pathway</h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
            <Award className="h-6 w-6 animate-pulse" />
          </div>
        </div>

        {/* The Resulting Path Box */}
        <div className={`p-5 sm:p-6 rounded-2xl border ${style.bg} transition-all`}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${style.bg} ${style.text}`}>
                {style.badge}
              </span>
              <span className="text-xs font-semibold text-slate-400">Path Option</span>
            </div>

            <div className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight leading-none mt-1">
              {result.recommendation}
            </div>

            <div className="h-px bg-slate-200/50 my-2" />

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Strategic Fit & Reason:</span>
              <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-600">
                {result.reason}
              </p>
            </div>
          </div>
        </div>

        {/* Informative Step Box list */}
        <div className="flex flex-col gap-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 p-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Bookmark className="h-3.5 w-3.5 text-blue-500" />
            Recommended Next Steps
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-slate-600">
                <strong>Save Record:</strong> This recommendation has been securely stored in index log archives.
              </p>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-slate-600">
                <strong>Schedule Consultation:</strong> Search accredited institutions offering <span className="underline decoration-blue-400 font-semibold text-slate-700">{result.recommendation}</span> programs matching your profile.
              </p>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-slate-600">
                <strong>Notifications:</strong> An academic summary report is cached for reference under <span className="font-semibold text-slate-700">{email}</span>.
              </p>
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            id="reset-form-button"
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all active:scale-[0.985] cursor-pointer"
          >
            <RefreshCw className="h-4.5 w-4.5" />
            Evaluate New Profile
          </button>
          
          <a
            id="external-search-button"
            href={`https://www.google.com/search?q=${encodeURIComponent(result.recommendation + ' accredited degree programs')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/10 transition-all active:scale-[0.985] cursor-pointer"
          >
            Find Accredited Programs
            <ExternalLink className="h-4.5 w-4.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
