import React, { useState, useEffect } from "react";
import { Calendar, RotateCcw, Award } from "lucide-react";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("1998-05-15");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split("T")[0]);
  const [ageDetails, setAgeDetails] = useState<any>(null);

  const calculateAge = () => {
    if (!birthDate || !targetDate) return;

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (birth > target) {
      setAgeDetails({ error: "Birth date cannot be in the future of the target date." });
      return;
    }

    // Calculations
    const diffTime = target.getTime() - birth.getTime();
    
    // Total days, weeks, hours, etc.
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffTime / (1000 * 60));
    const totalSeconds = Math.floor(diffTime / 1000);

    // Precise Calendar Age (Years, Months, Days)
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      // Get days in previous month of target date
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Born Day of Week
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const bornDay = daysOfWeek[birth.getDay()];

    // Next Birthday countdown
    const nextBdayYear = target.getMonth() > birth.getMonth() || (target.getMonth() === birth.getMonth() && target.getDate() >= birth.getDate())
      ? target.getFullYear() + 1
      : target.getFullYear();
    const nextBday = new Date(nextBdayYear, birth.getMonth(), birth.getDate());
    const daysToBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    setAgeDetails({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      totalSeconds,
      bornDay,
      daysToBday: daysToBday === 365 || daysToBday === 366 ? 0 : daysToBday
    });
  };

  useEffect(() => {
    calculateAge();
  }, [birthDate, targetDate]);

  const handleReset = () => {
    setBirthDate("1998-05-15");
    setTargetDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="age-calculator-card">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 1 Column: Select Dates */}
        <div className="lg:col-span-1 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date of Birth</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Age at the Date of</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono text-gray-800"
              />
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-semibold text-sm transition cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Birthdate
          </button>
        </div>

        {/* Right 2 Columns: Output Results */}
        <div className="lg:col-span-2 flex flex-col justify-center min-h-[300px] bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
          {ageDetails ? (
            ageDetails.error ? (
              <div className="text-center text-red-500 text-sm font-semibold">{ageDetails.error}</div>
            ) : (
              <div className="space-y-6">
                {/* Year Month Day big row */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <span className="text-2xl lg:text-3xl font-black text-blue-600 font-mono">{ageDetails.years}</span>
                    <span className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 mt-1 uppercase">Years</span>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <span className="text-2xl lg:text-3xl font-black text-emerald-500 font-mono">{ageDetails.months}</span>
                    <span className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 mt-1 uppercase">Months</span>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <span className="text-2xl lg:text-3xl font-black text-amber-500 font-mono">{ageDetails.days}</span>
                    <span className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 mt-1 uppercase">Days</span>
                  </div>
                </div>

                {/* Day of birth and countdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50/20 border border-blue-100/30 rounded-xl p-4 text-center">
                    <span className="text-xs font-semibold text-blue-800">Day of Week Born</span>
                    <span className="block font-bold text-sm text-blue-700 mt-1 font-sans">{ageDetails.bornDay}</span>
                  </div>
                  <div className="bg-pink-50/20 border border-pink-100/30 rounded-xl p-4 text-center">
                    <span className="text-xs font-semibold text-pink-800">Days to Next Birthday</span>
                    <span className="block font-bold text-sm text-pink-700 mt-1 font-mono">
                      {ageDetails.daysToBday === 0 ? "Happy Birthday! 🎉" : `${ageDetails.daysToBday} days`}
                    </span>
                  </div>
                </div>

                {/* Detailed metrics breakdown */}
                <div className="border-t border-gray-100 pt-4">
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-3">
                    Alternative Time Conversions
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
                    <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                      <span className="block text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase mb-0.5">Weeks</span>
                      <span className="text-xs font-black text-gray-700">{ageDetails.totalWeeks.toLocaleString()}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                      <span className="block text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase mb-0.5">Total Days</span>
                      <span className="text-xs font-black text-gray-700">{ageDetails.totalDays.toLocaleString()}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                      <span className="block text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase mb-0.5">Hours</span>
                      <span className="text-xs font-black text-gray-700">{ageDetails.totalHours.toLocaleString()}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                      <span className="block text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase mb-0.5">Minutes</span>
                      <span className="text-xs font-black text-gray-700">{ageDetails.totalMinutes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              Provide a birth date to run calculation analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
