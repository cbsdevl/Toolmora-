import React, { useState } from "react";
import { Copy, RotateCcw, Check, Download, AlertCircle } from "lucide-react";

type ConvertMode = "textToBinary" | "binaryToText" | "decToBinary" | "binaryToDec";

export default function BinaryConverter() {
  const [mode, setMode] = useState<ConvertMode>("textToBinary");
  const [inputVal, setInputVal] = useState("ToolMora");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertValue = () => {
    if (!inputVal) return "";
    
    try {
      if (mode === "textToBinary") {
        return inputVal
          .split("")
          .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
          .join(" ");
      }

      if (mode === "binaryToText") {
        // Clean spaces and check if valid binary
        const cleaned = inputVal.replace(/\s+/g, "");
        if (/[^01]/.test(cleaned)) {
          throw new Error("Binary string can only contain 0 and 1.");
        }
        
        // Split by 8-bits blocks
        const matches = cleaned.match(/.{1,8}/g) || [];
        return matches
          .map((bin) => String.fromCharCode(parseInt(bin, 2)))
          .join("");
      }

      if (mode === "decToBinary") {
        const num = parseInt(inputVal, 10);
        if (isNaN(num)) {
          throw new Error("Please enter a valid decimal integer.");
        }
        return num.toString(2);
      }

      if (mode === "binaryToDec") {
        const cleaned = inputVal.replace(/\s+/g, "");
        if (/[^01]/.test(cleaned)) {
          throw new Error("Binary string can only contain 0 and 1.");
        }
        return parseInt(cleaned, 2).toString(10);
      }
    } catch (err: any) {
      return `Error: ${err.message}`;
    }
    return "";
  };

  const outputVal = convertValue();
  const isOutputError = outputVal.startsWith("Error: ");

  const handleCopy = async () => {
    if (!outputVal || isOutputError) return;
    try {
      await navigator.clipboard.writeText(outputVal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!outputVal || isOutputError) return;
    const element = document.createElement("a");
    const file = new Blob([outputVal], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "binary-converter-output.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleModeChange = (newMode: ConvertMode) => {
    setMode(newMode);
    if (newMode === "textToBinary") setInputVal("ToolMora");
    else if (newMode === "binaryToText") setInputVal("01010100 01101111 01101111 01101100 01001101 01101111 01110010 01100001");
    else if (newMode === "decToBinary") setInputVal("256");
    else if (newMode === "binaryToDec") setInputVal("100000000");
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="binary-converter-card">
      <div className="space-y-6">
        {/* Toggle Mode Tabs */}
        <div className="flex flex-wrap gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100 text-xs font-semibold">
          {[
            { id: "textToBinary", label: "Text to Binary" },
            { id: "binaryToText", label: "Binary to Text" },
            { id: "decToBinary", label: "Decimal to Binary" },
            { id: "binaryToDec", label: "Binary to Decimal" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleModeChange(item.id as ConvertMode)}
              className={`flex-1 py-2 px-3 rounded-lg text-center transition cursor-pointer min-w-[120px] ${
                mode === item.id
                  ? "bg-white shadow-sm text-blue-600 border border-gray-100"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Inputs & Outputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">
              {mode === "textToBinary" && "Enter Plain English Text"}
              {mode === "binaryToText" && "Enter Binary Sequence (spaces ignored)"}
              {mode === "decToBinary" && "Enter Integer Number (base 10)"}
              {mode === "binaryToDec" && "Enter Binary Sequence"}
            </label>
            <textarea
              className="w-full h-56 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm resize-y text-gray-700"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type or paste to convert..."
            />
          </div>

          {/* Output */}
          <div className="space-y-2 relative">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700 block">Conversion Output Result</label>
              {outputVal && !isOutputError && (
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
              className={`w-full h-56 p-4 rounded-xl border outline-none font-mono text-sm ${
                isOutputError
                  ? "border-red-100 bg-red-50/5 text-gray-600 dark:text-gray-400"
                  : outputVal
                  ? "border-emerald-100 bg-emerald-50/5 text-gray-700 font-bold"
                  : "border-gray-200 bg-gray-50/5 text-gray-600 dark:text-gray-400"
              }`}
              value={isOutputError ? "" : outputVal}
              placeholder="Conversion outcome shows here..."
            />

            {isOutputError && (
              <div className="absolute left-3 right-3 bottom-3 bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 text-red-800 text-xs">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
                <div className="space-y-1">
                  <p className="font-bold">Conversion Error:</p>
                  <p className="font-mono">{outputVal.replace("Error: ", "")}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action resets */}
        {inputVal && (
          <div className="flex gap-3 justify-start border-t border-gray-100 pt-4">
            <button
              onClick={() => setInputVal("")}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Fields
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
