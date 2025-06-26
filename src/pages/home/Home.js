import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import "./Home.css";

const Home = () => {
  // State for full list of products from API
  const [products, setProducts] = useState([]);
  // State for the products after filtering
  const [filteredProducts, setFilteredProducts] = useState([]);
  // State for list of categories for the sidebar
  const [categories, setCategories] = useState([]);
  // State to tract the currently selected category ID
  const [selectedCategory, setSelectedCategory] = useState("all"); // 'all' is our default

  // State for loading and error messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all needed data when the component first loads
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // use Promise.all to fetch products and categories at the same time
        const [productsResponse, categoriesResponse] = await Promise.all([
          axiosClient.get("/products"),
          axiosClient.get("/categories"),
        ]);

        console.log("A single product object:", productsResponse.data[0]);
        console.log("A single category object:", categoriesResponse.data[0]);

        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error("Failed to fetch initial data", err);
        setError("Could not load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []); // [] run only once at start

  // handle clicking on category filter
  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);

    if (categoryId === "all") {
      setFilteredProducts(products);
    } else {
      const newFilteredList = products.filter(
        (product) => Number(product.categoryId) === Number(categoryId)
      );
      setFilteredProducts(newFilteredList);
    }
  };

  // handle broken images
  const handleImageError = (event) => {
    // prevent infinite loop if the placeholder itself is broken
    event.target.onerror = null;
    // set the image source to safe placeholder
    event.target.src = "/images/placeholder.jpeg";
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
        <h3>Categories</h3>
        <button
          className={selectedCategory === "all" ? "active" : ""}
          onClick={() => handleCategoryFilter("all")}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category.categoryId}
            className={
              Number(selectedCategory) === Number(category.categoryId)
                ? "active"
                : ""
            }
            onClick={() => handleCategoryFilter(category.categoryId)}
          >
            {category.name}
          </button>
        ))}
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
              <div key={product.id} className="product-card">
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
