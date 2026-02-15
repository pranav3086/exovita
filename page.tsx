"use client";

import React, { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { 
  Globe, Activity, Play, 
  RefreshCw, Rocket, ChevronDown, 
  BarChart3, ExternalLink, Zap, Brain
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import HabitabilityChart from "@/components/HabitabilityChart";

const PlanetScene = dynamic(() => import("@/components/PlanetScene"), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center text-cyan-400 font-mono">INITIALIZING NEURAL LINK...</div>,
});

// Mock data reflecting Mesa ABM modules from PRD 
const populationData = [
  { year: 0, producers: 10, consumers: 0, decomposers: 5 },
  { year: 100, producers: 450, consumers: 80, decomposers: 40 },
  { year: 500, producers: 1200, consumers: 300, decomposers: 150 },
  { year: 1000, producers: 800, consumers: 600, decomposers: 400 },
  { year: 10000, producers: 1500, consumers: 900, decomposers: 600 },
];

export type PlanetData = {
  id: string;
  name: string;
  gravity: string;
  temp: string;
  baseColor1: string;
  baseColor2: string;
  plantColor: string;
  waterColor: string;
  terraformDifficulty: number;
  chartData: { x: number; y: number }[];
};

export const PLANET_DB: PlanetData[] = [
  {
    id: "earth_ref",
    name: "Earth (Reference)",
    gravity: "1.0 G",
    temp: "15°C",
    baseColor1: "#1E90FF",
    baseColor2: "#1E90FF",
    plantColor: "#228B22",
    waterColor: "#1E90FF",
    terraformDifficulty: 0.0,
    chartData: [{ x: 0, y: 100 }, { x: 10000, y: 100 }]
  },
  {
    id: "mars",
    name: "Mars",
    gravity: "0.38 G",
    temp: "-63°C",
    baseColor1: "#C1440E",
    baseColor2: "#6E260E",
    plantColor: "#4F7942",
    waterColor: "#4682B4",
    terraformDifficulty: 0.5, 
    chartData: [{ x: 0, y: 0 }, { x: 100, y: 15 }, { x: 1000, y: 60 }, { x: 5000, y: 80 }, { x: 10000, y: 95 }]
  },
  {
    id: "kepler12",
    name: "Kepler-12b",
    gravity: "1.4 G",
    temp: "-120°C",
    baseColor1: "#A5F2F3",
    baseColor2: "#E0FFFF",
    plantColor: "#00CED1",
    waterColor: "#5F9EA0",
    terraformDifficulty: 0.4,
    chartData: [{ x: 0, y: 0 }, { x: 2000, y: 0 }, { x: 5000, y: 25 }, { x: 8000, y: 60 }, { x: 10000, y: 85 }]
  },
];

// Sub-component for the Advanced Analytics Dashboard
const PostSimDashboard = ({ habitabilityScore, onReturn }: { habitabilityScore: number, onReturn: () => void }) => {
  const [activeTab, setActiveTab] = useState<'bio' | 'strategy'>('bio');

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-10 animate-in fade-in zoom-in duration-500">
      <div className="bg-[#0a0f1a]/95 border border-cyan-900/50 rounded-[3rem] w-full max-w-6xl h-[750px] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(34,211,238,0.15)]">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-2xl font-black tracking-[0.2em] text-cyan-400 uppercase">Mission Analytics</h2>
            <p className="text-[10px] text-white/40 font-mono tracking-widest mt-1 uppercase">Simulation Verification: Rust WASM Active [cite: 12]</p>
          </div>
          <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/10">
            <button onClick={() => setActiveTab('bio')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'bio' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-white/40 hover:text-white'}`}>Ecosystem Data</button>
            <button onClick={() => setActiveTab('strategy')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'strategy' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-white/40 hover:text-white'}`}>AI Seeding Strategy</button>
          </div>
        </div>

        <div className="flex-1 p-10 overflow-hidden flex gap-10">
          <div className="w-1/3 flex flex-col gap-6">
            <div className="p-8 bg-cyan-500/5 border border-cyan-500/20 rounded-[2rem] text-center">
              <div className="text-7xl font-black text-cyan-400 leading-none">{habitabilityScore}</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 mt-4 font-mono">Habitability Index </div>
            </div>
            <div className="flex-1 p-6 bg-white/5 border border-white/10 rounded-[2rem] font-mono space-y-4">
              <h4 className="text-[10px] text-cyan-400 font-black uppercase tracking-widest flex items-center gap-2"><Zap size={14} /> System Metrics</h4>
              <div className="flex justify-between text-[11px]"><span className="text-white/40 uppercase">Engine</span><span className="text-white font-bold">RUST WASM</span></div>
              <div className="flex justify-between text-[11px]"><span className="text-white/40 uppercase">MC Ensembles</span><span className="text-white font-bold">10,000 Runs </span></div>
              <div className="flex justify-between text-[11px]"><span className="text-white/40 uppercase">Latency</span><span className="text-white font-bold">1.2s</span></div>
            </div>
          </div>

          <div className="flex-1 bg-black/40 rounded-[2rem] border border-white/10 p-8 overflow-hidden">
            {activeTab === 'bio' ? (
              <div className="h-full flex flex-col">
                <h3 className="text-xs font-black text-white/60 uppercase tracking-[0.2em] mb-8">Population Trends: Producers/Consumers/Decomposers </h3>
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
                <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><Brain size={18} /> Seeding Strategy Evaluator </h3>
                <div className="text-sm font-mono text-white/70 leading-relaxed overflow-y-auto pr-4 space-y-4">
                  <p>Deployment of Extremophile Cyanobacteria on this planet shows a 84.2% success rate over the 500-year horizon. Atmospheric CO2 levels projected to drop significantly following initial seeding[cite: 17].</p>
                  <p className="text-purple-400">Target Organisms: Chroococcidiopsis variants optimized for high stellar flux.</p>
                  <p className="text-purple-400">Risk Assessment: Sensitivity analysis indicates core-composition instability[cite: 17].</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-10 py-6 border-t border-white/5 flex justify-between items-center bg-white/5">
          <button onClick={onReturn} className="flex items-center gap-3 text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em] font-mono transition-all group">
            <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700"/> Return to Telemetry
          </button>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">Export JSON</button>
            <button className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-cyan-500/20">Finalize Protocol</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PlanetaryDashboard() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData>(PLANET_DB[1]);
  const [year, setYear] = useState(10);
  const [isWarping, setIsWarping] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [simState, setSimState] = useState<"idle" | "loading" | "result">("idle");
  const [isPending, startTransition] = useTransition();

  const handlePlanetChange = (planet: PlanetData) => {
    if (planet.id === selectedPlanet.id) return;
    setIsWarping(true);
    setSimState("idle");
    setIsDropdownOpen(false);
    setTimeout(() => {
      startTransition(() => {
        setSelectedPlanet(planet);
        setYear(10); 
        setIsWarping(false);
      });
    }, 1000);
  };

  const runSimulation = () => {
    setSimState("loading");
    setTimeout(() => setSimState("result"), 1200);
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0B0D17] text-white">
      <div className={`absolute inset-0 z-0 transition-all duration-1000 ${isWarping ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}>
        <PlanetScene planet={selectedPlanet} year={year} isWarping={isWarping} />
      </div>

      <header className="relative z-50 flex items-center justify-between px-10 py-8">
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-2xl">
          <Globe className="text-cyan-400 w-6 h-6" />
          <div>
            <h1 className="font-sans text-2xl font-bold tracking-[0.2em]">EXOVITA</h1>
            <p className="text-[11px] text-white/40 tracking-[0.3em] uppercase">Digital Twin Paradigm [cite: 7]</p>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 rounded-xl bg-slate-900/60 backdrop-blur-md px-6 py-3 font-mono text-sm border border-white/10 hover:border-cyan-400 transition-all">
              {selectedPlanet.name} <ChevronDown size={18} className="text-cyan-400" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-64 rounded-2xl border border-white/10 bg-[#0B0D17]/95 backdrop-blur-2xl z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                {PLANET_DB.map((p) => (
                  <button key={p.id} onClick={() => handlePlanetChange(p)} className="w-full px-6 py-4 text-left font-mono text-xs hover:bg-cyan-500/20 hover:text-cyan-400 border-b border-white/5 last:border-0 transition-colors">
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={runSimulation} className="bg-cyan-500 hover:bg-cyan-400 text-black px-10 py-3 rounded-xl font-black tracking-widest transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center gap-2">
            <Play size={18} fill="currentColor"/> RUN SIM
          </button>
        </div>
      </header>

      <div className={`absolute top-32 left-10 flex flex-col gap-8 z-40 transition-all duration-1000 ${simState !== "idle" ? "-translate-x-[120%] opacity-0" : "translate-x-0 opacity-100"}`}>
        <div className="w-80 bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
          <h3 className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3"><Activity size={16}/> Telemetry Data [cite: 7]</h3>
          <div className="space-y-6 font-mono">
            <div className="flex justify-between items-center"><span className="text-[10px] text-white/40 uppercase">Gravity</span><span className="text-lg text-white">{selectedPlanet.gravity}</span></div>
            <div className="flex justify-between items-center"><span className="text-[10px] text-white/40 uppercase">Temp</span><span className="text-lg text-red-400">{selectedPlanet.temp}</span></div>
            <div className="pt-6 mt-2 border-t border-white/10">
              <div className="flex justify-between text-amber-400 mb-4 items-center"><span className="text-[10px] uppercase font-bold tracking-widest">Projection</span><span className="text-sm">T+{year}Y</span></div>
              <input type="range" min="0" max="10000" step="100" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400" />
            </div>
          </div>
        </div>

        <div className="w-80 bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 h-60 shadow-2xl">
          <h3 className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><BarChart3 size={16}/> Habitability Score </h3>
          <div className="h-32"><HabitabilityChart year={year} data={selectedPlanet.chartData} /></div>
        </div>
      </div>

      <div className={`absolute top-32 right-10 flex flex-col gap-8 z-40 transition-all duration-1000 ${simState !== "idle" ? "translate-x-[120%] opacity-0" : "translate-x-0 opacity-100"}`}>
        <div className="w-80 bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
          <h3 className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">Registry Search</h3>
          <form className="relative mb-6"><input type="text" placeholder="Search NASA Archives..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] focus:outline-none focus:border-cyan-400 transition-all" /></form>
          <div className="p-5 rounded-2xl bg-cyan-400/5 border border-cyan-400/10 text-[10px] text-white/50 leading-relaxed font-mono italic">"Cross-referencing real-time telemetry with interstellar database [cite: 6]"</div>
          <button className="mt-8 flex items-center justify-center gap-3 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group"><ExternalLink size={14} className="group-hover:text-cyan-400 transition-colors"/> View Full Archives</button>
        </div>
      </div>

      {simState === "result" && (
        <PostSimDashboard 
          habitabilityScore={Math.round((1 - selectedPlanet.terraformDifficulty) * 100)}
          onReturn={() => setSimState("idle")}
        />
      )}

      {simState === "loading" && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center bg-[#0B0D17]/80 backdrop-blur-xl">
          <div className="flex gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-4 w-4 animate-bounce rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]" style={{animationDelay: `${i * 0.15}s`}}></div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}