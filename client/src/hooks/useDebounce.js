import { useState, useEffect } from "react";

/**
 * useDebounce hook — delays updating the value until the user
 * stops typing for the specified delay (default: 300ms).
 *
 * Used on the Products page search input to prevent firing
 * an API call on every keystroke. Instead, the API call only
 * fires after the user pauses for 300ms.
 *
 * Usage:
 *   const [search, setSearch] = useState("");
 *   const debouncedSearch = useDebounce(search, 300);
 *   // Use debouncedSearch in your useEffect for API calls
 */
export const useDebounce = (value, delay = 300) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup: if value changes before delay expires, clear the timer
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
};
