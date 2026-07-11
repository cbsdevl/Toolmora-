import React, { useState } from "react";
import { DollarSign, Users, Flame, RefreshCw, BarChart3, TrendingUp, HelpCircle } from "lucide-react";

export default function YoutubeAnalytics() {
  const [activeSubTab, setActiveSubTab] = useState<"revenue" | "engagement" | "growth">("revenue");

  // Revenue Calculator States
  const [views, setViews] = useState(100000);
  const [cpm, setCpm] = useState(4.50);

  // Engagement States
  const [vViews, setVViews] = useState(50000);
  const [vLikes, setVLikes] = useState(2400);
  const [vComments, setVComments] = useState(150);
  const [vShares, setVShares] = useState(80);

  // Growth States
  const [currentSubs, setCurrentSubs] = useState(5000);
  const [monthlyGrowthViews, setMonthlyGrowthViews] = useState(30000);
  const [conversionRate, setConversionRate] = useState(0.8); // % of viewers subscribing

  // Niche Presets for CPM
  const cpmPresets = [
    { name: "Finance / Tech", value: 12.50, desc: "Highest advertising bid density" },
    { name: "Lifestyle / Business", value: 6.80, desc: "Strong brand interest and products" },
    { name: "Gaming / Clips", value: 3.20, desc: "High views, moderate ad bidding" },
    { name: "Music / Shorts", value: 1.50, desc: "Lowest ad bidding rates" }
  ];

  // Calculations: Revenue
  const calculateRevenue = () => {
    const gross = (views * cpm) / 1000;
    const creatorCut = gross * 0.55; // YouTube pays creators 55%
    const rpm = creatorCut / (views / 1000);

    return {
      gross,
      creatorShare: creatorCut,
      rpm,
      daily: creatorCut / 30.4,
      yearly: creatorCut * 12
    };
  };

  const revenueStats = calculateRevenue();

  // Calculations: Engagement
  const calculateEngagement = () => {
    if (vViews <= 0) return { rate: 0, tier: "Invalid", color: "text-gray-600 dark:text-gray-400" };
    const interactions = vLikes + vComments + vShares;
    const rate = (interactions / vViews) * 100;

    let tier = "Low / Standard";
    let color = "text-red-500 bg-red-50 dark:bg-red-950/20";
    if (rate >= 1 && rate < 3.5) {
      tier = "Average / Good";
      color = "text-amber-500 bg-amber-50 dark:bg-amber-950/20";
    } else if (rate >= 3.5 && rate < 7) {
      tier = "High Engagement";
      color = "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20";
    } else if (rate >= 7) {
      tier = "Viral Tier Engagement";
      color = "text-blue-500 bg-blue-50 dark:bg-blue-950/20";
    }

    return { rate, tier, color };
  };

  const engagementStats = calculateEngagement();

  // Calculations: Growth Projection
  const calculateGrowthProjections = () => {
    const subsAddedPerMonth = monthlyGrowthViews * (conversionRate / 100);
    
    const intervals = [
      { label: "Current", subs: currentSubs, month: 0 },
      { label: "1 Month", subs: currentSubs + subsAddedPerMonth * 1, month: 1 },
      { label: "3 Months", subs: currentSubs + subsAddedPerMonth * 3, month: 3 },
      { label: "6 Months", subs: currentSubs + subsAddedPerMonth * 6, month: 6 },
      { label: "12 Months", subs: currentSubs + subsAddedPerMonth * 12, month: 12 }
    ];

    return intervals;
  };

  const growthProjections = calculateGrowthProjections();

  // Draw smooth SVG coordinates for growth chart
  const renderGrowthSvg = () => {
    const data = growthProjections;
    const padding = 35;
    const width = 500;
    const height = 200;

    const maxSubs = Math.max(...data.map(d => d.subs));
    const minSubs = Math.min(...data.map(d => d.subs));
    const subRange = maxSubs - minSubs || 1;

    const points = data.map((d, idx) => {
      const x = padding + (idx * (width - 2 * padding)) / (data.length - 1);
      const ratio = (d.subs - minSubs) / subRange;
      const y = height - padding - ratio * (height - 2 * padding);
      return { x, y, label: d.label, val: Math.round(d.subs) };
    });

    const pathD = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    return (
      <div className="w-full h-56 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 relative overflow-hidden flex flex-col justify-between">
        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Subscriber Growth Trend Chart</span>
        
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
          {/* Horizontal Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#888" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.2" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#888" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.2" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#888" strokeWidth="0.5" opacity="0.4" />

          {/* Area under line */}
          {points.length > 0 && (
            <path
              d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
              fill="url(#growthGrad)"
              opacity="0.15"
            />
          )}

          {/* Line path */}
          <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data nodes */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r="4.5" fill="#2563eb" stroke="#fff" strokeWidth="1.5" className="cursor-pointer hover:scale-125 transition-transform" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fontWeight="bold" fill="currentColor" className="text-gray-600 dark:text-gray-300">
                {p.val.toLocaleString()}
              </text>
              <text x={p.x} y={height - 12} textAnchor="middle" fontSize="8" fill="#94a3b8" fontWeight="bold">
                {p.label}
              </text>
            </g>
          ))}

          {/* Define gradients */}
          <defs>
            <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in" id="youtube-analytics-tool">
      
      {/* Page Header */}
      <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">YouTube Analytics & Revenue Simulator</h2>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Estimate channel earnings, audit video CTR / engagement tiers, and calculate multi-month subscriber growth forecasts instantly.</p>
      </div>

      {/* Selector Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-850 p-1.5 rounded-2xl max-w-md border border-gray-100 dark:border-gray-800">
        <button
          onClick={() => setActiveSubTab("revenue")}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeSubTab === "revenue"
              ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm border border-gray-200/50 dark:border-gray-800"
              : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          Revenue Simulator
        </button>
        <button
          onClick={() => setActiveSubTab("engagement")}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeSubTab === "engagement"
              ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm border border-gray-200/50 dark:border-gray-800"
              : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-red-500" />
          Engagement Audit
        </button>
        <button
          onClick={() => setActiveSubTab("growth")}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeSubTab === "growth"
              ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm border border-gray-200/50 dark:border-gray-800"
              : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          <Users className="w-3.5 h-3.5 text-blue-500" />
          Growth Estimator
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TAB 1: REVENUE SIMULATOR */}
        {activeSubTab === "revenue" && (
          <>
            {/* Left Params */}
            <div className="lg:col-span-6 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-4">CPM Niche Quick Presets</span>
                <div className="grid grid-cols-2 gap-2.5">
                  {cpmPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setCpm(preset.value)}
                      className={`p-3 text-left rounded-xl border transition cursor-pointer ${
                        cpm === preset.value
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                          : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 block">{preset.name}</span>
                      <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 block mt-1">${preset.value.toFixed(2)} CPM</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                {/* Views Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                    <span>Monthly Views</span>
                    <span className="font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                      {views.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="10000000"
                    step="1000"
                    className="w-full accent-blue-600"
                    value={views}
                    onChange={(e) => setViews(parseInt(e.target.value))}
                  />
                  <div className="flex justify-between text-[10px] text-gray-600 dark:text-gray-400 font-bold mt-1">
                    <span>1K Views</span>
                    <span>5M Views</span>
                    <span>10M Views</span>
                  </div>
                </div>

                {/* CPM Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                    <span>Estimated Advertising CPM ($)</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
                      ${cpm.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.50"
                    max="25.00"
                    step="0.10"
                    className="w-full accent-emerald-500"
                    value={cpm}
                    onChange={(e) => setCpm(parseFloat(e.target.value))}
                  />
                  <div className="flex justify-between text-[10px] text-gray-600 dark:text-gray-400 font-bold mt-1">
                    <span>$0.50</span>
                    <span>$12.50</span>
                    <span>$25.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Output results */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Main revenue outputs cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase block mb-1">Estimated Daily</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">${revenueStats.daily.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase block mb-1">Estimated Monthly</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">${revenueStats.creatorShare.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase block mb-1">Estimated Yearly</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">${revenueStats.yearly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              {/* Share details card */}
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Gross vs Creator Share Split</span>
                
                <div className="space-y-3 text-xs">
                  
                  {/* Total Gross */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-850">
                    <span className="text-gray-500 font-semibold">Total Gross Pool (100%):</span>
                    <span className="font-bold text-gray-900 dark:text-white">${revenueStats.gross.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>

                  {/* YouTube platform share */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-850">
                    <span className="text-gray-500 font-semibold">YouTube Platform Cut (45%):</span>
                    <span className="font-bold text-red-500">-${(revenueStats.gross * 0.45).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>

                  {/* Creator Net Share */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-850">
                    <span className="text-gray-700 dark:text-gray-200 font-bold">Creator Net Payoff (55%):</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">${revenueStats.creatorShare.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>

                  {/* Creator RPM */}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 dark:text-gray-200 font-bold">Estimated Net RPM:</span>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400">${revenueStats.rpm.toFixed(2)} RPM</span>
                  </div>

                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded-xl text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">
                  Note: CPM is "Cost Per Mille" (cost per 1000 ad impressions). RPM is "Revenue Per Mille" (what creators earn per 1000 views). Real outputs will vary depending on mobile view densities, region demographies (geo), and seasonal ad spending constraints.
                </div>
              </div>

            </div>
          </>
        )}

        {/* TAB 2: ENGAGEMENT AUDITOR */}
        {activeSubTab === "engagement" && (
          <>
            {/* Inputs Column */}
            <div className="lg:col-span-6 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Engagement Inputs</span>
              
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-gray-600 dark:text-gray-400 mb-1.5">Total Video Views</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                    value={vViews}
                    onChange={(e) => setVViews(Math.max(0, parseInt(e.target.value) || 0))}
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 dark:text-gray-400 mb-1.5">Total Likes</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                    value={vLikes}
                    onChange={(e) => setVLikes(Math.max(0, parseInt(e.target.value) || 0))}
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 dark:text-gray-400 mb-1.5">Total Comments</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                    value={vComments}
                    onChange={(e) => setVComments(Math.max(0, parseInt(e.target.value) || 0))}
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 dark:text-gray-400 mb-1.5">Total Video Shares</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                    value={vShares}
                    onChange={(e) => setVShares(Math.max(0, parseInt(e.target.value) || 0))}
                  />
                </div>
              </div>
            </div>

            {/* Result Column */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-center space-y-4">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Audited Engagement Results</span>

                {/* Engagement Rate Display */}
                <div className="py-2">
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 block">Total Engagement Rate</span>
                  <span className="text-4xl font-black text-gray-900 dark:text-white block mt-1">{engagementStats.rate.toFixed(2)}%</span>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full mt-3 inline-block ${engagementStats.color}`}>
                    {engagementStats.tier}
                  </span>
                </div>

                {/* Context Benchmark Slider */}
                <div className="pt-2 border-t border-gray-50 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block text-left mb-2">Algorithm Benchmarks</span>
                  <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                    <div className="h-full bg-red-400" style={{ width: "10%" }} title="Low"></div>
                    <div className="h-full bg-amber-400" style={{ width: "25%" }} title="Average"></div>
                    <div className="h-full bg-emerald-400" style={{ width: "35%" }} title="High"></div>
                    <div className="h-full bg-blue-400" style={{ width: "30%" }} title="Viral"></div>
                  </div>
                  <div className="flex justify-between text-[8px] text-gray-600 dark:text-gray-400 font-bold mt-1.5 uppercase">
                    <span>&lt;1% Low</span>
                    <span>1%-3.5% Good</span>
                    <span>3.5%-7% High</span>
                    <span>&gt;7% Viral</span>
                  </div>
                </div>

                {/* Engagement Tips list */}
                <div className="text-left bg-gray-50 dark:bg-gray-850 p-4 rounded-xl text-xs text-gray-600 dark:text-gray-300 space-y-1.5">
                  <span className="font-bold text-gray-800 dark:text-gray-100 block">Auditor Pro Tips:</span>
                  {engagementStats.rate < 3.5 ? (
                    <p className="leading-relaxed">Your engagement rate is standard. To boost interactions, ask a specific question in your intro, pinned comments, or add highly interactive visual cards/end-screens.</p>
                  ) : (
                    <p className="leading-relaxed text-emerald-600 dark:text-emerald-400 font-medium">Excellent engagement! Your audience is highly engaged with your content. The YouTube Recommendation algorithm is likely to prioritize this video's distribution.</p>
                  )}
                </div>

              </div>

            </div>
          </>
        )}

        {/* TAB 3: GROWTH FORECASTS */}
        {activeSubTab === "growth" && (
          <>
            {/* Input Param slider */}
            <div className="lg:col-span-5 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Growth Configurations</span>

              {/* Current Subs */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Current Subscribers</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold outline-none text-xs"
                  value={currentSubs}
                  onChange={(e) => setCurrentSubs(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>

              {/* Forecast views */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Monthly Views Forecast</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold outline-none text-xs"
                  value={monthlyGrowthViews}
                  onChange={(e) => setMonthlyGrowthViews(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>

              {/* Conversion Rate slider */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  <span>Subscribe Conversion Rate</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded">
                    {conversionRate.toFixed(2)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.05"
                  className="w-full accent-blue-600"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(parseFloat(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-gray-600 dark:text-gray-400 font-bold mt-1">
                  <span>0.1% (Low)</span>
                  <span>2.5%</span>
                  <span>5.0% (High)</span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded-xl text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">
                An average channel gains around <strong>0.5% to 1.5%</strong> subscribers relative to their total video views count. Creating themed content and playlists improves conversion rates significantly.
              </div>
            </div>

            {/* Output Trends & SVG line graph */}
            <div className="lg:col-span-7 space-y-6">
              
              {renderGrowthSvg()}

              {/* Predictions projections summary rows */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 space-y-3">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Projections Forecast</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {growthProjections.slice(1).map((d) => (
                    <div key={d.label} className="p-3 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                      <span className="text-[10px] text-gray-600 dark:text-gray-400 font-bold block uppercase">{d.label}</span>
                      <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 block mt-1">{Math.round(d.subs).toLocaleString()}</span>
                      <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">+{Math.round(d.subs - currentSubs).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}

      </div>

    </div>
  );
}
