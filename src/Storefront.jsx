import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Headphones, Heart, Minus, Plus, Search, ShieldCheck, ShoppingBag, Star, Truck, X } from 'lucide-react'
import { AuthContext } from './contexts/AuthContextValue.js'
import { CartContext } from './contexts/CartContextValue.js'

const API = 'https://fakestoreapi.com/products'
const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

function useProducts(url = API) {
  const [attempt, setAttempt] = useState(0)
  const requestKey = `${url}:${attempt}`
  const [state, setState] = useState(() => ({ key: requestKey, products: [], loading: true, error: '' }))
  useEffect(() => {
    const controller = new AbortController()
    fetch(url, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('We could not reach the catalog. Please try again.'); return response.json() })
      .then((products) => setState({ key: requestKey, products, loading: false, error: '' }))
      .catch((error) => { if (error.name !== 'AbortError') setState({ key: requestKey, products: [], loading: false, error: error.message || 'Something went wrong.' }) })
    return () => controller.abort()
  }, [url, attempt, requestKey])
  const retry = () => setAttempt((value) => value + 1)
  return state.key === requestKey ? { ...state, retry } : { products: [], loading: true, error: '', retry }
}

function ProductCard({ product, index = 0 }) {
  const { addItem } = useContext(CartContext)
  const [added, setAdded] = useState(false)
  const add = () => { addItem(product); setAdded(true); window.setTimeout(() => setAdded(false), 1200) }
  return <article className="product-card" style={{ '--reveal-delay': `${index * 55}ms` }}>
    <Link className="product-image-wrap" to={`/product/${product.id}`}><img src={product.image} alt={product.title} loading="lazy" /><span className="product-tag">{product.category}</span></Link>
    <div className="product-info"><div><span className="product-category">{product.category}</span><h3><Link to={`/product/${product.id}`}>{product.title}</Link></h3></div><div className="product-buy-row"><strong>{money(product.price)}</strong><button className="round-add" type="button" onClick={add} aria-label={`Add ${product.title} to bag`}>{added ? <Check size={16} /> : <Plus size={16} />}</button></div></div>
  </article>
}

function ProductGrid({ products }) { return <div className="product-grid">{products.map((item, index) => <ProductCard key={item.id} product={item} index={index} />)}</div> }

function LoadState({ error, retry }) {
  return error ? <div className="load-state"><p>{error}</p><button className="button button-dark" type="button" onClick={retry}>Try again</button></div> : <div className="load-state" role="status"><span className="loader" /><p>Loading products...</p></div>
}

