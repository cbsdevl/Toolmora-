import React, { useState } from "react";
import { Copy, RotateCcw, Check, Download, Braces, AlertCircle, FileJson } from "lucide-react";

export default function JSONFormatter() {
  const [inputJson, setInputJson] = useState("");
  const [outputJson, setOutputJson] = useState("");
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleJson = {
    name: "ToolMora",
    version: "1.0.0",
    features: [
      "20 offline tools",
      "SEO optimized",
      "Admin dashboard",
      "AdSense ready"
    ],
    performance: {
      lighthouse: 100,
      interactive: true
    }
  };

  const handleLoadSample = () => {
    const sample = JSON.stringify(sampleJson, null, 2);
    setInputJson(sample);
    setOutputJson(sample);
    setError(null);
  };

  const handleBeautify = () => {
    if (!inputJson.trim()) {
      setOutputJson("");
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutputJson(formatted);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid JSON syntax. Please check brackets, quotes, and commas.");
    }
  };

  const handleMinify = () => {
    if (!inputJson.trim()) {
      setOutputJson("");
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setOutputJson(minified);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid JSON syntax. Please check brackets, quotes, and commas.");
    }
  };

  const handleCopy = async () => {
    if (!outputJson) return;
    try {
      await navigator.clipboard.writeText(outputJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!outputJson) return;
    const element = document.createElement("a");
    const file = new Blob([outputJson], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = "toolmora-formatted.json";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setInputJson("");
    setOutputJson("");
    setError(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="json-formatter-card">
      <div className="space-y-6">
        {/* Controls block */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleLoadSample}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition cursor-pointer active:scale-95"
            >
              <FileJson className="w-4 h-4 text-blue-500" />
              Load Sample JSON
            </button>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-1.5 bg-white text-xs">
              <span className="text-gray-500 font-medium">Spacing:</span>
              <select
                className="font-bold text-gray-700 outline-none cursor-pointer"
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleBeautify}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer active:scale-95"
            >
              Beautify / Format
            </button>
            <button
              onClick={handleMinify}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer active:scale-95"
            >
              Minify JSON
            </button>
            <button
              onClick={handleReset}
              className="p-2 border border-gray-200 hover:bg-red-50 hover:border-red-100 text-gray-500 hover:text-red-500 rounded-xl transition cursor-pointer active:scale-95"
              title="Clear All"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Input & Output Textareas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input column */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Raw JSON Input</label>
            <textarea
              className="w-full h-96 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xs resize-y"
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              placeholder='{"name":"ToolMora","version":"1.0.0"} (paste raw JSON here)...'
            />
          </div>

          {/* Output column */}
          <div className="space-y-2 relative">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700 block">Formatted Output</label>
              {outputJson && !error && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              )}
            </div>
            
            <textarea
              readOnly
              className={`w-full h-96 p-4 rounded-xl border outline-none font-mono text-xs ${
                error
                  ? "border-red-100 bg-red-50/5 text-gray-600 dark:text-gray-400"
                  : outputJson
                  ? "border-emerald-100 bg-emerald-50/5 text-gray-700"
                  : "border-gray-200 bg-gray-50/5 text-gray-600 dark:text-gray-400"
              }`}
              value={error ? "" : outputJson}
              placeholder="Your formatted JSON will be rendered here..."
            />

            {/* Error Overlay */}
            {error && (
              <div className="absolute left-3 right-3 bottom-3 bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 text-red-800 text-xs">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
                <div className="space-y-1">
                  <p className="font-bold">JSON Parsing Error Detected:</p>
                  <p className="font-mono">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
