import React, { useState } from "react";
import { Search, Sparkles, Copy, Check, CheckCircle2, AlertTriangle, HelpCircle, RefreshCw } from "lucide-react";

export default function YoutubeSeo() {
  const [keyword, setKeyword] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [copiedTagIndex, setCopiedTagIndex] = useState<number | null>(null);
  const [copiedAllTags, setCopiedAllTags] = useState(false);
  const [copiedTitleIndex, setCopiedTitleIndex] = useState<number | null>(null);

  // Pre-seed search niches for quick click tag generation
  const tagTemplates: Record<string, string[]> = {
    gaming: ["gaming", "gameplay", "walkthrough", "lets play", "no commentary", "xbox", "ps5", "nintendo switch", "gaming clips", "best moments", "speedrun", "pro guide"],
    coding: ["coding", "programming", "developer", "software engineer", "tutorial", "learn to code", "web development", "javascript", "react tutorial", "python for beginners", "tech", "computer science"],
    fitness: ["fitness", "workout", "gym", "bodyweight workout", "home workout", "exercise", "fat loss", "muscle gain", "nutrition", "diet plan", "hiit workout", "daily routine"],
    finance: ["finance", "investing", "money", "personal finance", "stock market", "crypto", "budgeting", "passive income", "how to save money", "financial freedom", "side hustle", "wealth building"],
    cooking: ["cooking", "recipe", "food", "how to cook", "easy recipes", "healthy cooking", "chef", "meal prep", "quick meals", "baking", "delicious dishes", "home chef"]
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    const base = keyword.trim().toLowerCase();
    // Build tags dynamically
    const extraTags = [
      `${base} tutorial`,
      `${base} guide`,
      `${base} for beginners`,
      `how to ${base}`,
      `best ${base} tips`,
      `${base} explained`,
      `${base} course`,
      `learn ${base}`,
      `${base} secrets`,
      `${base} review`,
      `${base} tricks`,
      `easy ${base} tutorial`,
      `top ${base} ideas`,
      `why ${base} is awesome`,
      `${base} setup`
    ];

    setGeneratedTags(extraTags);

    // Build dynamic titles
    const titles = [
      `The Ultimate ${keyword} Guide (From Beginner to Pro!)`,
      `How to Master ${keyword} in 10 Minutes (Step-by-Step)`,
      `${keyword} Secrets They Don't Want You To Know!`,
      `Avoid These 5 Common ${keyword} Mistakes!`,
      `Why Everyone is Talking About ${keyword} in 2026`,
      `I Tried ${keyword} For 30 Days (My Honest Results)`
    ];
    setSuggestedTitles(titles);
  };

  const loadTemplate = (niche: string) => {
    const templateTags = tagTemplates[niche] || [];
    setKeyword(niche.toUpperCase());
    setGeneratedTags(templateTags.map(t => `${t}`));
    setSuggestedTitles([
      `Ultimate ${niche.charAt(0).toUpperCase() + niche.slice(1)} Guide for 2026`,
      `How I Perfected My ${niche.charAt(0).toUpperCase() + niche.slice(1)} Routine`,
      `5 ${niche.charAt(0).toUpperCase() + niche.slice(1)} Hacks You Need to Try Today`,
      `The Absolute Best ${niche.charAt(0).toUpperCase() + niche.slice(1)} Tutorial`,
      `Is This The Future of ${niche.charAt(0).toUpperCase() + niche.slice(1)}?`,
      `Stop Doing ${niche.charAt(0).toUpperCase() + niche.slice(1)} Like This!`
    ]);
  };

  const handleCopyTag = (tag: string, index: number) => {
    navigator.clipboard.writeText(tag).then(() => {
      setCopiedTagIndex(index);
      setTimeout(() => setCopiedTagIndex(null), 1500);
    });
  };

  const handleCopyAllTags = () => {
    if (generatedTags.length === 0) return;
    navigator.clipboard.writeText(generatedTags.join(", ")).then(() => {
      setCopiedAllTags(true);
      setTimeout(() => setCopiedAllTags(false), 2000);
    });
  };

  const handleCopyTitle = (title: string, index: number) => {
    navigator.clipboard.writeText(title).then(() => {
      setCopiedTitleIndex(index);
      setTimeout(() => setCopiedTitleIndex(null), 1500);
    });
  };

  // SEO Analyzer logic
  const analyzeSEO = () => {
    let score = 0;
    const feedback: { label: string; passed: boolean; tip: string }[] = [];

    // 1. Title Length
    const titleLen = videoTitle.trim().length;
    if (titleLen >= 40 && titleLen <= 70) {
      score += 25;
      feedback.push({ label: "Title Length (40-70 chars)", passed: true, tip: `Perfect! Your title is ${titleLen} characters.` });
    } else if (titleLen > 0) {
      score += 10;
      feedback.push({ label: "Title Length", passed: false, tip: `Title length is ${titleLen}. Ideal is 40-70 characters for CTR and search viewports.` });
    } else {
      feedback.push({ label: "Title Length", passed: false, tip: "Title is empty. Write a video title to begin the analysis." });
    }

    // 2. Title Power Words
    const powerWords = ["secret", "epic", "easy", "master", "ultimate", "guide", "how to", "mistake", "step-by-step", "learn", "best", "trick", "2026", "hacks", "tried"];
    const titleLower = videoTitle.toLowerCase();
    const hasPower = powerWords.some(w => titleLower.includes(w));
    if (hasPower && titleLen > 0) {
      score += 25;
      feedback.push({ label: "High-CTR Power Words", passed: true, tip: "Great! Your title includes click-driving power words." });
    } else if (titleLen > 0) {
      feedback.push({ label: "High-CTR Power Words", passed: false, tip: "Add emotional hook words (e.g., 'Master', 'Secret', 'Easy', 'Ultimate') to spark interest." });
    }

    // 3. Description Length
    const descLen = videoDesc.trim().length;
    const wordCount = videoDesc.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount >= 100) {
      score += 25;
      feedback.push({ label: "Description Length (100+ words)", passed: true, tip: `Excellent! Your description has ${wordCount} words, which is ideal for YouTube algorithms.` });
    } else if (descLen > 0) {
      score += 12;
      feedback.push({ label: "Description Length", passed: false, tip: `Only ${wordCount} words. Aim for at least 100 words to provide rich context to algorithms.` });
    } else {
      feedback.push({ label: "Description Length", passed: false, tip: "Description is empty. Provide a comprehensive summary of your video." });
    }

    // 4. Keyword Integration
    if (keyword && titleLen > 0 && descLen > 0) {
      const kw = keyword.toLowerCase();
      const inTitle = titleLower.includes(kw);
      const inDesc = videoDesc.toLowerCase().includes(kw);
      if (inTitle && inDesc) {
        score += 25;
        feedback.push({ label: "Target Keyword Alignment", passed: true, tip: `Fantastic! Your keyword "${keyword}" is matched in both Title and Description.` });
      } else if (inTitle || inDesc) {
        score += 12;
        feedback.push({ label: "Target Keyword Alignment", passed: false, tip: `Keyword "${keyword}" should be placed in BOTH title and description.` });
      } else {
        feedback.push({ label: "Target Keyword Alignment", passed: false, tip: `Add your primary keyword "${keyword}" to both your title and description to improve ranking.` });
      }
    } else {
      feedback.push({ label: "Keyword Alignment", passed: false, tip: "Please enter your target keyword and write a title/description to analyze integration." });
    }

    return { score, feedback };
  };

  const { score: seoScore, feedback: seoFeedback } = analyzeSEO();

  return (
    <div className="space-y-8 animate-fade-in" id="youtube-seo-tool">
      
      {/* Title Header */}
      <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">YouTube SEO & Tag Generator</h2>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Optimize your titles, audit video descriptions, generate high-ranking tags, and boost your search ranking entirely client-side.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Tag Generator & Hook Suggestor */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Quick Template Selector */}
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Quick Category Niches</span>
            <div className="flex flex-wrap gap-2">
              {Object.keys(tagTemplates).map((key) => (
                <button
                  key={key}
                  onClick={() => loadTemplate(key)}
                  className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20 dark:hover:text-blue-400 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-semibold border border-gray-100 dark:border-gray-700/50 cursor-pointer capitalize transition"
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Generator Input Form */}
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <form onSubmit={handleGenerate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Target Keyword / Topic</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-600 dark:text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none text-xs font-semibold"
                      placeholder="e.g. Photoshop Tutorial, Personal Budgeting, Cardio Routine"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 active:scale-95 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate
                  </button>
                </div>
              </div>
            </form>

            {generatedTags.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Optimized Keywords & Tags</span>
                  <button
                    onClick={handleCopyAllTags}
                    className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedAllTags ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    {copiedAllTags ? "All Tags Copied!" : "Copy CSV String"}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {generatedTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => handleCopyTag(tag, index)}
                      className="px-2.5 py-1.5 bg-gray-50 dark:bg-gray-850 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-mono font-medium border border-gray-100 dark:border-gray-800 flex items-center gap-1 cursor-pointer transition"
                    >
                      <span>{tag}</span>
                      {copiedTagIndex === index ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-2.5 h-2.5 text-gray-600 dark:text-gray-400 group-hover:text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* suggested high-CTR titles */}
          {suggestedTitles.length > 0 && (
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3.5">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">High-CTR Clickbait Titles</span>
              <div className="space-y-2">
                {suggestedTitles.map((title, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-100 dark:border-gray-800 gap-4"
                  >
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{title}</span>
                    <button
                      onClick={() => handleCopyTitle(title, index)}
                      className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg shrink-0 cursor-pointer transition"
                      title="Copy Suggested Title"
                    >
                      {copiedTitleIndex === index ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: SEO Real-time Auditor */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">SEO Scoring Auditor</span>
              <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-mono font-bold text-gray-600 dark:text-gray-400">Live</span>
              </div>
            </div>

            {/* Circular Progress Gauge */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-100 dark:text-gray-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`transition-all duration-300 ${
                      seoScore >= 75 ? "text-emerald-500" : seoScore >= 45 ? "text-amber-500" : "text-red-500"
                    }`}
                    strokeDasharray={`${seoScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{seoScore}</span>
                  <span className="text-[10px] text-gray-600 dark:text-gray-400 block font-bold">/ 100</span>
                </div>
              </div>
              <span className={`text-xs font-extrabold mt-3 px-3 py-1 rounded-full ${
                seoScore >= 75 ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300" : 
                seoScore >= 45 ? "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300" : 
                "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300"
              }`}>
                {seoScore >= 75 ? "Excellent Rating" : seoScore >= 45 ? "Needs Work" : "Critical SEO Optimization Required"}
              </span>
            </div>

            {/* Audit Inputs */}
            <div className="space-y-3.5 pt-2 border-t border-gray-50 dark:border-gray-800">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Audit Proposed Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none text-xs"
                  placeholder="Paste your title here to audit..."
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Audit Proposed Description</label>
                <textarea
                  rows={4}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none text-xs font-sans resize-none"
                  placeholder="Paste your video summary / details here..."
                  value={videoDesc}
                  onChange={(e) => setVideoDesc(e.target.value)}
                />
              </div>
            </div>

            {/* Checklist Feedback */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Optimizer Checklist</span>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {seoFeedback.map((fb, idx) => (
                  <div key={idx} className="flex gap-2.5 p-2 bg-gray-50 dark:bg-gray-850 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="shrink-0 pt-0.5">
                      {fb.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-gray-800 dark:text-gray-200 block">{fb.label}</span>
                      <p className="text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">{fb.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
