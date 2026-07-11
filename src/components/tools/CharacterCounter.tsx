import React, { useState } from "react";
import { Copy, RotateCcw, Check, Download, AlertTriangle } from "lucide-react";

interface LimitOption {
  name: string;
  max: number;
  desc: string;
}

export default function CharacterCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState("twitter");

  const platforms: Record<string, LimitOption> = {
    twitter: { name: "Twitter / X Post", max: 280, desc: "Standard limit for single tweets." },
    googleTitle: { name: "Google Title tag", max: 60, desc: "Recommended SEO length to prevent truncation." },
    googleDesc: { name: "Google Meta Description", max: 160, desc: "Optimal SEO summary length in search results." },
    sms: { name: "Standard SMS Block", max: 160, desc: "Single SMS character boundary limit." },
    custom: { name: "Custom Counter", max: 5000, desc: "Flexible text limit block." },
  };

  const selectedPlatform = platforms[activePlatform];
  const charCount = text.length;
  const remaining = selectedPlatform.max - charCount;
  const progressPercent = Math.min((charCount / selectedPlatform.max) * 100, 100);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!text) return;
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "character-counter-output.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="character-counter-card">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Platform Picker */}
        <div className="md:col-span-1 space-y-2">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Platform Template
          </label>
          {Object.entries(platforms).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setActivePlatform(key)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition duration-150 ${
                activePlatform === key
                  ? "border-blue-500 bg-blue-50/50 text-blue-700"
                  : "border-gray-100 bg-gray-50/50 hover:bg-gray-100 text-gray-600"
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{item.name}</span>
                <span className="text-xs font-bold font-mono bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">
                  {item.max}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-normal leading-relaxed">{item.desc}</p>
            </button>
          ))}
        </div>

        {/* Editor & Progress Panel */}
        <div className="md:col-span-2 space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Write or Paste Text</span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!text}
                  className="p-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-lg text-xs disabled:opacity-50"
                  title="Copy Text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!text}
                  className="p-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-lg text-xs disabled:opacity-50"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setText("")}
                  disabled={!text}
                  className="p-2 bg-gray-50 border border-gray-200 hover:bg-red-50 text-red-600 rounded-lg text-xs disabled:opacity-50"
                  title="Clear Text"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <textarea
              className="w-full h-48 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 text-sm font-sans"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Enter text here. Limit is ${selectedPlatform.max} characters...`}
            />
          </div>

          {/* Stats Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Characters:</span>
                <span className="font-mono font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-800">
                  {charCount} / {selectedPlatform.max}
                </span>
              </div>
              <span className={`font-mono font-bold ${remaining < 0 ? "text-red-500" : "text-emerald-600"}`}>
                {remaining >= 0 ? `${remaining} remaining` : `${Math.abs(remaining)} over limit`}
              </span>
            </div>

            {/* Visual Gauge */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  charCount > selectedPlatform.max
                    ? "bg-red-500"
                    : progressPercent > 90
                    ? "bg-amber-500"
                    : "bg-blue-600"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {charCount > selectedPlatform.max && (
              <div className="flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>You have exceeded the optimal length for {selectedPlatform.name}!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
