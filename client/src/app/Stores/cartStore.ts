import { cartStoreStateActionType, cartStoreStateType } from '@/type';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCartStore = create<cartStoreStateType & cartStoreStateActionType>()(
  persist(
    (set) => ({
      cart: [],
      hasHydrated: false,

      // ✅ Add to Cart (simplified for DummyJSON)
      addToCart: (product) =>
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (p) => p.id === product.id // no color/size check
          );

          if (existingIndex !== -1) {
            const updatedCart = [...state.cart];
            updatedCart[existingIndex].quantity += product.quantity || 1;
            return { cart: updatedCart };
          }

          return {
            cart: [
              ...state.cart,
              {
                ...product,
                quantity: product.quantity || 1,
              },
            ],
          };
        }),

      // ✅ Remove product
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((p) => p.id !== id),
        })),

      // ✅ Update quantity directly
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((p) =>
            p.id === id ? { ...p, quantity } : p
          ),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'cart',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);

export default useCartStore;
