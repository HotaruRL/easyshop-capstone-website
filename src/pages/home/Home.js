import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import "./Home.css";
import Select from "react-select";

const Home = () => {
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
  const handleCategoryFilter = (selectedOption) => {
    setSelectedCategory(selectedOption);

    if (selectedOption.value === "all") {
      setFilteredProducts(products);
    } else {
      const newFilteredList = products.filter(
        (product) => Number(product.categoryId) === Number(selectedOption.value)
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
        <h3>Categories</h3>
        <Select
          className="category-react-select"
          options={categoryOptions}
          value={selectedCategory}
          onChange={handleCategoryFilter}
          styles={customSelectStyles}
        ></Select>
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
