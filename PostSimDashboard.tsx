import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw, Rocket, Zap, Brain } from "lucide-react";

// Mock data reflecting your ABM modules
const populationData = [
  { year: 0, producers: 10, consumers: 0, decomposers: 5 },
  { year: 100, producers: 450, consumers: 80, decomposers: 40 },
  { year: 500, producers: 1200, consumers: 300, decomposers: 150 },
  { year: 1000, producers: 800, consumers: 600, decomposers: 400 },
  { year: 10000, producers: 1500, consumers: 900, decomposers: 600 },
];

interface Props {
  habitabilityScore: number;
  onReturn: () => void;
}

const PostSimDashboard = ({ habitabilityScore, onReturn }: Props) => {
  const [activeTab, setActiveTab] = useState<'bio' | 'strategy'>('bio');

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-10 animate-in fade-in zoom-in duration-500">
      <div className="bg-[#0a0f1a]/90 border border-cyan-900/50 rounded-[3rem] w-full max-w-6xl h-[700px] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(34,211,238,0.1)]">
        
        {/* Header Section */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-2xl font-black tracking-[0.2em] text-cyan-400 uppercase">Mission Analytics</h2>
            <p className="text-[10px] text-white/40 font-mono tracking-widest mt-1">SIMULATION ID: EXO-VITA-99</p>
          </div>
          <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/10">
            <button onClick={() => setActiveTab('bio')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'bio' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-white/40 hover:text-white'}`}>
              Ecosystem Data
            </button>
            <button onClick={() => setActiveTab('strategy')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'strategy' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-white/40 hover:text-white'}`}>
              AI Seeding Strategy
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-10 overflow-hidden flex gap-10">
          
          {/* Left Panel: The score remains visible */}
          <div className="w-1/3 flex flex-col gap-6">
            <div className="p-8 bg-cyan-500/5 border border-cyan-500/20 rounded-[2rem] text-center">
              <div className="text-7xl font-black text-cyan-400 leading-none">{habitabilityScore}</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 mt-4 font-mono">Habitability Index</div>
            </div>
            
            <div className="flex-1 p-6 bg-white/5 border border-white/10 rounded-[2rem] font-mono space-y-4">
              <h4 className="text-[10px] text-cyan-400 font-black uppercase tracking-widest flex items-center gap-2">
                <Zap size={14} /> Performance Meta
              </h4>
              <div className="flex justify-between text-[11px]">
                <span className="text-white/40">ENGINE</span>
                <span className="text-white">RUST WASM</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-white/40">MC RUNS</span>
                <span className="text-white">10,000+</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-white/40">SIM TIME</span>
                <span className="text-white">1.2s</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Dynamic Content */}
          <div className="flex-1 bg-black/40 rounded-[2rem] border border-white/10 p-8">
            {activeTab === 'bio' ? (
              <div className="h-full flex flex-col">
                <h3 className="text-xs font-black text-white/60 uppercase tracking-[0.2em] mb-8">Biosphere Population Trends (T+10,000Y)</h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={populationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="year" stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0B0D17', border: '1px solid #22d3ee', borderRadius: '12px', fontSize: '10px' }} />
                      <Line type="monotone" dataKey="producers" stroke="#22d3ee" strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="consumers" stroke="#a855f7" strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="decomposers" stroke="#f59e0b" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <Brain size={18} /> Claude Sonnet 3.5 Evaluation
                </h3>
                <p className="text-sm font-mono text-white/70 leading-relaxed overflow-y-auto pr-4">
                  Deployment of Extremophile Cyanobacteria on this planet shows a 84.2% success rate over the 500-year horizon. 
                  Atmospheric CO2 levels projected to drop by 12% following initial seeding. 
                  <br /><br />
                  <span className="text-purple-400">Recommended Organisms:</span> Chroococcidiopsis variants.
                  <br /><br />
                  <span className="text-purple-400">Risks:</span> Unpredictable orbital eccentricity may cause genetic drift in founding populations.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-6 border-t border-white/5 flex justify-between items-center bg-white/5">
          <button onClick={onReturn} className="flex items-center gap-3 text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em] font-mono transition-all group">
            <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700"/> Return to Telemetry
          </button>
          <button className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostSimDashboard;