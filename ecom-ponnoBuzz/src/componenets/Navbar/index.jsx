import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import logo from "/logo.png";
import { ShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { ToastAlert } from "../../utils/toast";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";


const drawerWidth = 240;
const navItems = ["Home", "Products", "Become A Seller"];

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [cartItem, setcartItem] = useState([]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "cart"));
    const tempArr = [];
    
    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${doc.data()}`);
      // console.log(doc.data());
      tempArr.push({
        id: doc.id,
        item: doc.data(),
      });
    });

    
    setcartItem([...tempArr]);
  }
  // console.log(cartItem.length)

  useEffect(() => {
    fetchData()
  }, [cartItem]);

  const clearCart = async () => {
    try {
      // Delete all documents from the "cart" collection
      const querySnapshot = await getDocs(collection(db, "cart"));
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      ToastAlert(error.code,"error")
    }
  };

  const handleSignOut = () => {
    // setLoader(true);
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        ToastAlert("Sign-out successful", "success");
        // handleClose();
        // setLoader(false);
        localStorage.clear();
        clearCart()
        navigate("/");
        // console.log("Sign-out successful");
      })
      .catch((error) => {
        // An error happened.
        ToastAlert(error.message, "error");
        // setLoader(false);
        console.log("Error occured", error);
      });
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography onClick={() => navigate("/")} variant="h6" sx={{ my: 2 }}>
        <img src={logo} width={120} />
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText
                primary={item}
                sx={{ color: "#475569" }}
                onClick={() => handleRoutes(item)}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {localStorage.getItem("email") ? <Button onClick={() => navigate("/cart")}>
        <ShoppingCart style={{ color: "#475569" }} className="relative" />
        <input
          value={cartItem.length}
          disabled
          className="text-white bg-[#e11d48] absolute w-4 -top-2 left-10 rounded-full ps-1 pe-1"
        />
      </Button> : ""}
      {!localStorage.getItem("email") ? (
        <Button onClick={() => navigate("/SignUp")}>
          <Typography color={"#475569"}> SignUp</Typography>
        </Button>
      ) : (
        <Button onClick={handleSignOut}>
          <Typography color={"#475569"}> SignOut</Typography>
        </Button>
      )}
    </Box>
  );
  const navigate = useNavigate();
  const handleRoutes = (item) => {
    switch (item) {
      case "Home":
        navigate("/");
        break;
      case "Products":
        navigate("/product");
        break;
      case "Become A Seller":
        navigate("/sellProduct");
        break;
      default:
        break;
    }
  };

  

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar component="nav" sx={{ bgcolor: "#64748b" }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              onClick={() => navigate("/")}
              className="cursor-pointer"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              <img src={logo} width={120} />
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {navItems.map((item) => (
                <Button
                  key={item}
                  sx={{ color: "#fff", m: 1, fontWeight: "500" }}
                  onClick={() => handleRoutes(item)}
                >
                  {item}
                </Button>
              ))}
              {localStorage.getItem("email") ? <Button onClick={() => navigate("/cart")}>
                <ShoppingCart style={{ color: "white" }} className="relative" />
                <input
                  value={cartItem.length}
                  disabled
                  className="text-white badge absolute w-4 -top-2 left-10 rounded-full ps-1 pe-1"
                />
              </Button> : ""}
              {!localStorage.getItem("email") ? (
                <Button onClick={() => navigate("/SignUp")}>
                  <Typography color={"white"}> SignUp</Typography>
                </Button>
              ) : (
                <Button onClick={handleSignOut}>
                  <Typography color={"white"}> SignOut</Typography>
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <nav>
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        </nav>
      </Box>
    </>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
