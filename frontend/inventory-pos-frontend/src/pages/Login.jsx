import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useStore } from "../store/useStore";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data); // 🔥 debug

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      // ✅ Save user
      setUser({ email });

      // ✅ Redirect
      navigate("/");
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);

      alert(
        err.response?.data?.msg ||
        "Login not approved. Check email/password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="glass p-8 rounded-xl w-80 glow">
        <h1 className="text-xl mb-4 text-center">🔐 Login</h1>

        {/* Email */}
        <input
          className="w-full p-2 mb-3 text-black rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          className="w-full p-2 mb-3 text-black rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-500 p-2 rounded disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}