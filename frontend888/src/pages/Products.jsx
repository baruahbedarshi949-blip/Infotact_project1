import { useEffect, useState } from "react";
import API from "../api/axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  // 🔐 TEMP TOKEN (remove later when login page is added)
  useEffect(() => {
    localStorage.setItem(
      "token",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWUzOGY4MzYwNjI5ZmFjNjUyNjgyYzMiLCJyb2xlIjoic3lzdGVtX2FkbWluIiwic3RvcmVJZCI6bnVsbCwiaWF0IjoxNzc2NTIxODgxLCJleHAiOjE3NzcxMjY2ODF9.Z84RuN9DV_q39StPAfqJzp1pf4-fOhU0m_scRsKyjBQ"
    );

    fetchProducts();
  }, []);

  // 🔄 FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.items || []);
    } catch (err) {
      console.error("FETCH ERROR:", err.response?.data || err.message);
    }
  };

  // ✏️ UPDATE PRODUCT
  const updateProduct = async () => {
    try {
      const payload = {
        title: editing.title,
        category: editing.category,
        description: editing.description || "",
        variants: [
          {
            _id: editing.variants[0]._id,
            sku: editing.variants[0].sku,
            price: Number(editing.variants[0].price),
            isActive: true,
          },
        ],
      };

      await API.put(`/products/${editing._id}`, payload);

      alert("Product updated ✅");
      setEditing(null);
      fetchProducts();
    } catch (err) {
      console.error("UPDATE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Update failed ❌");
    }
  };

  // 🗑️ ARCHIVE PRODUCT (FINAL FIXED)
  const archiveProduct = async (id) => {
    try {
      await API.put(`/products/${id}`, {
        isActive: false,
      });

      alert("Product archived ✅");
      fetchProducts();
    } catch (err) {
      console.error("ARCHIVE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Archive failed ❌");
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="bg-white p-5 rounded-xl shadow mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-500 text-sm">
            Manage catalog, variants, filters
          </p>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold text-lg">{p.title}</h2>

            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
              {p.category}
            </span>

            <p className="text-gray-500 mt-2">
              {p.description || "No description"}
            </p>

            <div className="mt-3 p-2 bg-gray-100 rounded">
              <p>SKU: {p.variants?.[0]?.sku}</p>
              <p className="font-bold">₹ {p.variants?.[0]?.price}</p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setEditing(p)}
                className="bg-gray-900 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => archiveProduct(p._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Archive
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>

            <input
              type="text"
              value={editing.title}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
              className="border p-2 w-full mb-3"
              placeholder="Title"
            />

            <input
              type="text"
              value={editing.category}
              onChange={(e) =>
                setEditing({ ...editing, category: e.target.value })
              }
              className="border p-2 w-full mb-3"
              placeholder="Category"
            />

            <input
              type="number"
              value={editing.variants[0].price}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  variants: [
                    {
                      ...editing.variants[0],
                      price: Number(e.target.value),
                    },
                  ],
                })
              }
              className="border p-2 w-full mb-3"
              placeholder="Price"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={updateProduct}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;