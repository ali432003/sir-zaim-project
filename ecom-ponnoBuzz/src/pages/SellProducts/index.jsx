import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import axios from "axios";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Stack from "@mui/material/Stack";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { ToastAlert } from "../../utils/toast";

// firebase imports
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const index = () => {
  // Total categories in db
  const categories = [
    "smartphones",
    "laptops",
    "fragrances",
    "skincare",
    "groceries",
    "home-decoration",
    "furniture",
    "tops",
    "womens-dresses",
    "womens-shoes",
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "womens-watches",
    "womens-bags",
    "womens-jewellery",
    "sunglasses",
    "automotive",
    "motorcycle",
    "lighting",
  ];

  // datafields for product data
  const [loader, setloader] = useState(false);
  const [dataFields, setdataFields] = useState({
    uid: "",
    title: "",
    category: "",
    price: "",
    thumbnail: "",
    description: "",
    images: ["", "", ""],
  });

  // // URL shortening function
  // const shortenURL = (url) => {
  //   // Sample URL shortening algorithm using simple hash
  //   const hash = url.split('').reduce((prevHash, char) => (prevHash << 5) - prevHash + char.charCodeAt(0), 0);
  //   return hash.toString(36).slice(0, 6); // Return the first 6 characters of the hash
  // };

  // File input change handlers
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const imageUrl = event.target.result;

        setdataFields({ ...dataFields, thumbnail: imageUrl });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleFilesInputChange = (e, index) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const imageUrl = event.target.result;

        setdataFields((prevState) => ({
          ...prevState,
          images: prevState.images.map((image, i) =>
            i === index ? imageUrl : image
          ),
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  // Category selection change handler
  const handleCategoryChange = (event) => {
    setdataFields({ ...dataFields, category: event.target.value });
  };

  // Submit Handler
  const submit = (e) => {
    e.preventDefault();
    try {
      
    } catch (error) {
      
    }
    if (
      !dataFields.title ||
      !dataFields.category ||
      !dataFields.price ||
      !dataFields.thumbnail ||
      !dataFields.description ||
      dataFields.images.some((image) => image === "")
    ) {
      ToastAlert("Fill All fields", "warning");
      return;
    }

    // Update id field with a random number
    setdataFields((prevState) => ({
      ...prevState,
      id: Math.floor(Math.random() * 1000),
    }));

    // Execute addProd after updating id
    addProd();

    // Reset other fields
    setdataFields({
      uid: Math.floor(Math.random() * 1000),
      title: "",
      category: "",
      price: "",
      thumbnail: "",
      description: "",
      images: ["", "", ""],
    });
  };

  // Function to add product data to the database
  const addProd = async () => {
    setloader(true);
    try {
      const docRef = await addDoc(collection(db, "userProds"), {
        value: dataFields,
      });
      console.log("Document written with ID: ", docRef.id);
      ToastAlert("Successfully added in db", "success");
    } catch (e) {
      console.error("Error adding document: ", e);
      ToastAlert(e.code, "error");
      setloader(false)
    } finally {
      setloader(false);
    }
  };

  return (
    <>
      {localStorage.getItem("email") ? (
        <Box className="my-[8rem]">
          <Typography
            variant="p"
            className="text-4xl"
            color={"#475569"}
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            Sell Products
          </Typography>
          <Box className="bg-slate-100">
            <Box component={"form"}>
              <FormGroup className="lg:w-[50rem] lg:mx-auto flex justify-center flex-col gap-y-5">
                <Box className="flex gap-5">
                  <TextField
                    id="outlined-basic"
                    label="Product Name"
                    value={dataFields.title}
                    onChange={(e) =>
                      setdataFields({ ...dataFields, title: e.target.value })
                    }
                    variant="outlined"
                    color="primary"
                    fullWidth
                    autoFocus
                  />
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={dataFields.category}
                      onChange={handleCategoryChange}
                      label="Category"
                      color="primary"
                    >
                      {categories.map((cat, index) => (
                        <MenuItem value={cat} key={index}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box className="flex gap-5">
                  <TextField
                    id="outlined-basic"
                    label="$ Price"
                    type="number"
                    value={dataFields.price}
                    onChange={(e) =>
                      setdataFields({ ...dataFields, price: e.target.value })
                    }
                    max={1000}
                    variant="outlined"
                    color="primary"
                    fullWidth
                  />
                  <Button
                    component="label"
                    role={undefined}
                    variant="outlined"
                    color="primary"
                    tabIndex={-1}
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Thumbnail
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleFileInputChange}
                      accept=".jpg"
                    />
                  </Button>
                </Box>
                <Box>
                  <TextField
                    id="outlined-basic"
                    label="Description"
                    multiline
                    rows={3}
                    variant="outlined"
                    color="primary"
                    value={dataFields.description}
                    onChange={(e) =>
                      setdataFields({
                        ...dataFields,
                        description: e.target.value,
                      })
                    }
                    fullWidth
                  />
                </Box>
                <Typography variant="p" className="text-lg text-[#334155]">
                  Add 3 Images of Your Product
                </Typography>
                <Box className="flex gap-5">
                  {[1, 2, 3].map((index) => (
                    <Button
                      key={index}
                      component="label"
                      role={undefined}
                      variant="contained"
                      color="primary"
                      tabIndex={-1}
                      fullWidth
                      startIcon={<CloudUploadIcon />}
                    >
                      Image {index}
                      <VisuallyHiddenInput
                        type="file"
                        onChange={(e) => handleFilesInputChange(e, index - 1)}
                      />
                    </Button>
                  ))}
                </Box>
                <Stack direction="row" spacing={2}>
                  <Button
                    color="primary"
                    onClick={submit}
                    variant="contained"
                    fullWidth
                  >
                    {loader ? "Posting..." : "Post this product"}
                  </Button>
                </Stack>
              </FormGroup>
            </Box>
          </Box>
        </Box>
      ) : (
        <div className="flex justify-center place-items-center h-screen flex-col">
          <img width={550} height={550} src={"/sell.gif"} alt="" />
          <h3>
            Please{" "}
            <Link className="text-[#0ea5e9] font-bold" to={"/SignUp"}>
              Signup
            </Link>{" "}
            to Proceed...
          </h3>
        </div>
      )}
    </>
  );
};

export default index;
