"use client";

import React, { useState, useTransition, useEffect } from "react";
import dynamic from "next/dynamic";
import { Search, Globe, ChevronDown, Activity, Wind, Thermometer, Play, RefreshCw, SkipBackIcon, SendToBackIcon, MoveLeftIcon, ArrowLeftCircleIcon } from "lucide-react";
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
    chartData: [{ x: 0, y: 100 }, { x: 1000, y: 100 }, { x: 5000, y: 100 }, { x: 10000, y: 100 }]
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
  {
    id: "planet",
    name: "new planet",
    gravity: "1.4 G",
    temp: "-120°C",
    baseColor1: "#A5F2F3",
    baseColor2: "#E0FFFF",
    plantColor: "#00CED1",
    waterColor: "#5F9EA0",
    terraformDifficulty: 0.8,
    chartData: [{ x: 0, y: 0 }, { x: 2000, y: 0 }, { x: 5000, y: 20 }, { x: 8000, y: 50 }, { x: 10000, y: 70 }]
  },
];

const TIMELINE_STEPS = [0, 100, 200, 500, 1000, 5000, 10000];

export default function PlanetaryDashboard() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData>(PLANET_DB[0]);
  const [yearIndex, setYearIndex] = useState(0);
  const [isWarping, setIsWarping] = useState(false);
  const [simState, setSimState] = useState<"idle" | "loading" | "result">("idle");
  const [isPending, startTransition] = useTransition();

  const currentYear = TIMELINE_STEPS[yearIndex];

  const handlePlanetChange = (planet: PlanetData) => {
    if (planet.id === selectedPlanet.id) return;
    setIsWarping(true);
    setSimState("idle"); // Reset UI if planet changes
    setTimeout(() => {
      startTransition(() => {
        setSelectedPlanet(planet);
        setYearIndex(0); 
        setIsWarping(false);
      });
    }, 1000);
  };

  const runSimulation = () => {
    setSimState("loading");
    setTimeout(() => {
      setSimState("result");
    }, 500);
  };

  const getSeedingStrategy = (diff: number) => {
    if (diff === 0) return "No Seeding Required: Native Ecosystem Stable.";
    if (diff < 0.5) return "Atmospheric Aerosol Injection & Pioneer Lichens.";
    if (diff <= 1.0) return "Genetically Modified Extremophile Cyanobacteria.";
    return "Deep Crust Thermal Expansion & Synthetic Spore Bombardment.";
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0B0D17] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#141414] to-[#000035] opacity-80" />

      <div className={`absolute inset-0 transition-all duration-1000 ${isWarping ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}>
        <PlanetScene planet={selectedPlanet} year={currentYear} isWarping={isWarping} />
      </div>

      {/* HEADER */}
      <header className="relative z-20 flex items-center justify-between p-6">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
          <Globe className="text-cyan-400" />
          <div>
            <h1 className="font-sans text-xl font-bold tracking-widest">EXOVITA</h1>
            <p className="text-[10px] text-white/50 tracking-wider">PLANETARY MODELING</p>
          </div>
        </div>

        <div className="group relative">
          <button className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-mono text-sm hover:bg-white/20 transition-colors border border-white/10">
            {selectedPlanet.name} <ChevronDown size={16} />
          </button>
          <div className="absolute right-0 top-full mt-2 hidden w-56 rounded-lg border border-white/10 bg-[#0B0D17]/95 backdrop-blur-xl group-hover:block z-50">
            {PLANET_DB.map((p) => (
              <button key={p.id} onClick={() => handlePlanetChange(p)} className="w-full px-4 py-3 text-left font-mono text-xs hover:bg-cyan-500/20 hover:text-cyan-400 border-b border-white/5 last:border-0 transition-colors">
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* RESULT TABS (Centered) */}
      {simState === "result" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center gap-6 px-10 animate-in fade-in zoom-in duration-500">
          <div className="w-1/2 rounded-2xl border border-cyan-500/30 bg-black/60 p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(34,211,238,0.1)]">
            <h4 className="text-cyan-400 font-mono text-sm mb-2 uppercase tracking-tighter">Habitation Potential</h4>
            <p className="text-3xl font-bold font-sans tracking-tight">
              {selectedPlanet.terraformDifficulty >= 0.1 && selectedPlanet.terraformDifficulty <= 0.8 
                ? "OPTIMAL POTENTIAL" : "MARGINAL POTENTIAL"}
            </p>
            <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-cyan-400" style={{width: `${(1 - selectedPlanet.terraformDifficulty) * 100}%`}} />
            </div>
          </div>
          
          <div className="w-1/2 rounded-2xl border border-purple-500/30 bg-black/60 p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.1)]">
            <h4 className="text-purple-400 font-mono text-sm mb-2 uppercase tracking-tighter">Ideal Seeding Strategy</h4>
            <p className="text-xl font-mono leading-relaxed">{getSeedingStrategy(selectedPlanet.terraformDifficulty)}</p>
            <button 
              onClick={() => setSimState("idle")}
              className="mt-6 flex items-center gap-2 text-xs font-mono text-white/40 hover:text-white transition-colors"
            >
              <ArrowLeftCircleIcon size={12}/> BACK
            </button>
          </div>
        </div>
      )}

      {/* LOADING STATE */}
      {simState === "loading" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="flex gap-2">
            <div className="h-3 w-3 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.3s]"></div>
            <div className="h-3 w-3 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.10s]"></div>
            <div className="h-3 w-3 animate-bounce rounded-full bg-cyan-400"></div>
          </div>
        </div>
      )}

      {/* HUD MAIN CONTENT */}
      <div className="relative z-10 flex h-[calc(100vh-100px)] flex-col justify-end p-6">
        
        <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-6">
            {/* TELEMETRY - Slides LEFT */}
            <div className={`w-64 space-y-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-700 ease-in-out ${simState !== "idle" ? "-translate-x-[150%] opacity-0" : "translate-x-0 opacity-100"}`}>
                <h3 className="border-b border-white/10 pb-2 font-mono text-m text-cyan-400 flex items-center gap-2">
                  <Activity size={12}/> TELEMETRY
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-s text-white/50 flex items-center gap-2"><Wind size={12}/> GRAVITY</span>
                        <span className="font-mono text-lg">{selectedPlanet.gravity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-s text-white/50 flex items-center gap-2"><Thermometer size={12}/> TEMP</span>
                        <span className="font-mono text-lg">{selectedPlanet.temp}</span>
                    </div>
                </div>
            </div>

            {/* CHART PANEL - Slides RIGHT */}
            <div className={`relative w-full md:w-96 transition-all duration-700 ease-in-out ${simState !== "idle" ? "translate-x-[150%] opacity-0" : "translate-x-0 opacity-100"}`}>
                <button 
                  onClick={runSimulation}
                  className="absolute -top-12 right-0 flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-400/10 px-6 py-1.5 font-mono text-xs text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all group"
                >
                  <Play size={12} className="fill-current"/> RUN
                </button>
                <div className="h-48 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                    <h3 className="mb-4 border-b border-white/10 pb-2 font-mono text-m text-cyan-400">HABITABILITY PROJECTION</h3>
                    <HabitabilityChart year={currentYear} data={selectedPlanet.chartData} />
                </div>
            </div>
        </div>

        {/* FOOTER: TIMELINE - Slides DOWN */}
        <footer className={`space-y-4 rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-md transition-all duration-700 ease-in-out ${simState !== "idle" ? "translate-y-[150%] opacity-0" : "translate-y-0 opacity-100"}`}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xl text-cyan-400 tracking-widest">SIMULATION TIMELINE</span>
            <span className="font-mono text-2xl font-bold text-white">T+ {currentYear} YEARS</span>
          </div>

          <input
            type="range"
            min="0"
            max={TIMELINE_STEPS.length - 1}
            step="1"
            value={yearIndex}
            onChange={(e) => setYearIndex(Number(e.target.value))}
            className="h-2 w-full appearance-none rounded-full bg-white/20 accent-cyan-400 hover:accent-cyan-300 cursor-pointer"
          />

          <div className="flex justify-between font-mono text-[10px] text-white/40">
            {TIMELINE_STEPS.map((step) => (
              <span key={step}>{step}y</span>
            ))}
          </div>
        </footer>
      </div>
    </main>
  );
}