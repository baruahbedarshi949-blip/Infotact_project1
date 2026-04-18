import { useEffect, useState } from "react";
import API from "../api/axios";

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");

  // 🔄 FETCH PRODUCTS
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.items || []);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  // ➕ ADD TO CART (FINAL FIXED)
  const addToCart = (product) => {
    const productId = product._id;

    const exists = cart.find((item) => item.productId === productId);

    if (exists) {
      setCart(
        cart.map((item) =>
          item.productId === productId
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: productId, // ✅ IMPORTANT
          title: product.title,
          price: product.variants?.[0]?.price || 0,
          qty: 1,
        },
      ]);
    }
  };

  // ➕ INCREASE
  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.productId === id
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  };

  // ➖ DECREASE
  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.productId === id
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // ❌ REMOVE
  const removeItem = (id) => {
    setCart(cart.filter((item) => item.productId !== id));
  };

  // 💰 TOTAL
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // 🔍 SEARCH
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  // 🧾 CHECKOUT (FINAL FIXED)
  const checkout = async () => {
    try {
      const formattedItems = cart.map((item) => ({
        productId: item.productId, // ✅ MATCH BACKEND
        quantity: item.qty,
      }));

      console.log("FINAL PAYLOAD:", formattedItems);

      await API.post("/orders", {
        items: formattedItems,
      });

      alert("Order placed successfully ✅");
      setCart([]);
    } catch (err) {
      console.error("CHECKOUT ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Checkout failed ❌");
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="bg-white p-5 rounded-xl shadow mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Point of Sale</h1>
          <p className="text-gray-500 text-sm">
            Fast checkout and store operations
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border rounded w-full mb-6"
      />

      <div className="flex gap-6">
        {/* PRODUCTS */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {filteredProducts.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded-xl shadow">
              <h2 className="font-bold text-lg">{p.title}</h2>

              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                {p.category}
              </span>

              <p className="mt-2 font-bold">
                ₹ {p.variants?.[0]?.price}
              </p>

              <button
                onClick={() => addToCart(p)}
                className="bg-gray-900 text-white w-full mt-3 py-2 rounded-lg"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* CART */}
        <div className="w-80 bg-gray-900 text-white p-4 rounded-xl sticky top-6">
          <h2 className="text-lg mb-4">Cart</h2>

          {cart.length === 0 && (
            <p className="text-gray-400">No items</p>
          )}

          {cart.map((item) => (
            <div key={item.productId} className="mb-3 border-b pb-2">
              <div className="flex justify-between">
                <span>{item.title}</span>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-400"
                >
                  ✕
                </button>
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => decreaseQty(item.productId)}
                    className="bg-gray-700 px-2 rounded"
                  >
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => increaseQty(item.productId)}
                    className="bg-gray-700 px-2 rounded"
                  >
                    +
                  </button>
                </div>

                <span>
                  ₹ {item.price * item.qty}
                </span>
              </div>
            </div>
          ))}

          <hr className="my-3" />

          <h3 className="text-lg">Total: ₹ {total}</h3>

          <button
            onClick={checkout}
            className="bg-green-500 w-full mt-4 py-2 rounded-lg hover:bg-green-600"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
