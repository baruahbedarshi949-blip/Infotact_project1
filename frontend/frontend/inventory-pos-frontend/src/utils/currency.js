const RATE = 83; // 1 USD = 83 INR (approx)

export const formatCurrency = (amount, currency) => {
  if (currency === "USD") {
    return `$${(amount / RATE).toFixed(2)}`;
  }
  return `₹${amount}`;
};