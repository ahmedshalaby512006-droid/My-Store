import { allData } from './date/data.js'
import Section2 from './Section2.jsx'
import { useState } from 'react'
import './Section2.css'

export default function Home() {
  
  const availableData = allData.filter((prod) => prod.inStock)

  const [filteredProducts, setFilteredProducts] = useState(availableData)
  const [search, setSearch] = useState("")
  const [saleOnly, setSaleOnly] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1)
  }

  const applyFilters = (searchValue, saleValue) => {
    const result = availableData.filter((prod) => {
      const matchesSearch = prod.name.toLowerCase().includes(searchValue.toLowerCase())
      const isOnSale = prod.originalPrice && prod.originalPrice > prod.price
      const matchesSale = saleValue ? isOnSale : true
      return matchesSearch && matchesSale
    })
    setFilteredProducts(result)
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    applyFilters(e.target.value, saleOnly)
  }

  const handleSaleChange = (e) => {
    setSaleOnly(e.target.checked)
    applyFilters(search, e.target.checked)
  }

  return (
    <>
      <div className="navbar">
        <h2>My Shop</h2>
        <div className="cart">🛒 Cart: {cartCount}</div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
        />

        <label>
          <input type="checkbox" checked={saleOnly} onChange={handleSaleChange} />
          On sale only
        </label>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-results">
          <p>No products match your filters.</p>
        </div>
      ) : (
        <section className="product-container">
          {filteredProducts.map((prod) => (
            <Section2
              key={prod.id}
              id={prod.id}
              name={prod.name}
              image={prod.image}
              category={prod.category}
              price={prod.price}
              originalPrice={prod.originalPrice}
              description={prod.description}
              rating={prod.rating}
              inStock={prod.inStock}
              onAddToCart={handleAddToCart}
            />
          ))}
        </section>
      )}
    </>
  )
}









