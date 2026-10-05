import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import './index.css';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f9f9ff' }}>
      {/* Fixed dark sidebar */}
      <div className="fixed top-0 left-0 h-full z-50">
        <Sidebar activeView={activeView} onNavigate={setActiveView} />
      </div>

      {/* Main content — offset by sidebar width (w-64 = 256px) */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: '256px' }}>
        <Dashboard />
      </div>
    </div>
  );
}
