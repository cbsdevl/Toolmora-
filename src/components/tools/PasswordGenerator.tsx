import React, { useState, useEffect } from "react";
import { Copy, RotateCw, Check, Download } from "lucide-react";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [strengthPercent, setStrengthPercent] = useState(0);
  const [strengthColor, setStrengthColor] = useState("bg-red-500");
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = "";
    let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let lower = "abcdefghijklmnopqrstuvwxyz";
    let numbers = "0123456789";
    let symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (excludeSimilar) {
      upper = upper.replace(/[IO]/g, "");
      lower = lower.replace(/[lo]/g, "");
      numbers = numbers.replace(/[01]/g, "");
      symbols = symbols.replace(/[|.,]/g, "");
    }

    if (includeUpper) charset += upper;
    if (includeLower) charset += lower;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (!charset) {
      setPassword("Please select at least one character set.");
      setStrength("");
      setStrengthPercent(0);
      return;
    }

    // Use cryptographically secure values
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    setPassword(result);
    calculateStrength(result);
  };

  const calculateStrength = (pwd: string) => {
    if (!pwd || pwd.startsWith("Please")) {
      setStrengthPercent(0);
      setStrength("");
      return;
    }
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 14) score += 1;
    if (pwd.length >= 20) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    let text = "Weak";
    let pct = 25;
    let color = "bg-red-500";

    if (score >= 6) {
      text = "Very Strong ✨";
      pct = 100;
      color = "bg-green-500";
    } else if (score >= 4) {
      text = "Strong";
      pct = 75;
      color = "bg-emerald-500";
    } else if (score >= 3) {
      text = "Medium";
      pct = 50;
      color = "bg-amber-500";
    }

    setStrength(text);
    setStrengthPercent(pct);
    setStrengthColor(color);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeSimilar]);

  const handleCopy = async () => {
    if (!password || password.startsWith("Please")) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!password || password.startsWith("Please")) return;
    const element = document.createElement("a");
    const file = new Blob([password], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "toolmora-password.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setLength(16);
    setIncludeUpper(true);
    setIncludeLower(true);
    setIncludeNumbers(true);
    setIncludeSymbols(true);
    setExcludeSimilar(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="password-generator-card">
      <div className="space-y-6">
        {/* Output Area */}
        <div className="flex items-center justify-between gap-4 bg-gray-50 border border-gray-100 rounded-xl p-4 font-mono text-base md:text-lg break-all select-all">
          <span className={password.startsWith("Please") ? "text-gray-600 dark:text-gray-400 text-sm font-sans" : "text-gray-800"}>
            {password}
          </span>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleCopy}
              className="p-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg shadow-sm transition"
              title="Copy Password"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={generatePassword}
              className="p-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg shadow-sm transition"
              title="Regenerate"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Password Strength */}
        {strength && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
              <span>Password Strength</span>
              <span className="uppercase tracking-wider">{strength}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${strengthColor} transition-all duration-300`}
                style={{ width: `${strengthPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Configuration */}
        <div className="space-y-5">
          {/* Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Password Length</label>
              <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                {length} characters
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={128}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100/75 transition border border-gray-50">
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={(e) => setIncludeUpper(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-sm">
                <p className="font-medium text-gray-700">Uppercase Letters</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">(A-Z)</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100/75 transition border border-gray-50">
              <input
                type="checkbox"
                checked={includeLower}
                onChange={(e) => setIncludeLower(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-sm">
                <p className="font-medium text-gray-700">Lowercase Letters</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">(a-z)</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100/75 transition border border-gray-50">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-sm">
                <p className="font-medium text-gray-700">Numeric Digits</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">(0-9)</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100/75 transition border border-gray-50">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-sm">
                <p className="font-medium text-gray-700">Special Symbols</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">(!@#$%^&*)</p>
              </div>
            </label>
          </div>

          {/* Exclude Similar characters */}
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100/75 transition border border-gray-50">
            <input
              type="checkbox"
              checked={excludeSimilar}
              onChange={(e) => setExcludeSimilar(e.target.checked)}
              className="w-4.5 h-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="text-sm">
              <p className="font-medium text-gray-700">Exclude Similar Characters</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">Avoids confusing symbols like l, 1, o, 0, I</p>
            </div>
          </label>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition duration-150 shadow-sm active:scale-95"
            >
              <Download className="w-4.5 h-4.5" />
              Download txt
            </button>
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-medium text-sm transition duration-150 active:scale-95"
            >
              <RotateCw className="w-4 h-4" />
              Reset Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
