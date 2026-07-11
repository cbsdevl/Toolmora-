import React, { useState } from "react";
import { Percent, RotateCcw } from "lucide-react";

export default function PercentageCalculator() {
  // Calculator 1: What is X% of Y?
  const [c1X, setC1X] = useState("15");
  const [c1Y, setC1Y] = useState("200");
  const [c1Result, setC1Result] = useState<string>("30");

  // Calculator 2: X is what percentage of Y?
  const [c2X, setC2X] = useState("30");
  const [c2Y, setC2Y] = useState("200");
  const [c2Result, setC2Result] = useState<string>("15");

  // Calculator 3: Percentage increase/decrease from X to Y?
  const [c3X, setC3X] = useState("100");
  const [c3Y, setC3Y] = useState("150");
  const [c3Result, setC3Result] = useState<string>("50");
  const [c3Type, setC3Type] = useState<string>("increase");

  const calculateC1 = (x: string, y: string) => {
    const valX = parseFloat(x);
    const valY = parseFloat(y);
    if (!isNaN(valX) && !isNaN(valY)) {
      setC1Result(((valX / 100) * valY).toFixed(2).replace(/\.00$/, ""));
    } else {
      setC1Result("");
    }
  };

  const calculateC2 = (x: string, y: string) => {
    const valX = parseFloat(x);
    const valY = parseFloat(y);
    if (!isNaN(valX) && !isNaN(valY) && valY !== 0) {
      setC2Result(((valX / valY) * 100).toFixed(2).replace(/\.00$/, ""));
    } else {
      setC2Result("");
    }
  };

  const calculateC3 = (x: string, y: string) => {
    const valX = parseFloat(x);
    const valY = parseFloat(y);
    if (!isNaN(valX) && !isNaN(valY) && valX !== 0) {
      const diff = valY - valX;
      const pct = (diff / valX) * 100;
      setC3Result(Math.abs(pct).toFixed(2).replace(/\.00$/, ""));
      setC3Type(pct >= 0 ? "increase" : "decrease");
    } else {
      setC3Result("");
    }
  };

  const handleReset = () => {
    setC1X("15"); setC1Y("200"); setC1Result("30");
    setC2X("30"); setC2Y("200"); setC2Result("15");
    setC3X("100"); setC3Y("150"); setC3Result("50"); setC3Type("increase");
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="percentage-calculator-card">
      <div className="space-y-8">
        
        {/* Calculator 1: What is X% of Y? */}
        <div className="border-b border-gray-100 pb-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">1</span>
            <h4>What is X% of Y?</h4>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">What is</span>
            <input
              type="number"
              value={c1X}
              onChange={(e) => { setC1X(e.target.value); calculateC1(e.target.value, c1Y); }}
              className="w-24 px-3 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-center"
            />
            <span className="text-sm text-gray-500 font-medium">% of</span>
            <input
              type="number"
              value={c1Y}
              onChange={(e) => { setC1Y(e.target.value); calculateC1(c1X, e.target.value); }}
              className="w-28 px-3 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-center"
            />
            <span className="text-sm text-gray-500 font-bold">=</span>
            <span className="px-4 py-2 bg-blue-50/50 border border-blue-100 text-blue-700 rounded-xl font-bold font-mono text-sm min-w-16 text-center">
              {c1Result !== "" ? c1Result : "—"}
            </span>
          </div>
        </div>

        {/* Calculator 2: X is what % of Y? */}
        <div className="border-b border-gray-100 pb-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-xs">2</span>
            <h4>X is what percentage of Y?</h4>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              value={c2X}
              onChange={(e) => { setC2X(e.target.value); calculateC2(e.target.value, c2Y); }}
              className="w-24 px-3 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm text-center"
            />
            <span className="text-sm text-gray-500 font-medium">is what percentage of</span>
            <input
              type="number"
              value={c2Y}
              onChange={(e) => { setC2Y(e.target.value); calculateC2(c2X, e.target.value); }}
              className="w-28 px-3 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm text-center"
            />
            <span className="text-sm text-gray-500 font-bold">=</span>
            <span className="px-4 py-2 bg-emerald-50/50 border border-emerald-100 text-emerald-700 rounded-xl font-bold font-mono text-sm min-w-16 text-center">
              {c2Result !== "" ? `${c2Result}%` : "—"}
            </span>
          </div>
        </div>

        {/* Calculator 3: Percentage increase/decrease */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 font-bold flex items-center justify-center text-xs">3</span>
            <h4>What is the percentage increase or decrease from X to Y?</h4>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">From</span>
            <input
              type="number"
              value={c3X}
              onChange={(e) => { setC3X(e.target.value); calculateC3(e.target.value, c3Y); }}
              className="w-24 px-3 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm text-center"
            />
            <span className="text-sm text-gray-500 font-medium">to</span>
            <input
              type="number"
              value={c3Y}
              onChange={(e) => { setC3Y(e.target.value); calculateC3(c3X, e.target.value); }}
              className="w-28 px-3 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm text-center"
            />
            <span className="text-sm text-gray-500 font-bold">=</span>
            <span className={`px-4 py-2 border rounded-xl font-bold font-mono text-sm min-w-16 text-center flex items-center gap-1.5 ${
              c3Result === ""
                ? "bg-gray-50/50 border-gray-100 text-gray-500"
                : c3Type === "increase"
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : "bg-red-50 border-red-100 text-red-700"
            }`}>
              {c3Result !== "" ? `${c3Result}%` : "—"}
              {c3Result !== "" && <span className="text-[10px] uppercase font-bold tracking-wider">({c3Type})</span>}
            </span>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex justify-start pt-2 border-t border-gray-100">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-semibold text-xs transition cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Calculators
          </button>
        </div>
      </div>
    </div>
  );
}
