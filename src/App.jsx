import { useContext } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { AuthContext } from './contexts/AuthContextValue.js'
import { CartProvider } from './contexts/CartContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import Navbar from './Navbar.jsx'
import { AboutPage, CheckoutPage, HomePage, LoginPage, ProductPage, RegisterPage, ShopPage } from './Storefront.jsx'
import './storefront.css'

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext)
  return user ? children : <Navigate to="/login" replace state={{ from: '/checkout' }} />
}

function AppRoutes() {
  return <><Navbar /><main className="app-main"><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/shop" element={<ShopPage />} />
    <Route path="/product/:id" element={<ProductPage />} />
    <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></main></>
}

export default function App() {
  return <HashRouter><ThemeProvider><AuthProvider><CartProvider><AppRoutes /></CartProvider></AuthProvider></ThemeProvider></BrowserRouter>
}
