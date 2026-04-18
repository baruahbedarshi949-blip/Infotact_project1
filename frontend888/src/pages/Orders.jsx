
import { useEffect, useState } from "react";
import API from "../api/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data.items || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ REFUND FUNCTION
  const handleRefund = async (id) => {
    try {
      console.log("🔁 REFUND CLICK:", id);

      await API.post(`/orders/${id}/refund`);

      alert("Refund successful ✅");

      fetchOrders(); // refresh UI
    } catch (err) {
      console.error("❌ REFUND ERROR:", err.response?.data || err.message);
      alert("Refund failed ❌");
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-bold">Orders</h2>
        <p className="text-gray-500">
          Track sales, refunds, and activity
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-4">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            No orders found
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Order</th>
                <th>Status</th>
                <th>Total</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-3">{order.orderNumber}</td>

                  <td>
                    <span
                      className={
                        order.status === "completed"
                          ? "bg-green-100 text-green-600 px-2 py-1 rounded"
                          : "bg-red-100 text-red-600 px-2 py-1 rounded"
                      }
                    >
                      {order.status}
                    </span>
                  </td>

                  <td>₹ {order.grandTotal}</td>

                  <td>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>

                  <td>
                    {order.status === "completed" ? (
                      <button
                        onClick={() => handleRefund(order._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Refund
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
