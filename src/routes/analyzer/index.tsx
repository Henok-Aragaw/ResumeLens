import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, Copy, CheckCircle2, 
  Zap, Search, Terminal, ArrowLeft, 
  Target, Sparkles, BrainCircuit
} from "lucide-react";
import { extractTextFromPdf } from '@/lib/pdf-parser';
import { analyzeResumeAction } from '@/lib/ai-actions';

export const Route = createFileRoute('/analyzer/')({
  component: ResumeApp,
})

interface AnalysisResult {
  score: number;
  missingKeywords: string[];
  weakBulletPoints: { original: string; suggestion: string }[];
  atsFriendliness: string;
  skillsFound: string[];
}

function RadialScore({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0 p-4 bg-zinc-950 rounded-2xl shadow-xl shadow-zinc-200">
      <svg className="w-20 h-20 transform -rotate-90">
        <circle cx="40" cy="40" r={radius} stroke="#27272a" strokeWidth="6" fill="transparent" />
        <circle
          cx="40" cy="40" r={radius}
          stroke="#ffffff" strokeWidth="6" fill="transparent"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-black tracking-tighter text-white">{score}%</span>
      </div>
    </div>
  );
}

function ResumeApp() {
  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!file || (!jobTitle && !jobDescription)) return;
    setLoading(true);
    try {
      const resumeText = await extractTextFromPdf(file);
      const result = await analyzeResumeAction({ 
        data: { text: resumeText, jobTitle: `${jobTitle}\n\nDescription: ${jobDescription}` } 
      });
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-zinc-950 selection:text-white">
      <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-zinc-950 p-1.5 rounded-lg group-hover:bg-zinc-800 transition-colors">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight">RESUMELENS<span className="text-zinc-400 font-light">.AI</span></span>
          </Link>
          <div className="flex gap-4">
             <Link to="/">
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest gap-2">
                    <ArrowLeft className="w-3 h-3" /> Back Home
                </Button>
             </Link>
             {analysis && (
                <Button 
                variant="outline" 
                onClick={() => { setAnalysis(null); setFile(null); }} 
                className="text-[10px] font-black uppercase tracking-widest border-2 border-zinc-200 rounded-xl px-4"
                >
                New Scan
                </Button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT PANEL: Input Console */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-200" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Scanner Input</span>
                <div className="h-px flex-1 bg-zinc-200" />
              </div>

              <div className="space-y-4">
                <div className="group relative">
                  <label className="absolute -top-2 left-3 bg-[#fafafa] px-1 text-[10px] font-bold text-zinc-500 uppercase z-10">Target Role</label>
                  <Input 
                    placeholder="e.g. Senior Software Engineer" 
                    value={jobTitle} 
                    onChange={e => setJobTitle(e.target.value)}
                    className="border-2 border-zinc-200 focus:ring-0 focus:border-zinc-950 h-14 bg-white rounded-xl font-medium"
                  />
                </div>

                <div className="group relative">
                  <label className="absolute -top-2 left-3 bg-[#fafafa] px-1 text-[10px] font-bold text-zinc-500 uppercase z-10">Job Description</label>
                  <Textarea 
                    placeholder="Paste the job requirements here..." 
                    className="min-h-[160px] border-2 border-zinc-200 bg-white rounded-xl p-4 resize-none"
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                  />
                </div>

                <div className="relative group">
                   <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                  <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${file ? `border-zinc-950 bg-zinc-50` : `border-zinc-200 bg-white`}`}>
                    <Search className={`w-6 h-6 mb-2 ${file ? `text-zinc-950` : `text-zinc-300`}`} />
                    <p className="text-sm font-bold text-zinc-950">{file ? file.name : "Upload Resume (PDF)"}</p>
                  </div>
                </div>

                <Button 
                  className="w-full h-14 bg-zinc-950 hover:bg-zinc-800 text-white font-bold rounded-xl shadow-[0_8px_0_0_rgba(24,24,27,0.1)] active:shadow-none active:translate-y-[2px] transition-all flex gap-3 text-xs tracking-widest"
                  onClick={handleAnalyze} 
                  disabled={loading || !file}
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <BrainCircuit className="w-5 h-5" />}
                  INITIALIZE SYSTEM SCAN
                </Button>
              </div>
            </section>
          </div>

          {/* RIGHT PANEL: The Intelligence */}
          <div className="lg:col-span-7">
            {!analysis ? (
              <div className="h-full min-h-[600px] border-2 border-zinc-200 rounded-3xl bg-zinc-100/30 flex flex-col items-center justify-center p-12 text-center border-dashed">
                <div className="w-16 h-16 bg-white rounded-2xl border border-zinc-200 flex items-center justify-center mb-6 shadow-sm">
                  <Zap className="w-8 h-8 text-zinc-200" />
                </div>
                <h3 className="text-lg font-bold text-zinc-400 uppercase tracking-tighter">Awaiting Input</h3>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 pb-20">
                {/* Score Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
                  <div className="bg-white border-2 border-zinc-200 p-6 rounded-3xl flex items-center gap-6">
                    <RadialScore score={analysis.score} />
                    <div className="min-w-0">
                      <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Compatibility</h4>
                      <p className="text-2xl font-black text-zinc-950 italic tracking-tighter truncate leading-none">{analysis.atsFriendliness}</p>
                    </div>
                  </div>
                  <div className="bg-zinc-950 p-6 rounded-3xl flex flex-col justify-center">
                     <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Priority Gaps</h4>
                     <p className="text-white text-lg font-bold leading-tight">Detected <span className="underline decoration-zinc-600 underline-offset-4">{analysis.missingKeywords.length} critical skills</span> missing.</p>
                  </div>
                </div>

                {/* Keyword Cloud */}
                <div className="bg-white border-2 border-zinc-200 p-8 rounded-3xl">
                  <div className="flex items-center gap-2 mb-6">
                    <Target className="w-4 h-4 text-zinc-950" />
                    <h4 className="text-xs font-black uppercase tracking-[0.2em]">Missing Keywords</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((kw, i) => (
                      <Badge key={i} className="bg-zinc-100 text-zinc-900 border border-zinc-200 px-4 py-2 rounded-xl font-mono text-[11px] font-bold hover:bg-zinc-950 hover:text-white transition-all cursor-default">
                        +{kw.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Optimization Log */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] whitespace-nowrap">Optimization Log</span>
                    <div className="h-px flex-1 bg-zinc-200" />
                  </div>
                  <div className="grid gap-6">
                    {analysis.weakBulletPoints.map((bp, i) => (
                      <div key={i} className="group bg-white border-2 border-zinc-200 rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:shadow-zinc-200/50">
                        <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">Original Draft</span>
                        </div>
                        <div className="px-5 py-4">
                           <p className="text-xs font-medium text-zinc-400 italic line-through">{bp.original}</p>
                        </div>
                        <div className="p-5 bg-white flex items-start gap-4 border-t border-zinc-50">
                          <div className="mt-1 bg-zinc-950 p-1.5 rounded-lg shrink-0">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1">
                             <span className="text-[9px] font-black text-zinc-900 uppercase mb-1 block">AI Enhanced Suggestion</span>
                             <p className="text-sm font-bold text-zinc-900 leading-relaxed">{bp.suggestion}</p>
                          </div>
                          <Button variant="outline" size="icon" className="shrink-0 h-10 w-10 rounded-xl hover:bg-zinc-950 hover:text-white transition-all" onClick={() => copyToClipboard(bp.suggestion, i)}>
                            {copiedIndex === i ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}