export function HomePage() {
  const { products, loading, error, retry } = useProducts()
  const categories = [
    ['Jewellery', 'jewelery', 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85'],
    ['Everyday style', "women's clothing", 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85'],
    ['Daily essentials', "men's clothing", 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85'],
  ]
  return <>
    <section className="hero-home"><div className="hero-copy"><span className="eyebrow"><i className="eyebrow-dot" /> WELCOME TO MY STORE</span><h1>Shop<br /><em>your way.</em></h1><p>Everyday products, all in one place.</p><Link to="/shop" className="button button-dark">Shop now <ArrowRight size={17} /></Link></div><div className="hero-art"><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=90" alt="Clothing and accessories" /><div className="hero-stamp">SHOP<br />MY STORE<ArrowRight size={16} /></div><div className="hero-caption">NEW PRODUCTS <span>—</span> SHOP NOW</div></div></section>
    <section className="category-section section-pad"><div className="section-heading"><div><span className="eyebrow">CATEGORIES</span><h2>Shop by category.</h2></div><Link to="/shop" className="text-link">All products <ArrowRight size={15} /></Link></div><div className="category-grid">{categories.map(([name, category, image], index) => <Link className="category-tile" to={`/shop?category=${encodeURIComponent(category)}`} key={name}><img src={image} alt="" loading="lazy" /><span className="category-index">0{index + 1}</span><span className="category-name">{name}<ArrowUpRight size={17} /></span></Link>)}</div></section>
    <section className="featured-section section-pad"><div className="section-heading"><div><span className="eyebrow">POPULAR PRODUCTS</span><h2>Shop products.</h2></div><Link to="/shop" className="text-link">View all <ArrowRight size={15} /></Link></div>{loading || error ? <LoadState error={error} retry={retry} /> : <ProductGrid products={products.slice(0, 4)} />}</section>
    <section className="promise-strip"><div className="promise-intro"><span className="eyebrow">MY STORE</span><h2>Easy shopping.<br /><em>Every day.</em></h2></div><div className="promise-item"><Truck size={22} /><h3>Fast shipping</h3><p>Quick delivery to your door.</p></div><div className="promise-item"><ShieldCheck size={22} /><h3>Safe shopping</h3><p>Secure checkout on every order.</p></div><div className="promise-item"><Headphones size={22} /><h3>We're here to help</h3><p>Support when you need it.</p></div></section><Footer />
  </>
}

export function ShopPage() {
  const { products, loading, error, retry } = useProducts()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(params.get('category') || 'all')
  const categories = useMemo(() => [...new Set(products.map((product) => product.category))], [products])
  const shown = products.filter((product) => (category === 'all' || product.category === category) && product.title.toLowerCase().includes(query.toLowerCase()))
  const updateCategory = (value) => { setCategory(value); setParams(value === 'all' ? {} : { category: value }) }
  return <><section className="shop-intro"><span className="eyebrow">MY STORE</span><h1>All<br /><em>products.</em></h1><p>Find what you need.</p></section><section className="shop-content section-pad"><div className="shop-toolbar"><div className="shop-count">{loading ? 'Loading products' : `${shown.length} products`}</div><div className="shop-controls"><label className="search-field"><Search size={16} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" />{query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')}><X size={15} /></button>}</label><label className="select-wrap"><span className="sr-only">Filter by category</span><select value={category} onChange={(event) => updateCategory(event.target.value)}><option value="all">All products</option>{categories.map((value) => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select><ChevronDown size={15} /></label></div></div>{loading || error ? <LoadState error={error} retry={retry} /> : shown.length ? <ProductGrid products={shown} /> : <div className="empty-state"><h2>No products found.</h2><p>Try another search.</p><button className="text-link" type="button" onClick={() => { setQuery(''); updateCategory('all') }}>Clear filters <ArrowRight size={15} /></button></div>}</section><Footer /></>
}

export function ProductPage() {
  const { id } = useParams()
  const { products: product, loading, error, retry } = useProducts(`${API}/${id}`)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useContext(CartContext)
  if (loading || error) return <><LoadState error={error} retry={retry} /><Footer /></>
  if (!product?.id) return <><div className="empty-state"><h2>We couldn't find that piece.</h2><Link className="text-link" to="/shop">Back to the shop <ArrowLeft size={15} /></Link></div><Footer /></>
  const add = () => { addItem(product, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1400) }
  return <><div className="product-detail section-pad"><Link className="back-link" to="/shop"><ArrowLeft size={15} /> Back to shop</Link><div className="detail-layout"><div className="detail-image"><img src={product.image} alt={product.title} /></div><div className="detail-copy"><span className="eyebrow">{product.category}</span><h1>{product.title}</h1><div className="detail-rating"><span className="stars"><Star size={14} fill="currentColor" /> {product.rating?.rate}</span><span>{product.rating?.count} considered reviews</span></div><p className="detail-price">{money(product.price)}</p><p className="detail-description">{product.description}</p><div className="detail-stock"><span className="stock-dot" /> In stock and ready to ship</div><div className="purchase-row"><div className="quantity-control"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={15} /></button><span>{quantity}</span><button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity"><Plus size={15} /></button></div><button type="button" className="button button-dark add-to-bag" onClick={add}>{added ? <><Check size={17} /> Added to your bag</> : <><ShoppingBag size={17} /> Add to bag</>}</button><button type="button" className="icon-button wishlist-button" aria-label="Save to wishlist"><Heart size={19} /></button></div><div className="detail-note"><Truck size={16} /> Complimentary shipping over $75 <span>·</span> Easy 30-day returns</div><div className="detail-note"><ShieldCheck size={16} /> Secure checkout, always</div></div></div></div><Footer /></>
}

const validateRegistration = ({ name, email, password, confirm }) => ({
  name: name.trim().length < 2 ? 'Please enter your full name.' : '',
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email address.',
  password: password.length < 8 ? 'Use at least 8 characters.' : /[A-Z]/.test(password) && /[0-9]/.test(password) ? '' : 'Add a capital letter and a number.',
  confirm: confirm && confirm === password ? '' : 'Your passwords do not match.',
})

function FormField({ label, name, value, onChange, onBlur, error, type = 'text', ...props }) {
  return <label className={`form-field ${error ? 'has-error' : ''}`}><span>{label}</span><input name={name} type={type} value={value} onChange={onChange} onBlur={onBlur} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} {...props} />{error && <small id={`${name}-error`}>{error}</small>}</label>
}

function AuthLayout({ mode, children }) {
  return <section className="auth-page"><div className="auth-art"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85" alt="A light-filled store" /><Link className="auth-art-mark" to="/">My Store</Link><p>Shop your way.</p></div><div className="auth-panel"><div className="auth-topline"><Link to="/shop"><ArrowLeft size={15} /> Shop</Link><span>{mode === 'login' ? 'NEW HERE?' : 'HAVE AN ACCOUNT?'} <Link to={mode === 'login' ? '/register' : '/login'}>{mode === 'login' ? 'Sign up' : 'Sign in'}</Link></span></div>{children}</div></section>
}

export function RegisterPage() {
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [formError, setFormError] = useState('')
  const change = (event) => { const next = { ...values, [event.target.name]: event.target.value }; setValues(next); if (touched[event.target.name]) setErrors(validateRegistration(next)) }
  const blur = (name) => { const nextTouched = { ...touched, [name]: true }; setTouched(nextTouched); setErrors(validateRegistration(values)) }
  const submit = (event) => { event.preventDefault(); const next = validateRegistration(values); setTouched({ name: true, email: true, password: true, confirm: true }); setErrors(next); if (Object.values(next).some(Boolean)) return; const result = register(values); if (result.error) setFormError(result.error); else navigate('/') }
  return <AuthLayout mode="register"><span className="eyebrow">MY STORE</span><h1>Create<br /><em>account.</em></h1><p className="auth-subtitle">Enter your details to sign up.</p><form className="auth-form" onSubmit={submit} noValidate>
    <FormField label="Full name" name="name" value={values.name} onChange={change} onBlur={() => blur('name')} error={touched.name && errors.name} autoComplete="name" placeholder="Your name" />
    <FormField label="Email address" name="email" type="email" value={values.email} onChange={change} onBlur={() => blur('email')} error={touched.email && errors.email} autoComplete="email" placeholder="you@example.com" />
    <FormField label="Password" name="password" type="password" value={values.password} onChange={change} onBlur={() => blur('password')} error={touched.password && errors.password} autoComplete="new-password" placeholder="At least 8 characters" />
    <FormField label="Confirm password" name="confirm" type="password" value={values.confirm} onChange={change} onBlur={() => blur('confirm')} error={touched.confirm && errors.confirm} autoComplete="new-password" placeholder="Enter your password again" />
    {formError && <p className="form-alert">{formError}</p>}<button className="button button-dark auth-submit" type="submit">Create account <ArrowRight size={17} /></button><p className="terms-note">By creating an account, you agree to our <Link to="/about">terms and privacy policy</Link>.</p>
  </form></AuthLayout>
}

export function LoginPage() {
  const { login, user } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [formError, setFormError] = useState('')
  useEffect(() => { if (user) navigate(location.state?.from || '/', { replace: true }) }, [user, navigate, location.state])
  const change = (event) => { setValues({ ...values, [event.target.name]: event.target.value }); setFormError('') }
  const submit = (event) => { event.preventDefault(); const next = { email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? '' : 'Enter a valid email address.', password: values.password ? '' : 'Enter your password.' }; setErrors(next); setTouched({ email: true, password: true }); if (Object.values(next).some(Boolean)) return; const result = login(values.email, values.password); if (result.error) setFormError(result.error); else navigate(location.state?.from || '/', { replace: true }) }
  return <AuthLayout mode="login"><span className="eyebrow">MY STORE</span><h1>Sign<br /><em>in.</em></h1><p className="auth-subtitle">Welcome back.</p><form className="auth-form" onSubmit={submit} noValidate>
    <FormField label="Email address" name="email" type="email" value={values.email} onChange={change} onBlur={() => { setTouched({ ...touched, email: true }); setErrors({ ...errors, email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? '' : 'Enter a valid email address.' }) }} error={touched.email && errors.email} autoComplete="email" placeholder="you@example.com" />
    <FormField label="Password" name="password" type="password" value={values.password} onChange={change} onBlur={() => { setTouched({ ...touched, password: true }); setErrors({ ...errors, password: values.password ? '' : 'Enter your password.' }) }} error={touched.password && errors.password} autoComplete="current-password" placeholder="Your password" />
    {formError && <p className="form-alert">{formError}</p>}<button className="button button-dark auth-submit" type="submit">Sign in <ArrowRight size={17} /></button><p className="terms-note">Your account details stay on this device.</p>
  </form></AuthLayout>
}

export function AboutPage() {
  return <><section className="about-hero"><div className="about-copy"><span className="eyebrow">ABOUT US</span><h1>About<br /><em>My Store.</em></h1><p>A simple place to shop everyday products.</p><Link to="/shop" className="button button-dark">Shop now <ArrowRight size={17} /></Link></div><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" alt="Store interior" /></section><section className="about-story section-pad"><span className="eyebrow">OUR STORY</span><div><h2>Simple shopping. <em>Good products.</em></h2><p>My Store brings a range of products together in one place.</p></div></section><section className="milestones"><div className="milestone"><span>01</span><h3>Browse</h3><p>Explore the products.</p></div><div className="milestone"><span>02</span><h3>Choose</h3><p>Find what you need.</p></div><div className="milestone"><span>03</span><h3>Checkout</h3><p>Place your order securely.</p></div></section><section className="recognition section-pad"><div className="recognition-mark">ITI</div><div><span className="eyebrow">PROJECT</span><h2>Made for the<br /><em>ITI Front-End Track.</em></h2><p>A front-end project built as part of the ITI Front-End Track.</p></div><Link to="/shop" className="text-link">Shop now <ArrowUpRight size={16} /></Link></section><Footer /></>
}

export function CheckoutPage() {
  const { items, subtotal, setQuantity, removeItem, clearCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const [complete, setComplete] = useState(false)
  const [values, setValues] = useState({ address: '', city: '', postal: '', country: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false)
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 7.5
  const total = subtotal + shipping
  const submit = (event) => { event.preventDefault(); const next = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim() ? '' : 'This field is required.'])); setErrors(next); setTouched(true); if (Object.values(next).some(Boolean) || !items.length) return; clearCart(); setComplete(true) }
  if (complete) return <section className="order-complete"><div className="complete-icon"><Check size={28} /></div><span className="eyebrow">ORDER COMPLETE</span><h1>Thank you,<br /><em>{user?.name.split(' ')[0]}.</em></h1><p>Your order is confirmed.</p><Link className="button button-dark" to="/shop">Continue shopping <ArrowRight size={17} /></Link></section>
  return <><section className="checkout-heading section-pad"><span className="eyebrow">THE LAST LITTLE STEP</span><h1>Make it <em>yours.</em></h1><p>You're checking out as {user?.email}.</p></section><section className="checkout-layout section-pad"><form className="checkout-form" onSubmit={submit} noValidate><div className="checkout-step"><span>01</span><div><h2>Where should we send it?</h2><p>Your details are only used to deliver your order.</p></div></div><div className="address-fields"><FormField label="Street address" name="address" value={values.address} onChange={(event) => setValues({ ...values, address: event.target.value })} error={touched && errors.address} autoComplete="street-address" placeholder="123 Example Street" /><div className="address-row"><FormField label="City" name="city" value={values.city} onChange={(event) => setValues({ ...values, city: event.target.value })} error={touched && errors.city} autoComplete="address-level2" placeholder="City" /><FormField label="Postal code" name="postal" value={values.postal} onChange={(event) => setValues({ ...values, postal: event.target.value })} error={touched && errors.postal} autoComplete="postal-code" placeholder="Postal code" /></div><FormField label="Country" name="country" value={values.country} onChange={(event) => setValues({ ...values, country: event.target.value })} error={touched && errors.country} autoComplete="country-name" placeholder="Country" /></div><button className="button button-dark checkout-submit" type="submit">Place order <ArrowRight size={17} /></button><p className="checkout-security"><ShieldCheck size={15} /> Secure checkout · Your details stay private</p></form><aside className="order-summary"><div className="summary-title"><h2>Your bag</h2><span>{items.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>{items.length ? <div className="summary-items">{items.map((item) => <div className="summary-item" key={item.id}><div className="summary-image"><img src={item.image} alt="" /></div><div className="summary-product"><h3>{item.title}</h3><span>{money(item.price)}</span><div className="summary-quantity"><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(item.id, item.quantity - 1)}><Minus size={13} /></button><span>{item.quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => setQuantity(item.id, item.quantity + 1)}><Plus size={13} /></button><button className="remove-item" type="button" onClick={() => removeItem(item.id)}>Remove</button></div></div><strong>{money(item.price * item.quantity)}</strong></div>)}</div> : <div className="cart-empty"><ShoppingBag size={22} /><p>Your bag is still waiting.</p><Link to="/shop" className="text-link">Find something lovely <ArrowRight size={15} /></Link></div>}<div className="summary-totals"><div><span>Subtotal</span><span>{money(subtotal)}</span></div><div><span>Shipping</span><span>{shipping ? money(shipping) : 'Complimentary'}</span></div><div className="summary-total"><strong>Total</strong><strong>{money(total)}</strong></div></div><p className="shipping-note"><Truck size={15} /> {subtotal >= 75 ? 'Your delivery is on us.' : 'Complimentary delivery over $75.'}</p></aside></section><Footer /></>
}

function Footer() {
  return <footer className="site-footer"><Link className="wordmark" to="/">My Store</Link><nav><Link to="/shop">Shop</Link><Link to="/about">About</Link><Link to="/login">Account</Link></nav><span className="footer-copyright">Designed by ENG/Ahmed Shalaby</span></footer>
}