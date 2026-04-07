import React, { useState } from 'react';
import { Bot, Swords, Gavel, Sparkles, Trophy, AlertCircle, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import axios from 'axios';
import 'highlight.js/styles/atom-one-dark-reasonable.css'; // sleek dark theme

// --- STUB DATA FOR SIMULATION ---
const MOCK_RESPONSE = {
  problem: "",
  solution_1: "To solve this problem, we should use a recursive approach. First, determine the base case and then divide the problem into subproblems. Here is the implementation:\n\n```python\ndef solve(n):\n    if n <= 1: return n\n    return solve(n-1) + solve(n-2)\n```\nThis approach ensures we cover all cases systematically.",
  solution_2: "An optimal way to handle this is by using dynamic programming to avoid redundant calculations. We can maintain an array to store previously computed values.\n\n```python\ndef solve(n):\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]\n```\nThis gives us O(n) time complexity.",
  judge: {
    solution_1_score: 6,
    solution_2_score: 9,
    solution_1_reasoning: "Solution 1 uses a naive recursive approach which will result in exponential time complexity O(2^n). While correct, it is highly inefficient for large inputs.",
    solution_2_reasoning: "Solution 2 correctly identifies the overlapping subproblems and uses dynamic programming to achieve O(n) time complexity. This is the optimal approach for this problem."
  }
};

// --- COMPONENTS ---

// 1. Solution Card Component (For Model 1 & 2)
const SolutionCard = ({ title, content, score, isWinner, isLoading }) => {
  return (
    <div className={`glass-card p-6 flex flex-col relative transition-all duration-300 ${isWinner ? 'ring-2 ring-warning/50 shadow-warning/10' : ''}`}>
      {isWinner && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-warning text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <Trophy size={14} /> Winner
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <Bot size={20} />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        </div>
        {score !== undefined && (
          <div className="text-2xl font-bold font-mono">
            {score}<span className="text-gray-500 text-lg">/10</span>
          </div>
        )}
      </div>

      <div className="flex-grow">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-white/5 rounded w-3/4"></div>
            <div className="h-4 bg-white/5 rounded w-full"></div>
            <div className="h-4 bg-white/5 rounded w-5/6"></div>
          </div>
        ) : content ? (
          <div className="text-gray-300 leading-relaxed text-sm bg-black/40 p-4 rounded-lg border border-white/5 overflow-x-auto [&>p]:mb-4 [&>p:last-child]:mb-0 [&>pre]:bg-[#1a1b26] [&>pre]:border [&>pre]:border-white/10 [&>pre]:p-4 [&>pre]:my-4 [&>pre]:rounded-lg [&_code]:font-mono">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 min-h-[150px]">
            <Sparkles size={32} className="mb-2 opacity-20" />
            <p className="text-sm">Awaiting generation...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Judge Panel Component
const JudgePanel = ({ judgeData, isLoading }) => {
  return (
    <div className="glass-card p-6 mt-8 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-success/10 blur-[100px] rounded-full point-events-none" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 bg-success/10 text-success rounded-lg">
          <Gavel size={24} />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Judge's Verdict</h2>
      </div>

      {isLoading ? (
         <div className="animate-pulse space-y-4">
           <div className="h-4 bg-white/5 rounded w-2/3"></div>
           <div className="h-4 bg-white/5 rounded w-1/2"></div>
         </div>
      ) : judgeData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-2 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <ChevronRight size={16} /> Model 1 Reasoning
              </h3>
              <div className="text-xs font-bold bg-white/10 px-2 py-1 rounded-md text-foreground">Score: {judgeData.solution_1_score}/10</div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed p-4 bg-black/30 rounded-lg border border-border/50">
              {judgeData.solution_1_reasoning}
            </p>
          </div>
          <div className="space-y-2 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <ChevronRight size={16} /> Model 2 Reasoning
              </h3>
              <div className="text-xs font-bold bg-white/10 px-2 py-1 rounded-md text-foreground">Score: {judgeData.solution_2_score}/10</div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed p-4 bg-black/30 rounded-lg border border-border/50">
              {judgeData.solution_2_reasoning}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8 relative z-10 text-sm flex flex-col items-center">
          <AlertCircle size={24} className="mb-2 opacity-50" />
          Judge is waiting for the models to respond...
        </div>
      )}
    </div>
  );
};

// --- MAIN APPLICATION ---
export default function App() {
  const [problemText, setProblemText] = useState("");
  const [isBattling, setIsBattling] = useState(false);
  const [battleData, setBattleData] = useState(null);

  const startBattle = async () => {
    if (!problemText.trim()) return;
    
    const currentProblemText = problemText;
    setProblemText("");
    setIsBattling(true);
    setBattleData(null);
//axios call
    const response = await axios.post("http://localhost:8080/battle", {
      input: currentProblemText  
    })

    const data = response.data
    console.log(data)
    
    // Simulate API call and typing delay
    setTimeout(() => {
      setBattleData({
        ...data.result,
        problem: currentProblemText
      });
      setIsBattling(false);
    }, 2500);
  };

  const win1 = battleData && battleData.judge.solution_1_score > battleData.judge.solution_2_score;
  const win2 = battleData && battleData.judge.solution_2_score > battleData.judge.solution_1_score;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 selection:bg-primary/30">
      
      {/* HEADER */}
      <header className="max-w-7xl mx-auto mb-10 flex flex-col items-center text-center space-y-4 pt-10">
        <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-white/[0.03] rounded-2xl border border-white/[0.05] shadow-2xl mb-2">
          <Swords className="text-primary w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
          AI Battle Arena
        </h1>
        <p className="text-gray-400 max-w-2xl text-sm sm:text-base leading-relaxed">
          Enter a prompt and watch two distinct AI models formulate an answer side-by-side. 
          The impartial AI Judge will evaluate, score, and provide detailed reasoning for the ultimate winner.
        </p>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        
        {/* ARENA: SIDE BY SIDE SOLUTIONS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          {/* subtle VS badge in the middle */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-card border border-border rounded-full items-center justify-center font-black italic text-gray-400 shadow-xl">
            VS
          </div>

          <SolutionCard 
            title="Model Alpha" 
            content={battleData?.solution_1} 
            score={battleData?.judge?.solution_1_score}
            isLoading={isBattling}
            isWinner={win1}
          />
          <SolutionCard 
            title="Model Beta" 
            content={battleData?.solution_2} 
            score={battleData?.judge?.solution_2_score}
            isLoading={isBattling}
            isWinner={win2}
          />
        </section>

        {/* JUDGE SECTION */}
        <section className="mb-12">
          <JudgePanel 
            judgeData={battleData?.judge} 
            isLoading={isBattling}
          />
        </section>

        {/* INPUT SECTION */}
        <section className="glass-card p-2 rounded-2xl relative overflow-hidden group focus-within:ring-1 focus-within:ring-primary/50 transition-all sticky bottom-4 shadow-2xl z-50">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          <div className="flex flex-col md:flex-row gap-2 relative z-10">
            <textarea 
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              placeholder="Describe the problem, task, or question here..."
              className="w-full bg-transparent p-4 outline-none resize-none text-gray-200 placeholder-gray-600 min-h-[100px] md:min-h-[60px]"
            />
            <button 
              onClick={startBattle}
              disabled={isBattling || !problemText.trim()}
              className="md:w-auto w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] shrink-0"
            >
              {isBattling ? "Battling..." : "Battle"} <Swords size={18} />
            </button>
          </div>
        </section>
        
      </main>
    </div>
  );
}
