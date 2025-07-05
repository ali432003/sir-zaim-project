import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./style.css";
import { ToastAlert } from "../../utils/toast";
import { Spinner } from "@material-tailwind/react";
import { addDoc, collection, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Box from "@mui/material/Box";
import EcommerceCard from "../../componenets/Cards";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";

const Index = () => {
  const [prod, setProd] = useState();
  const [uProd, setuProd] = useState();
  const params = useParams(); // Corrected spelling of useParams
  const [relatedItem, setrelatedItem] = useState([]);
  const [load, setLoad] = useState(false);

  // Db calling data
  const fetchSingleProd = async () => {
    // console.log("user ka product");
    const docRef = doc(db, "userProds", params.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data().value);
      setuProd(docSnap.data().value);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  // Api Calling
  const fetchApiSingle = () => {
    // params.id = 6
    // setLoad(true);
    axios
      .get(`https://dummyjson.com/product/${params.id}?limit=100`)
      .then((res) => {
        // console.log(res.data); // Check the response structure
        setProd(res.data); // Assuming the response is an object, not an array
        // setLoad(false);
        // fetchRelatedItems();
      })
      .catch((error) => {
        ToastAlert(error.code, "error");
        console.log(error);
        // setLoad(false);
      });
  };
  const fetchRelatedItems = () => {
    // setLoad(true);
    axios
      .get(
        `https://dummyjson.com/products/category/${
          prod?.category || uProd?.category
        }`
      )
      .then((res) => {
        // console.log(res.data); // Check the response structure
        setrelatedItem(res.data.products); // Assuming the response is an object, not an array
        // setLoad(false);
      })
      .catch((error) => {
        ToastAlert(error.code, "error");
        console.log(error);
        // setLoad(false);
      });
  };

  const [Quan, setQuan] = useState(1);
  // console.log(Quan)

  // Add to Cart

  const addToCart = async () => {
    setLoad(true);
    if (!localStorage.getItem("email")) {
      ToastAlert("Sign up to get add products", "warning");
      setLoad(false);
      return;
    }

    let itemDetail;

    if (prod) {
      itemDetail = {
        prize: prod.price,
        title: prod.title,
        thumbnail: prod.thumbnail,
        quantity: Quan,
      };
    } else if (uProd) {
      itemDetail = {
        prize: uProd.price,
        title: uProd.title,
        thumbnail: uProd.thumbnail,
        quantity: Quan,
      };
    }

    try {
      await addDoc(collection(db, "cart"), {
        value: itemDetail,
      });
      // console.log("Document written with ID: ", docRef.id);
      setLoad(false);
      ToastAlert("Item Added", "success");
    } catch (e) {
      console.error("Error adding document: ", e)
      // ToastAlert(e.message, "error");
      setLoad(false);
    }
  };

  useEffect(() => {
    if (params.id.length > 3) {
      fetchSingleProd();
    } else {
      fetchApiSingle();
    }
  }, [params.id]); /// relatedItem dala tha ab hataya ha toh chlraa haa code sahii

  const [mainImgSrc, setMainImgSrc] = useState(
    prod ? prod.thumbnail : uProd ? uProd.thumbnail : ""
  );

  useEffect(() => {
    if (prod) {
      setMainImgSrc(prod.thumbnail);
      fetchRelatedItems(); // Fetch related items when prod changes
    } else if (uProd) {
      setMainImgSrc(uProd.thumbnail);
      fetchRelatedItems();
    }
  }, [prod, uProd]);

  useEffect(() => {
    if (relatedItem) {
      // Ensure relatedItems are properly set
      // console.log(relatedItem); // Check if relatedItems are fetched correctly
    }
  }, [relatedItem]);

  const handleImageClick = (index) => {
    if (prod && prod.images && prod.images[index]) {
      setMainImgSrc(prod.images[index]);
    } else if (uProd && uProd.images && uProd.images[index]) {
      setMainImgSrc(uProd.images[index]);
    }
  };

  // const allCat = [...relatedItem,...uProd]
  return (
    <>
      {prod || uProd ? (
        <>
          <section
            id="prodetails"
            className="section-p1"
            style={{ marginTop: "6rem" }}
          >
            <div className="single-pro-image">
              <img src={mainImgSrc} width={650} height={650} alt="" />
              <div className="small-img-group" style={{ marginTop: "2rem" }}>
                {prod?.images || uProd?.images ? (
                  (prod?.images || uProd?.images).map((image, index) => (
                    <div key={index} className="small-img-col">
                      <img
                        src={image}
                        width={250}
                        height={250}
                        className="ssmall-img"
                        alt=""
                        onClick={() => handleImageClick(index)}
                      />
                    </div>
                  ))
                ) : (
                  <CircularProgress />
                )}
              </div>
            </div>
            <div className="single-pro-details">
              <h6>Home / {prod?.category || uProd?.category}</h6>
              <h4>{prod?.title || uProd?.title}</h4>
              <h2>{(prod?.price || uProd?.price) + "$"}</h2>

              <input
                type="number"
                defaultValue={1}
                className="border border-[#64748b] rounded-lg"
                min={1}
                max={5}
                onChange={(e) => {
                  setQuan(e.target.value);
                }}
              />
              <button className="normal" onClick={addToCart}>
                {!load ? "Add To Cart" : "Adding..."}
              </button>
              <h4>Product details</h4>
              <span>{prod?.description || uProd?.description}</span>
            </div>
          </section>
          {relatedItem ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                gap: "2rem",
                mt: "5rem",
                justifyContent: "center",
              }}
              className={"lg:mx-[0.4rem] mx-[1rem] mb-[5rem]"}
            >
              <Typography variant="p" fontSize={50} my={6} textAlign={"center"}>
                Related Items
              </Typography>
              <Box
                component={"div"}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  mt: "2rem",
                  justifyContent: "center",
                }}
                className={"lg:mx-[2rem] lg:gap-[1rem] gap-[2rem] "}
              >
                {relatedItem.map((item, index) => (
                  <EcommerceCard
                    key={index}
                    id={item.id}
                    img={item.thumbnail}
                    title={item.title}
                    desc={item.description}
                    price={item.price}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            ""
          )}
        </>
      ) : (
        <p className="flex justify-center place-items-center h-screen gap-2 text-2xl text-[#475569]">
          Loading... <Spinner className="h-10 w-10" color="blue-gray" />
        </p>
      )}
    </>
  );
};

export default Index;
