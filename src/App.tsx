import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Submissions from './pages/Submissions';

export default function App() {
  return (
    <BrowserRouter>
      <div id="app-root-layout" className="min-h-screen bg-slate-50 flex flex-col antialiased">
        {/* Persistent Modular Navbar */}
        <Navbar />

        {/* Dynamic Route Pages */}
        <main id="main-content-area" className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submissions" element={<Submissions />} />
            {/* Fallback routing */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Global Clean Footer */}
        <footer id="app-footer" className="bg-white border-t border-slate-200 py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left select-none text-slate-800">
            <p className="text-xs font-semibold text-slate-400">
              © {new Date().getFullYear()} Academic Pathway Engine. Built for the Internship Evaluation Challenge.
            </p>
            <p className="text-xs font-bold text-slate-300 tracking-tight">
              Cloud Persistence enabled • Zero Dependencies Leak
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
