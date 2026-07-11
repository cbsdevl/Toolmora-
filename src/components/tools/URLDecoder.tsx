import React, { useState } from "react";
import { Copy, RotateCcw, Check, Download, AlertTriangle } from "lucide-react";

export default function URLDecoder() {
  const [inputText, setInputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDecodedText = () => {
    if (!inputText.trim()) {
      if (error) setError(null);
      return "";
    }
    try {
      const decoded = decodeURIComponent(inputText.trim());
      if (error) setError(null);
      return decoded;
    } catch (err) {
      if (!error) setError("Failed to decode. Ensure percent-encodings are syntactically complete (e.g. %20 or %3F).");
      return "";
    }
  };

  const outputText = getDecodedText();

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
    element.download = "url-decoded.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleClear = () => {
    setInputText("");
    setError(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="url-decoder-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Percent Encoded URL Input</label>
          <textarea
            className={`w-full h-64 p-4 rounded-xl border outline-none font-mono text-xs ${
              error ? "border-red-200 focus:ring-2 focus:ring-red-500" : "border-gray-200 focus:ring-2 focus:ring-blue-500"
            }`}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setError(null);
            }}
            placeholder="e.g. name%3DElena%20Vance%26city%3DSeattle%20WA (paste encoded URL here)..."
          />
        </div>

        {/* Output Textarea */}
        <div className="space-y-2 relative">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700 block">Readable Output</label>
            {outputText && !error && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            )}
          </div>
          <textarea
            readOnly
            className={`w-full h-64 p-4 rounded-xl border outline-none text-sm font-sans ${
              error
                ? "border-red-100 bg-red-50/5 text-gray-600 dark:text-gray-400"
                : outputText
                ? "border-emerald-100 bg-emerald-50/5 text-gray-700"
                : "border-gray-200 bg-gray-50/5 text-gray-600 dark:text-gray-400"
            }`}
            value={error ? "" : outputText}
            placeholder="Decoded plain text results will appear here..."
          />

          {error && (
            <div className="absolute left-3 right-3 bottom-3 bg-red-50 border border-red-100 p-3.5 rounded-xl flex gap-2.5 text-red-800 text-xs">
              <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0 text-red-500" />
              <div className="space-y-0.5">
                <p className="font-bold">Decoding Error:</p>
                <p className="leading-relaxed">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {inputText && (
        <div className="flex gap-3 justify-start mt-4 border-t border-gray-100 pt-4">
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Fields
          </button>
        </div>
      )}
    </div>
  );
}
