export function CurrencyFlag({ currency }) {
  const flags = {
    USD: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        {/* ... USD SVG paths ... */}
      </svg>
    ),
    EUR: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        {/* ... EUR SVG paths ... */}
      </svg>
    ),
    GBP: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        {/* ... GBP SVG paths ... */}
      </svg>
    ),
    CHF: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        {/* ... CHF SVG paths ... */}
      </svg>
    ),
  };

  return flags[currency] || null; // Return null if currency is not found
}

// Usage example
// <CurrencyFlag currency="USD" />
// <CurrencyFlag currency="EUR" />
// <CurrencyFlag currency="GBP" />
// <CurrencyFlag currency="CHF" />
