
import { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, Moon, ShoppingBag, Sun, X } from 'lucide-react'
import { AuthContext } from './contexts/AuthContextValue.js'
import { CartContext } from './contexts/CartContextValue.js'
import { ThemeContext } from './contexts/ThemeContextValue.js'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const { itemCount } = useContext(CartContext)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const signOut = () => { logout(); navigate('/'); setMenuOpen(false) }

  return <header className="site-header"><div className="header-inner">
    <Link className="wordmark" to="/" aria-label="My Store home">My Store</Link>
    <button className="icon-button menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
    <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
      <NavLink to="/shop" onClick={() => setMenuOpen(false)}>Shop</NavLink>
      <NavLink to="/about" onClick={() => setMenuOpen(false)}>Our story</NavLink>
      <div className="nav-actions">
        <button className="icon-button" type="button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} onClick={toggleTheme}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
        {user ? <button className="nav-text-button" type="button" onClick={signOut}>Sign out</button> : <Link className="nav-text-button" to="/login" onClick={() => setMenuOpen(false)}>Sign in</Link>}
        <Link className="bag-link" to={user ? '/checkout' : '/login'} aria-label={`Shopping bag, ${itemCount} items`}><ShoppingBag size={18} /><span className="bag-count">{itemCount}</span></Link>
        <Link className="header-cta" to="/shop">Explore <span aria-hidden="true">↗</span></Link>
      </div>
    </nav>
  </div></header>
}