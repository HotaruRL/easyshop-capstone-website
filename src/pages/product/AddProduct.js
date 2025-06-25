import { useState } from "react";
import "./AddProduct.css";
import { Button, Form } from "react-bootstrap";

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
    return(
        <div className="center-form">
            <h1>Add New Product</h1>
            <Form>
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

                <Button variant="primary" type="submit" className="w-100">Add Product</Button>
         
            </Form>
        </div>
    )
}

export default AddProduct