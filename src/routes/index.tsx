import React, { useState, useRef } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame,
  HTMLMotionProps,
  MotionValue,
} from "framer-motion";
import { 
  ArrowRight, 
  Target, 
  ShieldCheck, 
  Sparkles,
  Settings2,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MotionDiv = motion.div as React.FC<HTMLMotionProps<"div">>;
const MotionH1 = motion.h1 as React.FC<HTMLMotionProps<"h1">>;
const MotionP = motion.p as React.FC<HTMLMotionProps<"p">>;
const MotionPattern = motion.pattern as React.FC<HTMLMotionProps<"pattern">>;

export const Route = createFileRoute('/')({
  component: LandingPage,
})

/**
 * Grid Pattern Component
 */
const GridPattern = ({ 
  offsetX, 
  offsetY, 
  size 
}: { 
  offsetX: MotionValue<number>; 
  offsetY: MotionValue<number>; 
  size: number 
}) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <MotionPattern
          id="grid-pattern"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-zinc-200 dark:text-zinc-800" 
          />
        </MotionPattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
};

function LandingPage() {
  const [gridSize, setGridSize] = useState(45);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  useAnimationFrame(() => {
    const speed = 0.3;
    gridOffsetX.set((gridOffsetX.get() + speed) % gridSize);
    gridOffsetY.set((gridOffsetY.get() + speed) % gridSize);
  });

  const maskImage = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white text-zinc-950 selection:bg-zinc-950 selection:text-white font-sans tracking-tight"
    >
      {/* BACKGROUND LAYERS */}
      <div className="absolute inset-0 z-0 opacity-[0.5]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} size={gridSize} />
      </div>

      <MotionDiv 
        className="absolute inset-0 z-0 opacity-100 pointer-events-none"
        style={{ 
            maskImage, 
            WebkitMaskImage: maskImage,
            color: 'rgb(39, 39, 42)' 
        }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} size={gridSize} />
      </MotionDiv>

      {/* CONTROLS */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white/80 backdrop-blur-sm border border-zinc-200 p-3 rounded-xl shadow-sm space-y-2 min-w-[140px]">
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
            <Settings2 className="w-3 h-3" />
            Grid Scale
          </div>
          <input 
            type="range" min="30" max="80" value={gridSize} 
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="w-full h-1 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-zinc-950"
          />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto py-20">
        
        <MotionDiv 
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500"
        >
          <Sparkles className="w-2.5 h-2.5" />
          Powered by Gemini 2.5
        </MotionDiv>

        <MotionH1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tighter text-zinc-950 mb-6"
        >
          Smart Resume Insights <br />
          <span className="text-zinc-400 font-medium">For your career success.</span>
        </MotionH1>

        <MotionP
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm md:text-base text-zinc-500 max-w-lg mx-auto font-medium leading-relaxed mb-10"
        >
          benchmark your resume against market requirements. identity skill gaps, 
          optimize bullet points, and bypass legacy filters instantly.
        </MotionP>

        <MotionDiv
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-20"
        >
          <Link to="/analyzer">
            <Button size="lg" className="h-12 px-6 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold text-sm gap-2 transition-transform active:scale-95">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left">
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-white/30 backdrop-blur-sm border border-zinc-100 rounded-2xl hover:border-zinc-300 transition-all"
            >
                <div className="w-8 h-8 bg-zinc-950 text-white rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm mb-1">Instant Scoring</h3>
                <p className="text-[13px] text-zinc-500 leading-snug">Get real-time compatibility scores based on job requirements.</p>
            </MotionDiv>

            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-white/30 backdrop-blur-sm border border-zinc-100 rounded-2xl hover:border-zinc-300 transition-all"
            >
                <div className="w-8 h-8 bg-zinc-100 text-zinc-950 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm mb-1">Skill Gaps</h3>
                <p className="text-[13px] text-zinc-500 leading-snug">Extract missing keywords that are triggering recruitment filters.</p>
            </MotionDiv>

            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 bg-white/30 backdrop-blur-sm border border-zinc-100 rounded-2xl hover:border-zinc-300 transition-all"
            >
                <div className="w-8 h-8 bg-zinc-100 text-zinc-950 rounded-lg flex items-center justify-center mb-4">
                    <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm mb-1">Impact Tuning</h3>
                <p className="text-[13px] text-zinc-500 leading-snug">Rewrite weak bullet points into high-impact professional statements.</p>
            </MotionDiv>
        </div>
      </div>

      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-[0.4em] text-zinc-300">
        Resumelens AI // 
      </footer>
    </div>
  );
}