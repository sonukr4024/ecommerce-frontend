import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Autocomplete,
  CardMedia,
} from "@mui/material";

function AdminPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState(""); // base64 string
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null); // object or string
  const [qty, setQty] = useState("");
  const [success, setSuccess] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [productsMap, setProductsMap] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:1010/api/categories", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCategoriesList(data))
      .catch((err) => console.log(err));
  }, [token]);

  useEffect(() => {
    // Agar category object hai (jo category select hua) ya string (free solo)
    let catName = null;
    let catId = null;
    if (category) {
      if (typeof category === "string") {
        catName = category;
      } else if (typeof category === "object" && category?.id) {
        catName = category.name;
        catId = category.id;
      }
    }

    if (!catName) {
      setProductSuggestions([]);
      setProductsMap({});
      return;
    }

    // Fetch products by category name (backend ko aise support karna chahiye)
    fetch(`http://localhost:1010/api/products/${catId}`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProductSuggestions(data.map((prod) => prod.name));
        const map = {};
        data.forEach((prod) => {
          map[prod.name] = prod;
        });
        setProductsMap(map);
      })
      .catch((err) => {
        console.log(err);
        setProductSuggestions([]);
        setProductsMap({});
      });
  }, [category, token]);

  const handleProductSelect = (value) => {
    setName(value);
    if (productsMap[value]) {
      const p = productsMap[value];
      setPrice(p.price);
      setImagePreview(p.image);
      setDescription(p.description || "");
      setQty(p.qty || "");
    } else {
      setPrice("");
      setImagePreview("");
      setDescription("");
      setQty("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        const base64String = reader.result.split(",")[1];
        setImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async () => {
    if (!name || !category) {
      setSuccess("Product name and category required");
      return;
    }

    // categoryName agar string ho to use karo, warna object me name
    const categoryName =
      typeof category === "string" ? category : category.name;

    const productData = {
      name: name,
      price: parseFloat(price),
      qty: parseInt(qty),
      image: image,
      categoryName: categoryName,
      description: description,
    };

    const response = await fetch("http://localhost:1010/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      setSuccess("Product saved/updated successfully!");
      setName("");
      setPrice("");
      setImageFile(null);
      setImagePreview("");
      setQty("");
      setCategory(null);
      setDescription("");
      setProductSuggestions([]);
    } else {
      const err = await response.text();
      setSuccess(err || "Failed to add product");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Add / Update Product
        </Typography>

        <Autocomplete
          freeSolo
          options={categoriesList}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.name
          }
          value={category}
          onChange={(e, val) => setCategory(val)}
          onInputChange={(e, val, reason) => {
            if (reason === "input") {
              setCategory(val);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Category" margin="normal" fullWidth />
          )}
        />

        <Autocomplete
          freeSolo
          options={productSuggestions}
          value={name}
          onChange={(e, val) => handleProductSelect(val)}
          onInputChange={(e, val) => handleProductSelect(val)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Product Name"
              margin="normal"
              fullWidth
            />
          )}
        />

        <TextField
          label="Price (₹)"
          margin="normal"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <TextField
          label="Description"
          margin="normal"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          label="Quantity"
          margin="normal"
          fullWidth
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>

        {imagePreview && (
          <CardMedia
            component="img"
            height="180"
            image={imagePreview}
            alt="Product Preview"
            sx={{ mt: 2, borderRadius: 2 }}
          />
        )}

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          fullWidth
          onClick={handleAddProduct}
        >
          Save / Update Product
        </Button>

        {success && (
          <Typography sx={{ mt: 2, color: "green" }}>{success}</Typography>
        )}
      </Box>
    </Container>
  );
}

export default AdminPage;
