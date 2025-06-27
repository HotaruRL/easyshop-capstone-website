import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import "./Home.css";
import Select from "react-select";
import { useCart } from "../../context/CartContext";

const Home = () => {
  const { addToCart } = useCart();
  // State for full list of products from API
  const [products, setProducts] = useState([]);
  // State for the products after filtering
  const [filteredProducts, setFilteredProducts] = useState([]);
  // State for list of categories for the sidebar
  const [categories, setCategories] = useState([]);
  // State to tract the currently selected category ID
  const [selectedCategory, setSelectedCategory] = useState({
    value: "all",
    label: "All Products",
  }); // 'all' is our default

  // State for loading and error messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //State for price filtering
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1500 });
  //user's currently selected min and max price
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1500);

  // Fetch all needed data when the component first loads
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // use Promise.all to fetch products and categories at the same time
        const [productsResponse, categoriesResponse] = await Promise.all([
          axiosClient.get("/products"),
          axiosClient.get("/categories"),
        ]);

        const allProducts = productsResponse.data;
        setProducts(allProducts);
        setCategories(categoriesResponse.data);

        if (allProducts.length > 0) {
          // find min and max prices from the product list
          const prices = allProducts.map((p) => p.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);

          // set all pricce state at once
          setPriceRange({ min, max });
          setMinPrice(min);
          setMaxPrice(max);
        }
      } catch (err) {
        console.error("Failed to fetch initial data", err);
        setError("Could not load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []); // [] run only once at start

  // to combined filters
  useEffect(() => {
    let result = products; // start with full list

    // apply category filter
    if (selectedCategory.value != "all") {
      result = result.filter(
        (product) =>
          Number(product.categoryId) === Number(selectedCategory.value)
      );
    }

    // apply price filter
    result = result.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );

    // set final filtered list to be displayed
    setFilteredProducts(result);
  }, [selectedCategory, minPrice, maxPrice, products]); // re-runs if any of these change

  // handle clicking on category filter
  const handleCategoryFilter = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  // handle broken images
  const handleImageError = (event) => {
    // prevent infinite loop if the placeholder itself is broken
    event.target.onerror = null;
    // set the image source to safe placeholder
    event.target.src = "/images/placeholder.jpeg";
  };

  const categoryOptions = [
    { value: "all", label: "All Products" },
    ...categories.map((category) => ({
      value: category.categoryId,
      label: category.name,
    })),
  ];

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#fff",
      borderColor: "#ddd",
      borderRadius: "var(--bs-border-radius)",
      padding: "0.35rem",
      boxShadow: "none",
      "&:hover": { borderColor: "var(--bs-primary)" },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "var(--bs-primary)"
        : state.isFocused
        ? "#f8f9fa"
        : "white",
      color: state.isSelected ? "white" : "var(--bs-body-color)",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "var(--bs-body-color)",
    }),
  };

  // show loading message while fetching data
  if (loading) {
    return <div className="loading-message">Loading products...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="home-container">
      {/* Left Hand Side: Filter sidebar */}
      <aside className="filter-sidebar">
        <h3>Filters</h3>
        <Select
          className="category-react-select"
          options={categoryOptions}
          value={selectedCategory}
          onChange={handleCategoryFilter}
          styles={customSelectStyles}
        ></Select>

        <div className="price-filter-group">
          <div className="price-filter">
            <label htmlFor="minPrice">
              Min Price: <span>${minPrice}</span>
            </label>
            <input
              type="range"
              id="minPrice"
              name="minPrice"
              min={priceRange.min}
              max={priceRange.max}
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />
          </div>

          <div className="price-filter">
            <label htmlFor="maxPrice">
              Max Price: <span>${maxPrice}</span>
            </label>
            <input
              type="range"
              id="maxPrice"
              name="maxPrice"
              min={priceRange.min}
              max={priceRange.max}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>
      </aside>

      {/* Right Hand Side: Product Grid */}
      <main className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            // determine the image source
            const imageUrl = product.imageUrl.startsWith("http")
              ? product.imageUrl
              : `/images/products/${product.imageUrl}`;

            return (
              <div key={product.productId} className="product-card">
                <div className="card-content">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="product-image"
                    onError={handleImageError}
                  />
                  <div className="product-info">
                    <h4 className="product-name">{product.name}</h4>
                    <p className="product-price">${product.price}</p>
                  </div>
                </div>
                <div className="card-button-wrapper">
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No product found in this category.</p>
        )}
      </main>
    </div>
  );
};

export default Home;
