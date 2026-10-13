'use client';
import { useState, useEffect } from 'react';

export default function LockScreen({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // შენი საიდუმლო პაროლი
  const SECRET_PASSWORD = 'LifePulseVIP2026';

  useEffect(() => {
    const savedAuth = localStorage.getItem('lifepulse_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('lifepulse_authenticated', 'true');
      setError(false);
    } else {
      setError(true);
    }
  };

  // ჩატვირთვის პროცესი
  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-black" />;
  }

  // თუ პაროლი სწორია, აჩვენებს შენს ჩვეულებრივ აპლიკაციას
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // თუ ავტორიზებული არ არის, აჩვენებს პაროლის ეკრანს
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
          <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2">LifePulse OS</h1>
        <p className="text-zinc-400 text-sm mb-6">Enter your access key to unlock the application.</p>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter Access Key..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-center text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {error && (
            <p className="text-rose-500 text-xs">Invalid Access Key. Please check your Access Guide PDF.</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl transition shadow-lg shadow-emerald-500/20"
          >
            Unlock Access
          </button>
        </form>
      </div>
    </div>
  );
}