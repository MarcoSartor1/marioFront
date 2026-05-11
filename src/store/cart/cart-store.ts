import type { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];

  getTotalItems: () => number;
  getSummaryInformation: () => {
    subTotal: number;
    tax: number;
    total: number;
    itemsInCart: number;
  };

  addProductTocart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProduct: (product: CartProduct) => void;
  removeProductById: (productId: string) => void;

  clearCart: () => void;
  updateCartPrices: (priceMap: Record<string, number>) => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      // Methods
      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },

      getSummaryInformation: () => {
        const { cart } = get();

        const subTotal = cart.reduce(
          (subTotal, product) => product.quantity * product.price + subTotal,
          0
        );
        const tax = 0;
        const total = subTotal;
        const itemsInCart = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );

        return {
          subTotal,
          tax,
          total,
          itemsInCart,
        };
      },

      addProductTocart: (product: CartProduct) => {
        const { cart } = get();

        const isSameVariant = (item: CartProduct) =>
          item.id === product.id &&
          item.size === product.size &&
          item.color === product.color;

        if (!cart.some(isSameVariant)) {
          set({ cart: [...cart, product] });
          return;
        }

        set({
          cart: cart.map((item) =>
            isSameVariant(item)
              ? { ...item, quantity: item.quantity + product.quantity }
              : item
          ),
        });
      },

      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();

        set({
          cart: cart.map((item) =>
            item.id === product.id &&
            item.size === product.size &&
            item.color === product.color
              ? { ...item, quantity }
              : item
          ),
        });
      },

      removeProduct: (product: CartProduct) => {
        const { cart } = get();
        set({
          cart: cart.filter(
            (item) =>
              item.id !== product.id ||
              item.size !== product.size ||
              item.color !== product.color
          ),
        });
      },

      removeProductById: (productId: string) => {
        const { cart } = get();
        set({ cart: cart.filter((item) => item.id !== productId) });
      },

      clearCart: () => {
        set({ cart: [] });
      },

      updateCartPrices: (priceMap: Record<string, number>) => {
        const { cart } = get();
        set({ cart: cart.map(item => ({ ...item, price: priceMap[item.id] ?? item.price })) });
      },
    }),

    {
      name: "shopping-cart",
    }
  )
);
