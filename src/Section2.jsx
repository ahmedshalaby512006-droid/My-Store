import './Section2.css'

export default function Section2(info) {
  const { name, price, originalPrice, description, image, category, rating, onAddToCart } = info
  const onSale = Boolean(originalPrice && originalPrice > price)
  const isTopRated = rating > 4.5

  return (
    <section className={`product-card ${isTopRated ? 'top-rated' : ''}`}>
      {onSale && <span className="badge">sale</span>}
      {isTopRated && <span className="badge-rating">★ Top Rated</span>}

      <h3>{name}</h3>
      <img src={image} alt={name} />
      <p>{description}</p>
      <p>Category: {category}</p>

      {onSale ? (
        <p>
          <span className="old-price">${originalPrice.toFixed(2)}</span>{" "}
          <span className="new-price">${price.toFixed(2)}</span>
        </p>
      ) : (
        <p>Price: ${price.toFixed(2)}</p>
      )}

      <p>Rating: {rating} / 5</p>
      <button onClick={onAddToCart}>Add to Cart</button>
    </section>
  )
}




