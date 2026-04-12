export default function Inventory() {
  const items = [
    { name: "Laptop", stock: 10 },
    { name: "Phone", stock: 20 },
    { name: "TV", stock: 5 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📦 Inventory</h1>

      <div className="glass p-6 rounded-xl glow">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex justify-between py-3 border-b border-gray-700"
          >
            <span className="font-medium">{item.name}</span>
            <span className="text-indigo-400">{item.stock}</span>
          </div>
        ))}
      </div>
    </div>
  );
}