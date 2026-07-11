import React, { useState, useEffect } from "react";
import { ArrowLeftRight, Coins, RotateCcw } from "lucide-react";

interface Rates {
  [key: string]: number;
}

const FALLBACK_RATES: Rates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 161.2,
  CAD: 1.36,
  AUD: 1.49,
  INR: 83.45,
  CNY: 7.27,
  CHF: 0.89,
  NZD: 1.63,
  SGD: 1.35
};

const CURRENCY_NAMES: Record<string, string> = {
  USD: "US Dollar ($)",
  EUR: "Euro (€)",
  GBP: "British Pound (£)",
  JPY: "Japanese Yen (¥)",
  CAD: "Canadian Dollar (C$)",
  AUD: "Australian Dollar (A$)",
  INR: "Indian Rupee (₹)",
  CNY: "Chinese Yuan (¥)",
  CHF: "Swiss Franc (CHF)",
  NZD: "New Zealand Dollar (NZ$)",
  SGD: "Singapore Dollar (S$)"
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [rates, setRates] = useState<Rates>(FALLBACK_RATES);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch exchange rates from free open API on load
  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch live rates.");
        return res.json();
      })
      .then((data) => {
        if (data && data.rates) {
          setRates(data.rates);
          setIsLive(true);
        }
      })
      .catch((err) => {
        console.warn("Failed to load live exchange rates. Using secure offline fallback rates.", err);
        setRates(FALLBACK_RATES);
        setIsLive(false);
      });
  }, []);

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const getConvertedAmount = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return "0.00";

    const rateFrom = rates[fromCurrency];
    const rateTo = rates[toCurrency];

    if (!rateFrom || !rateTo) return "0.00";

    // Convert To USD first, then to destination currency
    const amountInUSD = amt / rateFrom;
    const finalAmount = amountInUSD * rateTo;

    return finalAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  };

  const exchangeRateInfo = () => {
    const rateFrom = rates[fromCurrency] || 1;
    const rateTo = rates[toCurrency] || 1;
    const oneUnitRate = (1 / rateFrom) * rateTo;
    return `1 ${fromCurrency} = ${oneUnitRate.toFixed(4)} ${toCurrency}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="currency-converter-card">
      <div className="space-y-6">
        
        {/* Live indicator tag */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Coins className="w-5 h-5 text-blue-500" />
            <span>Global Currency Exchange</span>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            isLive ? "bg-emerald-50 border border-emerald-100 text-emerald-700 animate-pulse" : "bg-amber-50 border border-amber-100 text-amber-700"
          }`}>
            {isLive ? "● Rates Live Feed" : "Offline Fallback Rates"}
          </span>
        </div>

        {/* Inputs Layout */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
          {/* Amount input */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase">Amount</label>
            <input
              type="number"
              min="0.01"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono font-bold text-gray-800"
            />
          </div>

          {/* From Currency Select */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase">From Currency</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white font-medium text-gray-700"
            >
              {Object.keys(CURRENCY_NAMES).map((code) => (
                <option key={code} value={code}>
                  {code} - {CURRENCY_NAMES[code]}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pb-1">
            <button
              onClick={handleSwap}
              type="button"
              className="p-3 bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:border-gray-200 rounded-xl transition cursor-pointer active:scale-95"
              title="Swap Currencies"
            >
              <ArrowLeftRight className="w-4.5 h-4.5 text-gray-600" />
            </button>
          </div>

          {/* To Currency Select */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase">To Currency</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white font-medium text-gray-700"
            >
              {Object.keys(CURRENCY_NAMES).map((code) => (
                <option key={code} value={code}>
                  {code} - {CURRENCY_NAMES[code]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Output block */}
        <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 space-y-2">
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Converted Total</span>
          <span className="text-3xl font-black text-gray-800 font-mono block">
            {getConvertedAmount()} <span className="text-xl font-bold text-blue-600 font-sans">{toCurrency}</span>
          </span>
          <span className="inline-block px-3 py-1 bg-white border border-gray-100 rounded-xl text-xs font-semibold text-gray-500 font-mono">
            {exchangeRateInfo()}
          </span>
        </div>

      </div>
    </div>
  );
}
