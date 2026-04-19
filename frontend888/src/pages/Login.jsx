import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import API from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ ADD THIS

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN SUCCESS:", res.data);

      // ✅ SAVE TOKEN + USER
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ FIXED REDIRECT (VERY IMPORTANT)
      navigate("/dashboard"); // 🔥 THIS FIXES EVERYTHING
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login to POS
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded"
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white py-2 rounded hover:bg-gray-800"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Use your registered credentials
        </p>
      </div>
    </div>
  );
};

export default Login;
