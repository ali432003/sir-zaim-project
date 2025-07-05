import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import { ToastAlert } from "../../utils/toast";
import axios from "axios";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { Spinner } from "@material-tailwind/react";

export default function SimpleRegistrationForm() {
  const navigate = useNavigate();

  // backend work

  const [userData, setuserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [validEmailFormat, setValidEmailFormat] = useState(true);
  const [validPassFormat, setValidPassFormat] = useState(true);
  const [loader, setloader] = useState(false);

  const handleSubmit = () => {
    setloader(true);
    if (userData.email === "" || userData.password === "") {
      setloader(false);
      ToastAlert("fill all fields", "warning");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(userData.email)) {
      setloader(false);
      setValidEmailFormat(false);
      return;
    } else if (userData.password.length > 8) {
      setloader(false);
      setValidPassFormat(false);
      return;
    }
    // console.log(userData)
    createUserWithEmailAndPassword(auth, userData.email, userData.password)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user;
        // console.log(user, "user");
        await updateProfile(user, {
          displayName: userData.name,
        });

        ToastAlert("Successfully signup", "success");
        setloader(false);
        navigate("/Login");
      })
      .catch((error) => {
        setloader(false);
        ToastAlert(error.code, "error");
      });

    setuserData({ name: "", email: "", password: "" });
    setValidEmailFormat(true);
    setValidPassFormat(true);
  };

  return (
    <Box
      component={"div"}
      className="h-screen"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Sign Up
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Nice to meet you! Enter your details to register.
        </Typography>
        <form method="POST" className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Name
            </Typography>
            <Input
              size="lg"
              placeholder="Your Full Name"
              value={userData.name}
              onChange={(e) => {
                setuserData({ ...userData, name: e.target.value });
              }}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Email
            </Typography>
            <Input
              size="lg"
              type="email"
              placeholder="name@mail.com"
              value={userData.email}
              onChange={(e) => {
                setuserData({ ...userData, email: e.target.value });
              }}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {!validEmailFormat && (
              <div style={{ color: "red" }}>
                Please enter a valid email address.
              </div>
            )}
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={userData.password}
              onChange={(e) => {
                setuserData({ ...userData, password: e.target.value });
              }}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {!validPassFormat && (
              <div style={{ color: "red" }}>
                Password legth should be less than 8
              </div>
            )}
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center font-normal"
              >
                I agree the
                <a className="font-medium transition-colors hover:text-gray-900">
                  &nbsp;Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          {!loader ? (
            <Button onClick={handleSubmit} variant="gradient" fullWidth>
              Signup
            </Button>
          ) : (
            <Button
              className="flex justify-center"
              variant="gradient"
              fullWidth
            >
              <Spinner />
            </Button>
          )}
          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <Link to="/Login" className="font-medium text-gray-900">
              Login
            </Link>
          </Typography>
        </form>
      </Card>
    </Box>
  );
}
