import React, { useState } from "react";
import { Copy, RotateCcw, Check, Download, Layers } from "lucide-react";

export default function RemoveDuplicateLines() {
  const [inputText, setInputText] = useState("");
  const [trimLines, setTrimLines] = useState(true);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compute clean deduplicated lines
  const getDeduplicatedLines = () => {
    if (!inputText) return { lines: [], originalCount: 0, removedCount: 0, uniqueCount: 0 };
    
    // Split input into lines
    const rawLines = inputText.split(/\r?\n/);
    const originalCount = rawLines.length;
    
    const seen = new Set<string>();
    const resultLines: string[] = [];

    rawLines.forEach((line) => {
      let processed = line;
      if (trimLines) processed = processed.trim();

      const comparisonKey = ignoreCase ? processed.toLowerCase() : processed;

      if (!seen.has(comparisonKey)) {
        seen.add(comparisonKey);
        resultLines.push(line); // Keep original line look but check duplicates based on key
      }
    });

    if (sortAlphabetically) {
      resultLines.sort((a, b) => {
        const valA = trimLines ? a.trim() : a;
        const valB = trimLines ? b.trim() : b;
        return valA.localeCompare(valB, undefined, { sensitivity: "base" });
      });
    }

    const uniqueCount = resultLines.length;
    const removedCount = originalCount - uniqueCount;

    return {
      lines: resultLines,
      originalCount,
      removedCount,
      uniqueCount
    };
  };

  const { lines, originalCount, removedCount, uniqueCount } = getDeduplicatedLines();
  const outputText = lines.join("\n");

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "deduplicated-lines.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setInputText("");
    setTrimLines(true);
    setIgnoreCase(false);
    setSortAlphabetically(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="remove-duplicate-lines-card">
      <div className="space-y-6">
        {/* Grids for inputs and settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input block */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Input List (One item per line)</label>
            <textarea
              className="w-full h-72 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xs resize-y"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Apple&#10;Orange&#10;Apple&#10;Banana&#10;banana (paste lines here)..."
            />
          </div>

          {/* Configuration and metrics block */}
          <div className="space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-sm font-semibold text-gray-700 block">Deduplication Rules</span>
              
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100/75 transition border border-gray-50">
                <input
                  type="checkbox"
                  checked={trimLines}
                  onChange={(e) => setTrimLines(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-700">Trim Whitespace</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Ignores spaces at start and end of lines.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100/75 transition border border-gray-50">
                <input
                  type="checkbox"
                  checked={ignoreCase}
                  onChange={(e) => setIgnoreCase(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-700">Ignore Casing Differences</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Treats "Apple" and "apple" as duplicates.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100/75 transition border border-gray-50">
                <input
                  type="checkbox"
                  checked={sortAlphabetically}
                  onChange={(e) => setSortAlphabetically(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-700">Sort Alphabetically</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Rearranges the unique output list from A to Z.</p>
                </div>
              </label>
            </div>

            {/* Metrics display */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs font-semibold text-gray-500">Original Lines</p>
                <p className="text-lg font-bold text-gray-700 font-mono mt-0.5">{originalCount}</p>
              </div>
              <div className="border-x border-gray-200">
                <p className="text-xs font-semibold text-gray-500 text-red-500">Duplicates</p>
                <p className="text-lg font-bold text-red-600 font-mono mt-0.5">-{removedCount}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 text-emerald-600">Remaining</p>
                <p className="text-lg font-bold text-emerald-600 font-mono mt-0.5">{uniqueCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Output view */}
        {uniqueCount > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Deduplicated Output</span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Result
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download txt
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-medium transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>
            <textarea
              readOnly
              className="w-full h-56 p-4 rounded-xl border border-emerald-100 bg-emerald-50/5 focus:ring-0 outline-none font-mono text-xs text-gray-700"
              value={outputText}
            />
          </div>
        )}
      </div>
    </div>
  );
}
