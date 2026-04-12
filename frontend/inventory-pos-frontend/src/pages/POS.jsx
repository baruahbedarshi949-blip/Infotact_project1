import { useStore } from "../store/useStore";
import { formatCurrency } from "../utils/currency";

export default function POS() {
  const { cart, addToCart, removeFromCart, currency } = useStore();

  const products = [
    { id: 1, name: "Laptop", price: 50000 },
    { id: 2, name: "Phone", price: 20000 },
    { id: 3, name: "Smart TV", price: 35000 },
    { id: 4, name: "Headphones", price: 3000 },
    { id: 5, name: "Keyboard", price: 1500 },
    { id: 6, name: "Mouse", price: 800 },
  ];

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="grid grid-cols-2 gap-6">
      
      {/* Products */}
      <div>
        <h1 className="text-xl mb-4">🛒 Products</h1>

        <div className="grid grid-cols-2 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="glass p-4 rounded-xl glow hover:scale-105 transition"
            >
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-indigo-400">
                {formatCurrency(p.price, currency)}
              </p>

              <button
                className="mt-2 bg-indigo-500 px-3 py-1 rounded w-full"
                onClick={() => addToCart(p)}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div>
        <h1 className="text-xl mb-4">🧾 Cart</h1>

        <div className="glass p-4 rounded-xl glow">
          {cart.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center mb-2"
            >
              <span>{item.name}</span>

              <button
                onClick={() => removeFromCart(i)}
                className="bg-red-500 px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}

          <h2 className="mt-4 font-bold text-lg text-indigo-400">
            Total: {formatCurrency(total, currency)}
          </h2>
        </div>
      </div>
    </div>
  );
}