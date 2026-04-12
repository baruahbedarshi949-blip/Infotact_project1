import { create } from "zustand";

export const useStore = create((set) => ({
  cart: [],
  currency: "INR",
  user: null,

  // ================= CART =================
  addToCart: (item) =>
    set((state) => ({
      cart: [...state.cart, item],
    })),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((_, i) => i !== id),
    })),

  // ================= CURRENCY =================
  toggleCurrency: () =>
    set((state) => ({
      currency: state.currency === "INR" ? "USD" : "INR",
    })),

  // ================= AUTH =================
  setUser: (user) =>
    set(() => ({
      user,
    })),

  logout: () =>
    set(() => ({
      user: null,
    })),
}));