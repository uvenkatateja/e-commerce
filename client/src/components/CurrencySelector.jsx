import { useCurrency } from "../context/CurrencyContext";
import { Globe, RefreshCw } from "lucide-react";

/**
 * CurrencySelector — Dropdown to switch display currency.
 * Used in the Navbar and Admin panel.
 *
 * Features:
 * - Grouped into regions for easy browsing
 * - Shows currency symbol + code + name
 * - Live rate indicator with last-updated time
 * - Manual refresh button
 */
const CurrencySelector = ({ compact = false, className = "", dark = false }) => {
    const { currency, setCurrency, currencyInfo, rates, lastUpdated, refreshRates, loading } = useCurrency();
    
    // Choose colors based on the 'dark' prop
    const textColor = dark ? 'text-white' : 'text-gray-900';
    const borderColor = dark ? 'border-white/20 hover:border-white/40' : 'border-gray-200 hover:border-gray-300';
    const iconColor = dark ? 'text-white/70' : 'text-gray-400';

    const currencyGroups = [
        {
            label: "Americas",
            currencies: ["USD", "CAD", "BRL", "MXN"],
        },
        {
            label: "Europe",
            currencies: ["EUR", "GBP", "CHF"],
        },
        {
            label: "Asia-Pacific",
            currencies: ["INR", "JPY", "CNY", "KRW", "IDR", "SGD", "HKD", "AUD"],
        },
    ];

    const currentInfo = currencyInfo[currency];

    if (compact) {
        return (
            <div className={`relative ${className}`}>
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className={`appearance-none bg-transparent border ${borderColor} rounded-lg pl-7 pr-7 py-1 text-[11px] font-bold cursor-pointer transition-colors focus:outline-none ${textColor}`}
                >
                    {currencyGroups.map((group) => (
                        <optgroup key={group.label} label={group.label} className="text-gray-900 bg-white">
                            {group.currencies.map((code) => {
                                const info = currencyInfo[code];
                                if (!info) return null;
                                return (
                                    <option key={code} value={code} className="text-gray-900 bg-white">
                                        {info.symbol} {code}
                                    </option>
                                );
                            })}
                        </optgroup>
                    ))}
                </select>
                <Globe className={`absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${iconColor} pointer-events-none`} />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className={`h-3 w-3 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-zinc-950 border rounded-2xl p-4 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Currency
                    </span>
                </div>
                <button
                    onClick={refreshRates}
                    disabled={loading}
                    className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                    title="Refresh rates"
                >
                    <RefreshCw className={`h-3.5 w-3.5 text-gray-400 ${loading ? "animate-spin" : ""}`} />
                </button>
            </div>

            {/* Current Selection */}
            <div className="flex items-center gap-2 mb-3 p-2.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl">
                <span className="text-lg font-bold text-blue-600">{currentInfo?.symbol}</span>
                <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{currency}</p>
                    <p className="text-[10px] text-gray-500">{currentInfo?.name}</p>
                </div>
                {rates[currency] && currency !== "USD" && (
                    <span className="ml-auto text-[10px] font-mono text-gray-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md">
                        1 USD = {rates[currency].toLocaleString(undefined, { maximumFractionDigits: 2 })} {currency}
                    </span>
                )}
            </div>

            {/* Grouped Currency Options */}
            <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-none">
                {currencyGroups.map((group) => (
                    <div key={group.label}>
                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 px-1 mb-1">
                            {group.label}
                        </p>
                        <div className="grid grid-cols-2 gap-1">
                            {group.currencies.map((code) => {
                                const info = currencyInfo[code];
                                if (!info) return null;
                                const isActive = code === currency;
                                return (
                                    <button
                                        key={code}
                                        onClick={() => setCurrency(code)}
                                        className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs font-semibold transition-all ${
                                            isActive
                                                ? "bg-gray-900 text-white shadow-sm"
                                                : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800"
                                        }`}
                                    >
                                        <span className={`text-sm ${isActive ? "text-white" : "text-gray-400"}`}>
                                            {info.symbol}
                                        </span>
                                        <span>{code}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Last Updated */}
            {lastUpdated && (
                <p className="text-[9px] text-gray-400 mt-3 text-center">
                    Rates updated: {new Date(lastUpdated).toLocaleTimeString()}
                </p>
            )}
        </div>
    );
};

export default CurrencySelector;
