import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useStore } from "../store/useStore";
import { formatCurrency } from "../utils/currency";

export default function Dashboard() {
  const { currency } = useStore();

  // Sample data
  const data = [
    { name: "Mon", sales: 400 },
    { name: "Tue", sales: 700 },
    { name: "Wed", sales: 300 },
    { name: "Thu", sales: 900 },
    { name: "Fri", sales: 600 },
  ];

  const totalRevenue = data.reduce((sum, d) => sum + d.sales, 0);
  const totalOrders = 45;

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-bold">📊 Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass p-4 rounded-xl glow">
          <h2 className="text-sm text-gray-400">Total Sales</h2>
          <p className="text-xl font-bold">
            {formatCurrency(totalRevenue, currency)}
          </p>
        </div>

        <div className="glass p-4 rounded-xl glow">
          <h2 className="text-sm text-gray-400">Orders</h2>
          <p className="text-xl font-bold">{totalOrders}</p>
        </div>

        <div className="glass p-4 rounded-xl glow">
          <h2 className="text-sm text-gray-400">Avg Order Value</h2>
          <p className="text-xl font-bold">
            {formatCurrency(totalRevenue / totalOrders, currency)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="glass p-6 rounded-xl glow">
        <h2 className="mb-4 font-semibold text-lg">Weekly Sales</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}