import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { currency, toggleCurrency, logout } = useStore();
  const navigate = useNavigate();

  return (
    <div className="glass p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">🌌 Inventory System</h1>

      <div className="flex gap-3">
        <button
          onClick={toggleCurrency}
          className="bg-indigo-500 px-3 py-1 rounded"
        >
          {currency}
        </button>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}