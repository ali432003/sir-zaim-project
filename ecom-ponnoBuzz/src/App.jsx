import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Slide, ToastContainer } from "react-toastify";
// import { ToastAlert } from "./utils/toast"
import { Route, Routes, useLocation } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Products from "./pages/Products";
import SellProducts from "./pages/SellProducts";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import LoginCard from "./pages/Login";
import SimpleRegistrationForm from "./pages/SignUp";
import DrawerAppBar from "./componenets/Navbar";
import FooterWithSocialLinks from "./componenets/Footer";
import AuthRoute from "./routes/AuthRoute";
import PrivateRote from "./routes/PrivateRoute";
import { auth, db } from "./firebase"
import { ToastAlert } from "./utils/toast";
import { Spinner } from "@material-tailwind/react";

function App() {
  const location = useLocation();
  const [CurrUser, setCurrUser] = useState({});
  const [authLoader,setauthLoader] = useState(false)
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // console.log("User is signed in :", user);
        setCurrUser(user);
        // ToastAlert(`User moujood haa ${user.displayName}`,"success")
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // const uid = user.uid;
        // ...
      } else {
        console.log("Signed Out");
        // User is signed out
        // ...
      }
      setauthLoader(true)
    });
  }, [auth]);

  // Function to check if the current route is signup or login to remove navbar/footer from them..
  const isSignupOrLogin = () => {
    return location.pathname === "/SignUp" || location.pathname === "/Login";
  };
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);

  const fetchApi = () => {
    setLoad(true);
    axios
      .get("https://dummyjson.com/products?limit=100")
      .then((res) => {
        // console.log(res.data.products);
        setData(res.data.products);
        setLoad(false);
      })
      .catch((error) => {
        console.log(error);
        setLoad(false);
      });
  };

  useEffect(() => {
    fetchApi();
  }, []);

  if (!authLoader) {
    return <div className="flex justify-center place-items-center h-screen"><img src="/load.svg" className="h-20 w-20"/></div>; // Replace LoadingSpinner with your loading indicator
  }

  return (
    <>
      {!isSignupOrLogin() && <DrawerAppBar />}
      <Routes>
        <Route index element={<Home data={data} load={load} />} />
        <Route path="/product" element={<Products data={data} load={load} />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/sellProduct" element={<SellProducts />} />
        <Route element={<AuthRoute />}>
          <Route path="/SignUp" element={<SimpleRegistrationForm />} />
          <Route path="/Login" element={<LoginCard />} />
        </Route>
        <Route element={<PrivateRote />}>
          <Route path="/cart" element={<Cart />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isSignupOrLogin() && <FooterWithSocialLinks />}

      <ToastContainer
        position="bottom-right"
        limit={1}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
    </>
  );
}

export default App;
