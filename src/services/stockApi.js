/**
 * Fetches stock data from your local Node.js proxy.
 * Uses Nullish Coalescing (??) to fallback to the last known price 
 * if the live 'price' field is null (market closed).
 */
export async function getStockPrice(symbol) {
  try {
    const ticker = symbol.toUpperCase();
    // Ensure your backend server is running on port 5000
const res = await fetch(`https://stock-backend-ua27.onrender.com/stock/${symbol}`);    
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    
    const data = await res.json();

    // Priority: Live Price -> Today's Close -> Yesterday's Close -> Adjusted Close
    const finalPrice = 
      data.price ?? 
      data.close ?? 
      data.previousClose ?? 
      data.adjusted_close ?? 
      "N/A";

    return finalPrice;
  } catch (err) {
    console.error(`Error fetching ${symbol}:`, err);
    return "N/A";
  }
}