import { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';

const BACKEND_URL = 'http://localhost:3006';

export default function Sidebar({ activeView, onNavigate }) {
  const [isConnected, setIsConnected] = useState(null); 

  
  useEffect(() => {
    let mounted = true;

    const checkConnection = async () => {
      const ok = await checkHealth();
      if (mounted) setIsConnected(ok);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 7a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM14 7a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2V7zM3 17a2 2 0 012-2h3a2 2 0 012 2v.5A1.5 1.5 0 019.5 17H3v0zM14 17a2 2 0 012-2h3a2 2 0 012 2v.5a1.5 1.5 0 01-1.5 1.5H15.5A1.5 1.5 0 0114 17.5V17z" />
        </svg>
      ),
    },
    {
      id: 'users',
      label: 'Users',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ backgroundColor: '#0f172a' }}>
      {/* Branding */}
      <div className="px-6 py-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: '#004e9f' }}
          >
            UM
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">User Management</p>
           
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
          Navigation
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left cursor-pointer ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  style={isActive ? { backgroundColor: '#004e9f' } : {}}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Backend Status */}
      <div className="px-4 py-4 border-t border-slate-700/50">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">
          Backend Status
        </p>
        <div className="bg-slate-800/60 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1.5">
            {isConnected === null ? (
              <>
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                <span className="text-slate-400 text-xs font-medium">Checking...</span>
              </>
            ) : isConnected ? (
              <>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs font-medium">Connected</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-red-400 text-xs font-medium">Disconnected</span>
              </>
            )}
          </div>
          <p className="text-slate-500 text-xs font-mono">{BACKEND_URL}</p>
        </div>
      </div>
    </aside>
  );
}
