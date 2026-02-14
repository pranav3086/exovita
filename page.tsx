"use client";

import React, { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { 
  Globe, Activity, Wind, Thermometer, Play, 
  RefreshCw, Rocket, ChevronDown, 
  Clock, Search, BarChart3, ExternalLink
} from "lucide-react";
import HabitabilityChart from "@/components/HabitabilityChart";

const PlanetScene = dynamic(() => import("@/components/PlanetScene"), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center text-cyan-400 font-mono">INITIALIZING NEURAL LINK...</div>,
});

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
    setTimeout(() => setSimState("result"), 800);
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0B0D17] text-white">
      <div className={`absolute inset-0 z-0 transition-all duration-1000 ${isWarping ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}>
        <PlanetScene planet={selectedPlanet} year={year} isWarping={isWarping} />
      </div>

      {/* HEADER: Spaced out with wider padding */}
      <header className="relative z-50 flex items-center justify-between px-10 py-8">
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-2xl">
          <Globe className="text-cyan-400 w-6 h-6" />
          <div>
            <h1 className="font-sans text-2xl font-bold tracking-[0.2em]">EXOVITA</h1>
            <p className="text-[11px] text-white/40 tracking-[0.3em] uppercase">Advanced Planetary Modeling</p>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 rounded-xl bg-slate-900/60 backdrop-blur-md px-6 py-3 font-mono text-sm border border-white/10 hover:border-cyan-400 transition-all"
            >
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

      {/* LEFT COLUMN: PARAMETERS + CHART (Better Spacing) */}
      <div className={`absolute top-32 left-10 flex flex-col gap-8 z-40 transition-all duration-1000 ${simState !== "idle" ? "-translate-x-[120%] opacity-0" : "translate-x-0 opacity-100"}`}>
        <div className="w-80 bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
          <h3 className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <Activity size={16}/> Telemetry Data
          </h3>
          <div className="space-y-6 font-mono">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-white/40 uppercase">Gravity</span>
              <span className="text-lg text-white">{selectedPlanet.gravity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-white/40 uppercase">Temp</span>
              <span className="text-lg text-red-400">{selectedPlanet.temp}</span>
            </div>
            <div className="pt-6 mt-2 border-t border-white/10">
              <div className="flex justify-between text-amber-400 mb-4 items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest">Temporal Projection</span>
                <span className="text-sm">T+{year}Y</span>
              </div>
              <input type="range" min="0" max="10000" step="100" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400" />
            </div>
          </div>
        </div>

        <div className="w-80 bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 h-60 shadow-2xl">
          <h3 className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
            <BarChart3 size={16}/> Habitability
          </h3>
          <div className="h-32">
            <HabitabilityChart year={year} data={selectedPlanet.chartData} />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: SEARCH + ARCHIVES (Better Spacing) */}
      <div className={`absolute top-32 right-10 flex flex-col gap-8 z-40 transition-all duration-1000 ${simState !== "idle" ? "translate-x-[120%] opacity-0" : "translate-x-0 opacity-100"}`}>
        <div className="w-80 bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
          <h3 className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
             Registry Search
          </h3>
          <form action="/exoplanet_ai_system.html" method="get" className="relative mb-6">
             <input 
               type="text" 
               name="search" // This creates the ?search= parameter
               placeholder="Search NASA Archives..." 
               className="..." />
            
          </form>
          <div className="p-5 rounded-2xl bg-cyan-400/5 border border-cyan-400/10 text-[10px] text-white/50 leading-relaxed font-mono italic">
            "Cross-referencing real-time telemetry with interstellar database 2021.04"
          </div>
          <a href="/exoplanet_ai_system.html" className="mt-8 flex items-center justify-center gap-3 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group">
            <ExternalLink size={14} className="group-hover:text-cyan-400 transition-colors"/> View Full Archives
          </a>
        </div>
      </div>

      {/* RESULTS OVERLAY */}
      {simState === "result" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center gap-10 px-10 animate-in fade-in zoom-in duration-700 bg-black/60 backdrop-blur-md">
           <div className="w-96 bg-slate-900/90 backdrop-blur-2xl p-10 rounded-[3rem] border border-cyan-500/30 shadow-[0_0_100px_rgba(34,211,238,0.2)]">
              <div className="text-8xl font-black text-cyan-400 mb-4 tracking-tighter">{Math.round((1 - selectedPlanet.terraformDifficulty) * 100)}</div>
              <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-8 font-mono">Habitability Index</div>
              <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full inline-block text-[10px] font-black text-cyan-400 uppercase tracking-widest">Status: Optimal</div>
           </div>
           
           <div className="w-[30rem] bg-slate-900/90 backdrop-blur-2xl p-10 rounded-[3rem] border border-purple-500/30 shadow-[0_0_100px_rgba(168,85,247,0.2)]">
              <h4 className="text-purple-400 font-black mb-6 flex items-center gap-4 uppercase tracking-[0.2em] font-mono"><Rocket size={24}/> Seeding Protocol</h4>
              <p className="font-mono text-sm text-white/70 leading-relaxed mb-10">
                Deploying Genetically Modified Extremophile Cyanobacteria. Targeted atmospheric oxygen enrichment initiated. 
              </p>
              <button onClick={() => setSimState("idle")} className="flex items-center gap-3 text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em] font-mono transition-all group">
                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700"/> Return to Telemetry
              </button>
           </div>
        </div>
      )}

      {/* LOADING STATE */}
      {simState === "loading" && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-[#0B0D17]/80 backdrop-blur-xl">
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