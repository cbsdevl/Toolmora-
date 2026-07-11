import React, { useState } from "react";
import { Copy, RotateCcw, Check, Download } from "lucide-react";

export default function Base64Encoder() {
  const [inputText, setInputText] = useState("");
  const [copied, setCopied] = useState(false);

  const getEncodedText = () => {
    if (!inputText) return "";
    try {
      // Handle Unicode characters correctly
      const utf8Bytes = new TextEncoder().encode(inputText);
      const binString = Array.from(utf8Bytes, (byte) => String.fromCharCode(byte)).join("");
      return btoa(binString);
    } catch (err) {
      return "Encoding failed. Ensure text contains valid character maps.";
    }
  };

  const outputText = getEncodedText();

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
    element.download = "base64-encoded.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="base64-encoder-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Plain Text Input</label>
          <textarea
            className="w-full h-64 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 text-sm font-sans"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your raw text here to encode..."
          />
        </div>

        {/* Output Textarea */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700 block">Base64 Encoded Output</label>
            {outputText && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition cursor-pointer"
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
            className="w-full h-64 p-4 rounded-xl border border-blue-100 bg-blue-50/5 focus:ring-0 outline-none font-mono text-xs text-gray-700"
            value={outputText}
            placeholder="Base64 output string will appear here..."
          />
        </div>
      </div>
      {inputText && (
        <div className="flex gap-3 justify-start mt-4 border-t border-gray-100 pt-4">
          <button
            onClick={() => setInputText("")}
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
