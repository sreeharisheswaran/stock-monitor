import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) return <p>Loading...</p>;

  return children;
}