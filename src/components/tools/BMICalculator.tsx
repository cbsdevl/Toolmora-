import React, { useState } from "react";
import { Activity, RotateCcw, AlertCircle, Heart } from "lucide-react";

export default function BMICalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [weightLbs, setWeightLbs] = useState("150");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("8");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    let calculatedBmi = 0;

    if (unit === "metric") {
      const w = parseFloat(weight);
      const h = parseFloat(height) / 100; // to meters
      if (w > 0 && h > 0) {
        calculatedBmi = w / (h * h);
      }
    } else {
      const wLbs = parseFloat(weightLbs);
      const hFt = parseFloat(heightFt);
      const hIn = parseFloat(heightIn);
      const totalInches = hFt * 12 + hIn;
      if (wLbs > 0 && totalInches > 0) {
        calculatedBmi = (wLbs / (totalInches * totalInches)) * 703;
      }
    }

    if (calculatedBmi > 0) {
      setBmi(calculatedBmi);
      evaluateCategory(calculatedBmi);
    }
  };

  const evaluateCategory = (score: number) => {
    if (score < 18.5) {
      setCategory("Underweight");
      setColor("text-blue-500 border-blue-200 bg-blue-50");
    } else if (score >= 18.5 && score < 25) {
      setCategory("Normal Weight");
      setColor("text-emerald-600 border-emerald-200 bg-emerald-50");
    } else if (score >= 25 && score < 30) {
      setCategory("Overweight");
      setColor("text-amber-600 border-amber-200 bg-amber-50");
    } else {
      setCategory("Obese");
      setColor("text-red-600 border-red-200 bg-red-50");
    }
  };

  const handleReset = () => {
    setWeight("70");
    setHeight("175");
    setWeightLbs("150");
    setHeightFt("5");
    setHeightIn("8");
    setBmi(null);
    setCategory("");
  };

  const healthTips: Record<string, string[]> = {
    "Underweight": [
      "Focus on nutrient-rich foods like avocado, nuts, seeds, and oils.",
      "Incorporate strength training to build muscle mass safely.",
      "Consider eating smaller, more frequent meals throughout the day."
    ],
    "Normal Weight": [
      "Maintain a balanced diet rich in fibers, proteins, and whole grains.",
      "Engage in at least 150 minutes of moderate cardiovascular exercises weekly.",
      "Stay hydrated and maintain stable sleep cycles (7-8 hours)."
    ],
    "Overweight": [
      "Engage in regular physical activities such as cycling, running or walking.",
      "Monitor portion sizes and reduce processed carbohydrate and sugar intakes.",
      "Incorporate resistance exercises to preserve skeletal muscle volume."
    ],
    "Obese": [
      "Consult with healthcare practitioners or registered dietitians for guided calorie planning.",
      "Incorporate low-impact joint-friendly exercises like swimming or elliptical trainers.",
      "Track daily calories and establish structured food logging schedules."
    ]
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="bmi-calculator-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Input Form */}
        <div className="space-y-5">
          {/* Unit Toggle */}
          <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100 text-xs font-semibold">
            <button
              onClick={() => setUnit("metric")}
              className={`flex-1 py-2 rounded-lg text-center transition cursor-pointer ${
                unit === "metric" ? "bg-white shadow-sm text-blue-600 border border-gray-100" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Metric Units (kg / cm)
            </button>
            <button
              onClick={() => setUnit("imperial")}
              className={`flex-1 py-2 rounded-lg text-center transition cursor-pointer ${
                unit === "imperial" ? "bg-white shadow-sm text-blue-600 border border-gray-100" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Imperial Units (lbs / feet-inches)
            </button>
          </div>

          <form onSubmit={calculateBMI} className="space-y-4">
            {unit === "metric" ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="10"
                    max="300"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    min="50"
                    max="250"
                    required
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (lbs)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="600"
                    required
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Height</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="8"
                        required
                        value={heightFt}
                        onChange={(e) => setHeightFt(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      />
                      <span className="text-xs text-gray-500 font-bold">ft</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="11"
                        required
                        value={heightIn}
                        onChange={(e) => setHeightIn(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      />
                      <span className="text-xs text-gray-500 font-bold">in</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition shadow-sm cursor-pointer active:scale-95"
              >
                <Activity className="w-4 h-4" />
                Calculate BMI
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl transition cursor-pointer active:scale-95"
                title="Reset Forms"
              >
                <RotateCcw className="w-4.5 h-4.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Output Results */}
        <div className="flex flex-col justify-center min-h-[300px] bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
          {bmi !== null ? (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Your Calculated BMI</span>
                <span className="text-4xl font-black text-gray-800 font-mono mt-1 block">
                  {bmi.toFixed(1)}
                </span>
                <span className={`inline-block mt-2.5 px-3.5 py-1.5 rounded-full border text-xs font-black uppercase ${color}`}>
                  {category}
                </span>
              </div>

              {/* BMI visual slider indicator */}
              <div className="space-y-2">
                <div className="w-full bg-gradient-to-r from-blue-400 via-emerald-400 to-red-400 rounded-full h-3 relative border border-gray-100">
                  {/* Position pointer based on BMI (15 to 40 scale) */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -mt-0.5 w-4 h-4 rounded-full bg-gray-900 border-2 border-white shadow-md transition-all duration-300"
                    style={{ left: `${Math.min(Math.max(((bmi - 15) / 25) * 100, 0), 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-600 dark:text-gray-400 font-mono font-bold px-1">
                  <span>15 (Underweight)</span>
                  <span>25 (Overweight)</span>
                  <span>40+ (Obese)</span>
                </div>
              </div>

              {/* Health recommendations */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Heart className="w-4 h-4 text-emerald-500" />
                  <span>Targeted Wellness Guidance:</span>
                </div>
                <ul className="text-xs text-gray-600 space-y-1.5 pl-5 list-disc leading-relaxed">
                  {healthTips[category]?.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
              Provide your height and weight parameters to run calculations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
