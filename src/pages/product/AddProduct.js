import { useState } from "react";
import "./AddProduct.css";
import { Alert, Button, Form } from "react-bootstrap";
import axiosClient from "../../api/axiosClient";

const AddProduct = () => {

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        categoryId: "",
        description: "",
        color: "",
        imageUrl: "",
        stock: "",
        featured: false
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');


    const handleInputChange = (event) => {
        const isCheckbox = event.target.type === 'checkbox';

        const {name, value, checked} = event.target;

        setFormData({
            /* 
            ... spread operator copy everything from old formData first
            prevent erasing other fields when updating just one
            */
            ...formData,
            [name]: isCheckbox ? checked : value,
        })
    }

    const handleSubmit = async (event) => {
        // prevent page from reloading by default
        event.preventDefault();

        // clear previous messages
        setError('');
        setMessage('');

        try{
            /*
            Make API call using our axiosClient with
            Authorization header auto added
            */
            const response = await axiosClient.post('/products', formData);

            setMessage("Product added successfully!");
            console.log("Success", response.data);

            // reset the form after successful submission
            setFormData({
                name:"", price:"", categoryId:"", description:"",
                color:"", imageUrl:"", stock:"", featured: false
            })
        }catch (err){
            setError("Failed to add product. Please check the details and try again.");
            console.error("API Error:", err);
        }
    };

    return(
        <div className="center-form">
            <h1>Add New Product</h1>
            {/* Pass the handleSubmit function to the form's onSubmit event */}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        name="price"
                        placeholder="Enter value"
                        value={formData.price}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formCategoryId">
                    <Form.Label>Category ID</Form.Label>
                    <Form.Control
                        type="number"
                        name="categoryId"
                        placeholder="Enter categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows = {3}
                        name="description"
                        placeholder="Enter description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formColor">
                    <Form.Label>Color</Form.Label>
                    <Form.Control
                        type="text"
                        name="color"
                        placeholder="Enter color"
                        value={formData.color}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formImageUrl">
                     <Form.Label>Image URL</Form.Label>
                    <Form.Control
                        type="url"
                        name="imageUrl"
                        placeholder="Enter imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formStock">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                        type="number"
                        name="stock"
                        placeholder="Enter stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formFeatured">
                    <Form.Check
                        type="checkbox"
                        name="featured"
                        label="Is this a featured product?"
                        checked={formData.featured}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                {/* Display success or error message to user */}
                {message && <Alert variant="success" className="mt-3">{message}</Alert>}
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                <Button variant="primary" type="submit" className="w-100">Add Product</Button>
         
            </Form>
        </div>
    )
}

export default AddProduct