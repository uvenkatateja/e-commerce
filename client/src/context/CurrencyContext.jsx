import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const CurrencyContext = createContext(null);

// Auto-detect currency from browser locale
const detectCurrency = () => {
    try {
        const locale = navigator.language || navigator.languages?.[0] || "en-US";
        const regionMap = {
            US: "USD", GB: "GBP", IN: "INR", JP: "JPY", AU: "AUD",
            CA: "CAD", CH: "CHF", CN: "CNY", KR: "KRW", BR: "BRL",
            MX: "MXN", ID: "IDR", SG: "SGD", HK: "HKD",
            DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR",
            PT: "EUR", AT: "EUR", BE: "EUR", IE: "EUR", FI: "EUR",
        };
        const parts = locale.split("-");
        const region = parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase();
        return regionMap[region] || "USD";
    } catch {
        return "USD";
    }
};

/**
 * CurrencyProvider — Global currency state.
 *
 * - Fetches live exchange rates from our backend (which proxies frankfurter.app)
 * - Auto-detects the user's likely currency from their browser locale
 * - Persists selected currency in localStorage
 * - Provides formatPrice(usdAmount) for easy formatting anywhere
 * - Auto-refreshes rates every 10 minutes
 */
export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrencyState] = useState(() => {
        return localStorage.getItem("preferred_currency") || detectCurrency();
    });
    const [rates, setRates] = useState({ USD: 1 });
    const [currencyInfo, setCurrencyInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Fetch rates from backend
    const fetchRates = useCallback(async () => {
        try {
            const { data } = await api.get("/currency/rates");
            if (data.success) {
                setRates(data.data.rates);
                setCurrencyInfo(data.data.currencies);
                setLastUpdated(data.data.cachedAt);
            }
        } catch (error) {
            console.error("Failed to fetch exchange rates:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRates();
        // Refresh rates every 10 minutes
        const interval = setInterval(fetchRates, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchRates]);

    // Persist currency selection
    const setCurrency = (code) => {
        setCurrencyState(code);
        localStorage.setItem("preferred_currency", code);
    };

    /**
     * Convert and format a USD amount to the selected currency.
     * @param {number} usdAmount - Price in USD
     * @param {string} [overrideCurrency] - Optional: force a specific currency
     * @returns {string} Formatted price string (e.g., "₹8,350.00")
     */
    const formatPrice = useCallback((usdAmount, overrideCurrency) => {
        const targetCurrency = overrideCurrency || currency;
        const rate = rates[targetCurrency] || 1;
        const converted = usdAmount * rate;
        const info = currencyInfo[targetCurrency];

        if (info) {
            try {
                return new Intl.NumberFormat(info.locale, {
                    style: "currency",
                    currency: targetCurrency,
                    minimumFractionDigits: ["JPY", "KRW", "IDR"].includes(targetCurrency) ? 0 : 2,
                    maximumFractionDigits: ["JPY", "KRW", "IDR"].includes(targetCurrency) ? 0 : 2,
                }).format(converted);
            } catch {
                // Fallback if Intl fails
                return `${info.symbol}${converted.toFixed(2)}`;
            }
        }

        return `$${usdAmount.toFixed(2)}`;
    }, [currency, rates, currencyInfo]);

    /**
     * Get raw converted amount without formatting.
     */
    const convertPrice = useCallback((usdAmount, overrideCurrency) => {
        const targetCurrency = overrideCurrency || currency;
        const rate = rates[targetCurrency] || 1;
        return usdAmount * rate;
    }, [currency, rates]);

    /**
     * Get symbol for current currency.
     */
    const getSymbol = useCallback((overrideCurrency) => {
        const target = overrideCurrency || currency;
        return currencyInfo[target]?.symbol || "$";
    }, [currency, currencyInfo]);

    return (
        <CurrencyContext.Provider
            value={{
                currency,
                setCurrency,
                rates,
                currencyInfo,
                formatPrice,
                convertPrice,
                getSymbol,
                loading,
                lastUpdated,
                refreshRates: fetchRates,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
};

/**
 * Hook to access currency state from any component.
 * Usage: const { formatPrice, currency, setCurrency } = useCurrency();
 */
export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
};
