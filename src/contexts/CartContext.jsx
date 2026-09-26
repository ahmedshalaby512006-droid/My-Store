import { useState } from 'react'
import { CartContext } from './CartContextValue.js'

const CART_KEY = 'atelier-cart'

function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]') } catch { return [] }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart)
  const update = (nextItems) => { setItems(nextItems); localStorage.setItem(CART_KEY, JSON.stringify(nextItems)) }
  const addItem = (product, quantity = 1) => {
    const existing = items.find((item) => item.id === product.id)
    update(existing
      ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
      : [...items, { ...product, quantity }])
  }
  const setQuantity = (id, quantity) => update(quantity > 0
    ? items.map((item) => item.id === id ? { ...item, quantity } : item)
    : items.filter((item) => item.id !== id))
  const removeItem = (id) => update(items.filter((item) => item.id !== id))
  const clearCart = () => update([])
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  return <CartContext.Provider value={{ items, itemCount, subtotal, addItem, setQuantity, removeItem, clearCart }}>{children}</CartContext.Provider>
}

