import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const data = [
  { name: "15/4", value: 10000 },
  { name: "16/4", value: 15000 },
  { name: "17/4", value: 20000 },
  { name: "18/4", value: 27500 },
];

const Dashboard = () => {
  return (
    <div>
      {/* HEADER */}
      <div className="bg-white p-5 rounded-xl shadow flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Sales summary, charts, and inventory visibility
          </p>
        </div>

        {/* USER */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white rounded-full">
            A
          </div>
          <div>
            <p className="font-semibold">Admin User</p>
            <p className="text-gray-400 text-sm">system_admin</p>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h2 className="text-2xl font-bold mt-1">₹ 27500</h2>
          <p className="text-gray-400 text-xs">All completed orders</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h2 className="text-2xl font-bold mt-1">4</h2>
          <p className="text-gray-400 text-xs">Processed transactions</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Today Revenue</p>
          <h2 className="text-2xl font-bold mt-1">₹ 27500</h2>
          <p className="text-gray-400 text-xs">Today's completed sales</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Low Stock Count</p>
          <h2 className="text-2xl font-bold mt-1">0</h2>
          <p className="text-gray-400 text-xs">Items at reorder threshold</p>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="grid grid-cols-2 gap-4">
        {/* LINE CHART */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Daily Sales Trend</h2>
          <p className="text-gray-400 text-sm mb-4">
            Revenue over time
          </p>

          <LineChart width={450} height={250} data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </div>

        {/* BAR CHART */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Top Products</h2>
          <p className="text-gray-400 text-sm mb-4">
            Best-selling items by quantity
          </p>

          <BarChart width={450} height={250} data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#111827" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;