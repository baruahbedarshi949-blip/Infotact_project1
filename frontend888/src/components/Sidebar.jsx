import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBox, FaShoppingCart, FaChartBar } from "react-icons/fa";

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const linkClass = (path) =>
    `flex items-center gap-3 p-3 rounded-lg ${
      pathname === path ? "bg-gray-700" : "hover:bg-gray-800"
    }`;

  // ✅ LOGOUT FUNCTION (FINAL FIX)
  const handleLogout = () => {
    console.log("LOGOUT CLICKED"); // debug

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 🔥 force redirect (most reliable)
    window.location.href = "/login";
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 flex flex-col">
      <h1 className="text-xl font-bold mb-8">Retail POS</h1>

      <nav className="flex flex-col gap-2">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          <FaChartBar /> Dashboard
        </Link>

        <Link to="/pos" className={linkClass("/pos")}>
          <FaShoppingCart /> POS
        </Link>

        <Link to="/products" className={linkClass("/products")}>
          <FaBox /> Products
        </Link>

        <Link to="/orders" className={linkClass("/orders")}>
          📄 Orders
        </Link>
      </nav>

      {/* ✅ WORKING LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        className="mt-auto bg-red-500 hover:bg-red-600 py-2 rounded-lg transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;