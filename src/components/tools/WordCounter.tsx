import React, { useState } from "react";
import { Copy, RotateCcw, Check, Download, BarChart2 } from "lucide-react";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // Stats calculation
  const cleanText = text.trim();
  const words = cleanText === "" ? [] : cleanText.split(/\s+/);
  const wordCount = words.length;
  const charWithSpaces = text.length;
  const charNoSpaces = text.replace(/\s/g, "").length;
  
  // Sentences count: split by . ! ?
  const sentences = cleanText === "" ? [] : cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;

  // Paragraphs count: split by double newlines
  const paragraphs = cleanText === "" ? [] : text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const paragraphCount = paragraphs.length;

  // Reading / Speaking times
  const readingTime = Math.ceil(wordCount / 225); // ~225 WPM
  const speakingTime = Math.ceil(wordCount / 130); // ~130 WPM

  // Keyword Density
  const getKeywordDensity = () => {
    if (words.length === 0) return [];
    const counts: Record<string, number> = {};
    
    words.forEach(word => {
      const w = word.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
      if (w.length > 2) { // Only count words longer than 2 characters
        counts[w] = (counts[w] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([word, count]) => ({
        word,
        count,
        percentage: ((count / words.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 words
  };

  const densityList = getKeywordDensity();

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
    element.download = "toolmora-wordcounter-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="word-counter-card">
      <div className="space-y-6">
        {/* Main Text Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Enter Your Text</label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!text}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Text
              </button>
              <button
                onClick={handleDownload}
                disabled={!text}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-3.5 h-3.5" />
                Download txt
              </button>
              <button
                onClick={() => setText("")}
                disabled={!text}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>
          <textarea
            className="w-full h-64 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-y text-gray-700 text-sm font-sans"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type, paste, or drag and drop your text here to begin analysis..."
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 font-mono">{wordCount}</div>
            <div className="text-xs font-medium text-blue-700 mt-1">Words</div>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600 font-mono">{charWithSpaces}</div>
            <div className="text-xs font-medium text-emerald-700 mt-1">Chars (Spaces)</div>
          </div>
          <div className="bg-amber-50/50 border border-amber-100/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-600 font-mono">{charNoSpaces}</div>
            <div className="text-xs font-medium text-amber-700 mt-1">Chars (No Space)</div>
          </div>
          <div className="bg-purple-50/50 border border-purple-100/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 font-mono">{sentenceCount}</div>
            <div className="text-xs font-medium text-purple-700 mt-1">Sentences</div>
          </div>
          <div className="bg-pink-50/50 border border-pink-100/50 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
            <div className="text-2xl font-bold text-pink-600 font-mono">{paragraphCount}</div>
            <div className="text-xs font-medium text-pink-700 mt-1">Paragraphs</div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center text-sm border border-gray-100">
            <span className="text-gray-600 font-medium">Estimated Reading Time</span>
            <span className="font-semibold text-gray-800 font-mono bg-white px-2.5 py-1 rounded-lg border border-gray-100">
              {wordCount > 0 ? `${readingTime} min` : "0 min"}
            </span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center text-sm border border-gray-100">
            <span className="text-gray-600 font-medium">Estimated Speaking Time</span>
            <span className="font-semibold text-gray-800 font-mono bg-white px-2.5 py-1 rounded-lg border border-gray-100">
              {wordCount > 0 ? `${speakingTime} min` : "0 min"}
            </span>
          </div>
        </div>

        {/* Keyword Density List */}
        {densityList.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">
              <BarChart2 className="w-4 h-4 text-blue-500" />
              <span>Keyword Density (Top Words)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {densityList.map(({ word, count, percentage }) => (
                <div key={word} className="flex items-center justify-between text-sm bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="font-mono font-medium text-gray-800">{word}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{count} times</span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
