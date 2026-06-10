import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  fetchSubmissions,
  isUsingCloudDb
} from '../services/supabase';
import { Submission } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Search, 
  Database, 
  GraduationCap, 
  UserSquare2, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  CalendarClock, 
  AlertCircle,
  FileCheck,
  Share2
} from 'lucide-react';

export default function Submissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchSubmissions();
        setSubmissions(data);
      } catch (err) {
        console.error('Failed to load submissions', err);
        setErrorMsg('Could not fetch records. Please check the integrity of your database connection.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter submissions by query
  const filteredSubmissions = submissions.filter((sub) => {
    const q = searchQuery.toLowerCase();
    return (
      sub.full_name.toLowerCase().includes(q) ||
      sub.email.toLowerCase().includes(q) ||
      sub.recommendation.toLowerCase().includes(q) ||
      sub.profession.toLowerCase().includes(q)
    );
  });

  // Calculate stats
  const totalCount = submissions.length;
  
  const avgExperience = totalCount > 0 
    ? Math.round((submissions.reduce((acc, sub) => acc + sub.experience, 0) / totalCount) * 10) / 10
    : 0;

  // Chart distribution tallies
  const tallies: Record<string, number> = {
    'PhD': 0,
    'DBA': 0,
    'Honorary Doctorate': 0,
    'Master’s Degree': 0,
    'Bachelor’s Degree': 0,
    'Professional Certification': 0,
  };

  submissions.forEach((sub) => {
    const rec = sub.recommendation.toLowerCase();
    if (rec.includes('phd')) tallies['PhD']++;
    else if (rec.includes('dba')) tallies['DBA']++;
    else if (rec.includes('honorary')) tallies['Honorary Doctorate']++;
    else if (rec.includes('master')) tallies['Master’s Degree']++;
    else if (rec.includes('bachelor')) tallies['Bachelor’s Degree']++;
    else tallies['Professional Certification']++;
  });

  // Find most popular
  let mostPopularName = 'N/A';
  let mostPopularVal = 0;
  Object.entries(tallies).forEach(([name, count]) => {
    if (count > mostPopularVal) {
      mostPopularVal = count;
      mostPopularName = name;
    }
  });

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // Safe color mapper for paths
  const getColorClassesForPath = (name: string) => {
    const norm = name.toLowerCase();
    if (norm.includes('phd')) return 'bg-indigo-50 border-indigo-200 text-indigo-700';
    if (norm.includes('dba')) return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    if (norm.includes('honorary')) return 'bg-amber-50 border-amber-200 text-amber-700';
    if (norm.includes('master')) return 'bg-sky-50 border-sky-200 text-sky-700';
    if (norm.includes('bachelor')) return 'bg-blue-50 border-blue-200 text-blue-700';
    return 'bg-rose-50 border-rose-200 text-rose-700';
  };

  return (
    <div id="submissions-page-view" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-tight flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-600" />
            Candidate Admissions Dashboard
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">Review historic pathway results, demographic indicators, and profile logs</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Storage status:</span>
          {isUsingCloudDb() ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live Supabase Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
              Demo Local Mode
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <LoadingSpinner message="Fetching Pathway Archives..." subMessage="Querying our database collection and running real-time analytics calculations..." />
        </div>
      ) : errorMsg ? (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-center max-w-xl mx-auto space-y-4">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Unable to Load Archives</h3>
          <p className="text-sm font-semibold text-red-800 leading-relaxed">{errorMsg}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Analytics Cards Header Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Stat Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4.5">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <UserSquare2 className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Submissions</span>
                <span className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalCount}</span>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4.5">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Work Experience</span>
                <span className="text-2xl font-extrabold text-slate-900 mt-0.5">
                  {avgExperience} {avgExperience === 1 ? 'Year' : 'Years'}
                </span>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4.5 sm:col-span-2 lg:col-span-1">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Most Popular Path</span>
                <span className="text-lg font-extrabold text-slate-800 leading-tight mt-1 truncate max-w-[220px]">
                  {mostPopularName} {mostPopularVal > 0 && `(${mostPopularVal})`}
                </span>
              </div>
            </div>
          </div>

          {/* Graph Section */}
          {totalCount > 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Pathway Distribution Density</h3>
                <p className="text-xs font-semibold text-slate-400">Proportional representation of recommended programs based on candidate experience profiles</p>
              </div>

              {/* Responsive Pure CSS Chart */}
              <div className="space-y-4 pt-1.5">
                {Object.entries(tallies).map(([name, count]) => {
                  const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                  return (
                    <div key={name} className="flex flex-col sm:flex-row sm:items-center gap-2 group">
                      <div className="sm:w-1/4 text-xs font-bold text-slate-700 truncate">{name}</div>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="h-full bg-blue-600 rounded-full"
                          />
                        </div>
                        <div className="text-xs font-bold text-slate-400 shrink-0 select-none w-12 text-right">
                          {count} ({percentage}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-10 text-center text-slate-500 font-semibold text-sm">
              Submit your profile first to populate the distribution curves!
            </div>
          )}

          {/* Submissions Section */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Search, filters operations bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4 items-center">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search by full name, profession, or pathway..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-slate-50/20 pl-11 pr-4 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 transition-all"
                />
              </div>

              <div className="text-xs font-bold text-slate-400 mr-2 shrink-0">
                Found {filteredSubmissions.length} of {totalCount} records
              </div>
            </div>

            {/* Submissions List Display */}
            {filteredSubmissions.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-semibold text-sm">
                No matching candidate logs recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-100 uppercase text-[10px] font-extrabold tracking-wider text-slate-500">
                      <th className="py-4.5 px-6">Name & Email</th>
                      <th className="py-4.5 px-6">Goal</th>
                      <th className="py-4.5 px-6">Current Profession</th>
                      <th className="py-4.5 px-6">Recommendation</th>
                      <th className="py-4.5 px-0 text-center w-20">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubmissions.map((sub) => {
                      const isExpanded = expandedId === sub.id;
                      return (
                        <React.Fragment key={sub.id}>
                          <tr className="hover:bg-slate-50/40 transition-colors">
                            <td className="py-4 px-6">
                              <p className="font-bold text-slate-800 text-sm leading-none">{sub.full_name}</p>
                              <p className="text-xs text-slate-400 mt-1 font-medium">{sub.email}</p>
                            </td>
                            <td className="py-4 px-6 max-w-[240px] truncate text-xs font-medium text-slate-500">
                              {sub.career_goal}
                            </td>
                            <td className="py-4 px-6">
                              <p className="text-xs font-bold text-slate-700">{sub.profession}</p>
                              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Exp: {sub.experience} yrs • {sub.qualification}</p>
                            </td>
                            <td className="py-4 px-6 text-xs font-bold">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${getColorClassesForPath(sub.recommendation)}`}>
                                {sub.recommendation}
                              </span>
                            </td>
                            <td className="py-4 px-0 text-center">
                              <button
                                id={`expand-toggle-${sub.id}`}
                                onClick={() => toggleExpand(sub.id!)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                              >
                                {isExpanded ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                              </button>
                            </td>
                          </tr>

                          {/* Expandable detailed row panel */}
                          <AnimatePresence>
                            {isExpanded && (
                              <tr className="bg-slate-50/50">
                                <td colSpan={5} className="py-5 px-6 border-b border-slate-100">
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-xs text-slate-700 leading-relaxed overflow-hidden space-y-4"
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 gap-y-3.5">
                                      <div className="md:col-span-4 space-y-1">
                                        <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Candidate Demographic</h4>
                                        <p className="font-medium"><strong>Full Name:</strong> {sub.full_name}</p>
                                        <p className="font-medium"><strong>Email:</strong> {sub.email}</p>
                                        <p className="font-medium"><strong>Profession:</strong> {sub.profession}</p>
                                        <p className="font-medium"><strong>Current Highest:</strong> {sub.qualification}</p>
                                        <p className="font-medium"><strong>Years Experience:</strong> {sub.experience} Years</p>
                                      </div>

                                      <div className="md:col-span-8 flex flex-col gap-3">
                                        <div>
                                          <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Career Goals</h4>
                                          <p className="font-medium text-slate-600 mt-1 leading-relaxed bg-white border border-slate-100 rounded-xl p-3 shadow-xs">
                                            "{sub.career_goal}"
                                          </p>
                                        </div>

                                        <div>
                                          <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Recommendation Rationale</h4>
                                          <p className="font-semibold text-slate-700 mt-1 leading-relaxed bg-blue-50/30 border border-blue-50 rounded-xl p-3 shadow-xs">
                                            <strong>{sub.recommendation}</strong>: {sub.reason}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-200/50 pt-3">
                                      {sub.created_at && (
                                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                          <CalendarClock className="h-3 w-3" />
                                          Recorded on {sub.created_at.toLocaleDateString?.() || new Date(sub.created_at).toLocaleDateString()} at {sub.created_at.toLocaleTimeString?.() || new Date(sub.created_at).toLocaleTimeString()}
                                        </span>
                                      )}
                                      <span className="text-[10px] text-slate-300 font-medium tracking-tight">Record Ref: #{sub.id}</span>
                                    </div>
                                  </motion.div>
                                </td>
                              </tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
