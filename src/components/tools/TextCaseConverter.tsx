import React, { useState } from "react";
import { Copy, RotateCcw, Check, Download } from "lucide-react";

export default function TextCaseConverter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

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
    element.download = "case-converter-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Case Conversion Functions
  const toUpperCase = () => {
    setText(text.toUpperCase());
  };

  const toLowerCase = () => {
    setText(text.toLowerCase());
  };

  const toSentenceCase = () => {
    // Capitalize first letter of each sentence
    const converted = text
      .toLowerCase()
      .replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, g1, g2) => g1 + g2.toUpperCase());
    setText(converted);
  };

  const toTitleCase = () => {
    const converted = text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    setText(converted);
  };

  const toCamelCase = () => {
    const converted = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, "");
    setText(converted);
  };

  const toKebabCase = () => {
    const converted = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setText(converted);
  };

  const toSnakeCase = () => {
    const converted = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    setText(converted);
  };

  const toAlternatingCase = () => {
    const converted = text
      .split("")
      .map((char, index) => (index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
      .join("");
    setText(converted);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="text-case-converter-card">
      <div className="space-y-6">
        {/* Input Area */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Enter Your Text</label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!text}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Result
              </button>
              <button
                onClick={handleDownload}
                disabled={!text}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                Download txt
              </button>
              <button
                onClick={() => setText("")}
                disabled={!text}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>
          <textarea
            className="w-full h-56 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 text-sm font-sans"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text to change its casing format..."
          />
        </div>

        {/* Action Controls */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
            Case Formats Conversion
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={toSentenceCase}
              disabled={!text}
              className="py-3 px-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 text-gray-700 hover:text-blue-700 rounded-xl font-semibold text-xs text-center transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sentence case
            </button>
            <button
              onClick={toLowerCase}
              disabled={!text}
              className="py-3 px-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 text-gray-700 hover:text-blue-700 rounded-xl font-semibold text-xs text-center transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              lower case
            </button>
            <button
              onClick={toUpperCase}
              disabled={!text}
              className="py-3 px-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 text-gray-700 hover:text-blue-700 rounded-xl font-semibold text-xs text-center transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              UPPER CASE
            </button>
            <button
              onClick={toTitleCase}
              disabled={!text}
              className="py-3 px-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 text-gray-700 hover:text-blue-700 rounded-xl font-semibold text-xs text-center transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Title Case
            </button>
            <button
              onClick={toCamelCase}
              disabled={!text}
              className="py-3 px-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 text-gray-700 hover:text-blue-700 rounded-xl font-semibold text-xs text-center transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              camelCase
            </button>
            <button
              onClick={toKebabCase}
              disabled={!text}
              className="py-3 px-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 text-gray-700 hover:text-blue-700 rounded-xl font-semibold text-xs text-center transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              kebab-case
            </button>
            <button
              onClick={toSnakeCase}
              disabled={!text}
              className="py-3 px-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 text-gray-700 hover:text-blue-700 rounded-xl font-semibold text-xs text-center transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              snake_case
            </button>
            <button
              onClick={toAlternatingCase}
              disabled={!text}
              className="py-3 px-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 text-gray-700 hover:text-blue-700 rounded-xl font-semibold text-xs text-center transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              aLtErNaTiNg CaSe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
