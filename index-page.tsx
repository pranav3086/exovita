"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Globe, Sparkles, Star, ArrowRight } from "lucide-react";

interface ExoplanetData {
  "Planet Name": string;
  "Planet Host": string;
  "Discovery Method": string;
  "Discovery Year": string;
  Mass: string;
  Distance: string;
  "Equilibrium Temperature": string;
  "Spectral Type": string;
}

export default function CoverPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ExoplanetData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allPlanets, setAllPlanets] = useState<ExoplanetData[]>([]);
  const [featuredPlanets, setFeaturedPlanets] = useState<ExoplanetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load planet data from embedded_data.js
  useEffect(() => {
    const loadData = async () => {
      try {
        // Import the embedded data
        const response = await fetch('/embedded_data.js');
        const text = await response.text();
        
        // Extract the EMBEDDED_DATA array
        const match = text.match(/const EMBEDDED_DATA = (\[[\s\S]*\]);?/);
        if (match && match[1]) {
          const data = eval(match[1]) as ExoplanetData[];
          setAllPlanets(data);
          
          // Set featured planets
          const featured = data.filter(p => 
            ["Kepler-452 b", "Proxima Centauri b", "TRAPPIST-1 e", "51 Pegasi b", "Kepler-186 f", "TOI 700 d"].includes(p["Planet Name"])
          );
          setFeaturedPlanets(featured);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading planet data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    const timeout = setTimeout(() => {
      const filtered = allPlanets
        .filter(planet => 
          planet["Planet Name"].toLowerCase().includes(searchQuery.toLowerCase()) ||
          planet["Planet Host"].toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 8);
      
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setActiveSuggestionIndex(-1);
    }, 150);

    return () => clearTimeout(timeout);
  }, [searchQuery, allPlanets]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
  e.preventDefault();
  if (activeSuggestionIndex >= 0) {
    handlePlanetSelect(suggestions[activeSuggestionIndex]);
  } else if (searchQuery.length > 0) {
    // Redirects using the text currently typed in the search bar
    window.location.href = `/exoplanet_ai_system.html?search=${encodeURIComponent(searchQuery)}`;
  }
  break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  };

  const handlePlanetSelect = (planet: ExoplanetData) => {
  // Redirects to the static HTML archive instead of the 3D dashboard
  window.location.href = `/exoplanet_ai_system.html?search=${encodeURIComponent(planet["Planet Name"])}`;
};

  const getMassInEarthMasses = (mass: string) => {
    const massValue = parseFloat(mass);
    if (isNaN(massValue)) return "Unknown";
    return (massValue / 317.8).toFixed(2);
  };

  const getDistanceInLightYears = (distance: string) => {
    const distValue = parseFloat(distance);
    if (isNaN(distValue)) return "Unknown";
    return (distValue * 3.26).toFixed(2);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0B0D17]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D17] via-[#1a1f3a] to-[#0B0D17]" />
        
        {/* Animated stars */}
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 3 + "s",
              animationDuration: Math.random() * 3 + 2 + "s",
              opacity: Math.random() * 0.5 + 0.3
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: "1s" }} 
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        {/* Logo/Title Section */}
        <div className="mb-16 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <Globe className="h-24 w-24 text-cyan-400 animate-pulse" strokeWidth={1} />
              <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-cyan-300 animate-bounce" />
            </div>
          </div>
          <h1 className="mb-4 font-sans text-7xl font-black tracking-[0.2em] text-white">
            EXOVITA
          </h1>
          <p className="text-lg tracking-[0.3em] text-cyan-400 uppercase font-mono">
            Advanced Planetary Discovery System
          </p>
          <p className="mt-4 text-sm text-white/40 tracking-wider font-mono">
            {isLoading ? "Loading Database..." : `Explore ${allPlanets.length.toLocaleString()} Confirmed Exoplanets`}
          </p>
        </div>

        {/* Search Section */}
        <div className="w-full max-w-3xl" ref={searchRef}>
          <div className="relative">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-[2rem] opacity-20 group-hover:opacity-40 blur transition-opacity duration-500" />
              <div className="relative flex items-center gap-4 rounded-[2rem] border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl">
                <Search className="h-6 w-6 text-cyan-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search exoplanet by name... (e.g., Kepler-452 b, Proxima)"
                  className="flex-1 bg-transparent font-mono text-lg text-white placeholder-white/30 outline-none"
                  autoComplete="off"
                  disabled={isLoading}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}
                    className="text-white/40 hover:text-white/60 transition-colors text-2xl flex-shrink-0"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Autocomplete Suggestions (Chrome-style) */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-4 w-full rounded-[2rem] border border-white/10 bg-[#0B0D17]/98 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden z-50">
                {suggestions.map((planet, index) => (
                  <button
                    key={index}
                    onClick={() => handlePlanetSelect(planet)}
                    onMouseEnter={() => setActiveSuggestionIndex(index)}
                    className={`group w-full border-b border-white/5 px-8 py-5 text-left transition-all last:border-0 ${
                      index === activeSuggestionIndex ? 'bg-cyan-500/20' : 'hover:bg-cyan-500/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="mb-2 flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-base font-semibold text-cyan-400 group-hover:text-cyan-300 truncate">
                            {planet["Planet Name"]}
                          </span>
                          {planet["Discovery Year"] && (
                            <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-400 flex-shrink-0">
                              {planet["Discovery Year"]}
                            </span>
                          )}
                        </div>
                        <div className="mb-2 font-mono text-sm text-white/50 truncate">
                          Host: {planet["Planet Host"]} • Method: {planet["Discovery Method"]}
                        </div>
                        <div className="flex gap-4 font-mono text-xs text-white/30 flex-wrap">
                          <span>
                            Distance: {getDistanceInLightYears(planet["Distance"])} ly
                          </span>
                          <span>•</span>
                          <span>
                            Mass: {getMassInEarthMasses(planet["Mass"])} M⊕
                          </span>
                          {planet["Equilibrium Temperature"] && (
                            <>
                              <span>•</span>
                              <span>
                                Temp: {planet["Equilibrium Temperature"]} K
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Tips */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="text-xs text-white/20 font-mono">Try:</span>
            {["Kepler-452", "Proxima", "TRAPPIST", "51 Peg"].map((example) => (
              <button
                key={example}
                onClick={() => setSearchQuery(example)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-mono text-white/40 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-400"
                disabled={isLoading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Planets */}
        {!isLoading && featuredPlanets.length > 0 && (
          <div className="mt-16 w-full max-w-5xl">
            <div className="mb-6 flex items-center justify-center gap-3">
              <Star className="h-5 w-5 text-amber-400" />
              <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
                Featured Exoplanets
              </h2>
              <Star className="h-5 w-5 text-amber-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredPlanets.map((planet, index) => (
                <button
                  key={index}
                  onClick={() => handlePlanetSelect(planet)}
                  className="group rounded-2xl border border-white/10 bg-slate-900/30 backdrop-blur-xl p-6 text-left transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:scale-105"
                >
                  <div className="mb-3 font-mono text-sm font-semibold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-2">
                    {planet["Planet Name"]}
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-1 font-mono text-xs text-white/40">
                    <div>Host: {planet["Planet Host"]}</div>
                    <div>Distance: {getDistanceInLightYears(planet["Distance"])} ly</div>
                    <div>Mass: {getMassInEarthMasses(planet["Mass"])} M⊕</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Link to Dashboard */}
        <div className="mt-16">
          <a
            href="/exoplanet_ai_system.html"
            className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-xl transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10"
          >
            <Globe className="h-5 w-5 text-cyan-400" />
            <span className="font-mono text-sm uppercase tracking-wider text-white/70 group-hover:text-cyan-400">
              Explore 3D Visualization
            </span>
            <ArrowRight className="h-5 w-5 text-white/20 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </a>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <p className="font-mono text-xs text-white/20 tracking-widest">
            DATA SOURCE: NASA EXOPLANET ARCHIVE • LAST UPDATED 2021.04
          </p>
        </div>
      </div>
    </main>
  );
}