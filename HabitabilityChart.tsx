"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

// 1. Define the props to accept 'data'
interface ChartProps {
  year: number;
  data: { x: number; y: number }[]; // <--- NEW PROP
}

export default function HabitabilityChart({ year, data }: ChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 100;
    const margin = { top: 10, right: 10, bottom: 20, left: 30 };

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, 10000])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    // Line Generator
    const line = d3.line<{ x: number; y: number }>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    // Draw Line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#22d3ee") // Cyan-400
      .attr("stroke-width", 2)
      .attr("d", line);

    // Draw Current Year Marker (The interactive part)
    const currentY = data.find(d => d.x >= year)?.y || 0;
    
    svg.append("circle")
      .attr("cx", xScale(year))
      .attr("cy", yScale(currentY)) // Approximate for demo
      .attr("r", 4)
      .attr("fill", "white")
      .attr("stroke", "#22d3ee")
      .attr("stroke-width", 2);

    // Axes (Simplified)
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(3).tickFormat(d => `${d}y`))
      .attr("color", "rgba(255,255,255,0.3)");

  }, [year, data]);

  return <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 300 100" />;
}