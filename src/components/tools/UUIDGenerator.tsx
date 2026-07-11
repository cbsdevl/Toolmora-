import React, { useState, useEffect } from "react";
import { Copy, RotateCcw, Check, Download, Layers } from "lucide-react";

export default function UUIDGenerator() {
  const [quantity, setQuantity] = useState(10);
  const [useUppercase, setUseUppercase] = useState(false);
  const [useHyphens, setUseHyphens] = useState(true);
  const [useBraces, setUseBraces] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Secure UUID v4 Generator
  const generateUUIDv4 = () => {
    // Generate RFC 4122 v4 UUID
    const cryptoObj = window.crypto;
    const buffer = new Uint8Array(16);
    cryptoObj.getRandomValues(buffer);

    // Set variant and version
    buffer[6] = (buffer[6] & 0x0f) | 0x40; // Version 4
    buffer[8] = (buffer[8] & 0x3f) | 0x80; // Variant 10xxxxxx

    const hex: string[] = [];
    for (let i = 0; i < 16; i++) {
      hex.push(buffer[i].toString(16).padStart(2, "0"));
    }

    let uuid = "";
    if (useHyphens) {
      uuid = `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
    } else {
      uuid = hex.join("");
    }

    if (useUppercase) uuid = uuid.toUpperCase();
    if (useBraces) uuid = `{${uuid}}`;

    return uuid;
  };

  const handleGenerate = () => {
    const list: string[] = [];
    const count = Math.min(Math.max(quantity, 1), 100);
    for (let i = 0; i < count; i++) {
      list.push(generateUUIDv4());
    }
    setUuids(list);
  };

  useEffect(() => {
    handleGenerate();
  }, [quantity, useUppercase, useHyphens, useBraces]);

  const outputText = uuids.join("\n");

  const handleCopyAll = async () => {
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
    element.download = "generated-uuids.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="uuid-generator-card">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="md:col-span-1 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of UUIDs to Generate
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 block">Maximum bulk size is 100 UUIDs.</span>
          </div>

          <div className="space-y-3.5">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
              UUID Formatting Options
            </span>

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100/75 transition border border-gray-50">
              <input
                type="checkbox"
                checked={useHyphens}
                onChange={(e) => setUseHyphens(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-sm">
                <p className="font-medium text-gray-700">Include Hyphens</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">e.g. 123e4567-e89b...</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100/75 transition border border-gray-50">
              <input
                type="checkbox"
                checked={useUppercase}
                onChange={(e) => setUseUppercase(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-sm">
                <p className="font-medium text-gray-700">Uppercase Letters</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">e.g. 123E4567-E89B...</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100/75 transition border border-gray-50">
              <input
                type="checkbox"
                checked={useBraces}
                onChange={(e) => setUseBraces(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-sm">
                <p className="font-medium text-gray-700">Add Curly Braces</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">e.g. &#123;123e4567...&#125;</p>
              </div>
            </label>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold text-sm transition shadow-sm active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Regenerate UUIDs
          </button>
        </div>

        {/* Results Area */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Generated Identifiers List</span>
            <div className="flex gap-2">
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                Copy All
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download txt
              </button>
            </div>
          </div>
          <textarea
            readOnly
            className="w-full h-80 p-4 rounded-xl border border-gray-200 bg-gray-50/25 focus:ring-0 outline-none font-mono text-xs text-gray-700 leading-relaxed"
            value={outputText}
          />
        </div>
      </div>
    </div>
  );
}
