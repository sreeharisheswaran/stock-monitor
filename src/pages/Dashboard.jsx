import { useState, useEffect } from "react";
import { db, auth } from "../services/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { getStockPrice } from "../services/stockApi";

export default function Dashboard() {
  const [stockInput, setStockInput] = useState("");
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  // 🔥 1. Fetch from Firestore AND update with Live/Last Prices
  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      // Get the list of stock symbols saved for this user
      const querySnapshot = await getDocs(collection(db, "users", user.uid, "stocks"));
      const firestoreStocks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch fresh prices for each symbol in the list
      const updatedList = await Promise.all(
        firestoreStocks.map(async (item) => {
          const freshPrice = await getStockPrice(item.name);
          return { ...item, price: freshPrice };
        })
      );

      setStocks(updatedList);
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  // 🔥 2. Add Stock (CREATE)
  const addStock = async () => {
    if (!stockInput || !user) return;
    const ticker = stockInput.toUpperCase();
    
    // Get initial price before saving
    const currentPrice = await getStockPrice(ticker);
    
    const newStockData = {
      name: ticker,
      price: currentPrice, // Saved as a snapshot
      addedAt: new Date()
    };

    const docRef = await addDoc(collection(db, "users", user.uid, "stocks"), newStockData);
    
    setStocks([...stocks, { id: docRef.id, ...newStockData }]);
    setStockInput("");
  };

  // 🔥 3. Delete Stock (DELETE)
  const deleteStock = async (firebaseId) => {
    try {
      await deleteDoc(doc(db, "users", user.uid, "stocks", firebaseId));
      setStocks(stocks.filter(s => s.id !== firebaseId));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Market Monitor</h1>
        <p>User: {user?.email}</p>
      </header>

      <div style={styles.inputSection}>
        <input
          style={styles.input}
          placeholder="Ticker (e.g., RELIANCE.NSE)"
          value={stockInput}
          onChange={(e) => setStockInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addStock()}
        />
        <button onClick={addStock} style={styles.addButton}>Add Asset</button>
      </div>

      {loading ? (
        <p>Syncing with market data...</p>
      ) : (
        <div style={styles.grid}>
          {stocks.map((s) => (
            <div key={s.id} style={styles.card}>
              <div>
                <h3 style={{ margin: 0 }}>{s.name}</h3>
                <p style={styles.price}>
                  ₹{s.price} 
                  <span style={styles.badge}>
                    {typeof s.price === 'number' ? 'Last Price' : 'Offline'}
                  </span>
                </p>
              </div>
              <button 
                onClick={() => deleteStock(s.id)} 
                style={styles.deleteButton}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Simple internal styles for a quick "Clean UI" score
const styles = {
  container: { padding: "40px", backgroundColor: "#121212", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif" },
  header: { borderBottom: "1px solid #333", marginBottom: "30px" },
  inputSection: { marginBottom: "30px", display: "flex", gap: "10px" },
  input: { padding: "12px", borderRadius: "6px", border: "1px solid #444", backgroundColor: "#1e1e1e", color: "white", flex: 1 },
  addButton: { padding: "12px 24px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" },
  card: { padding: "20px", backgroundColor: "#1e1e1e", borderRadius: "10px", border: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center" },
  price: { fontSize: "1.2rem", color: "#4caf50", margin: "5px 0" },
  badge: { fontSize: "0.7rem", color: "#888", marginLeft: "8px", textTransform: "uppercase" },
  deleteButton: { backgroundColor: "transparent", color: "#ff4d4d", border: "1px solid #ff4d4d", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }
};