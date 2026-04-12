import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-60 bg-slate-800 p-4">
      <h2 className="text-xl font-bold mb-6">POS System</h2>

      <div className="flex flex-col gap-4">
        <Link to="/">Dashboard</Link>
        <Link to="/pos">POS</Link>
        <Link to="/inventory">Inventory</Link>
      </div>
    </div>
  );
}