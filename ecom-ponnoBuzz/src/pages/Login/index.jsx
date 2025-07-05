import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button,
} from "@material-tailwind/react";
import { useState } from "react";
import Box from "@mui/material/Box";
import { NavigateBefore } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom"
import axios from "axios";
import { ToastAlert } from "../../utils/toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { v4 as uuidv4 } from 'uuid'
import { Spinner } from "@material-tailwind/react";

export default function LoginCard() {
  const navigate = useNavigate();

  
  
  // Backend work
  const [userLoginData , setuserLoginData] = useState({
    email : "",
    password : ""
  }) 
 
  const [validEmailFormat, setValidEmailFormat] = useState(true);
  const [validPassFormat, setValidPassFormat] = useState(true);
  const [loader,setloader] = useState(false)


  const handleSubmit = (e)=>{
    setloader(true)
    e.preventDefault()
    if(userLoginData.email===""||userLoginData.password===""){
      setloader(false)
      ToastAlert("fill all fields","warning")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(userLoginData.email)){
      setloader(false)
      setValidEmailFormat(false);
      return;
    } else if(userLoginData.password.length > 8){
      setloader(false)
      setValidPassFormat(false)
      return
    }
    
      signInWithEmailAndPassword(auth, userLoginData.email, userLoginData.password)
    
      .then((userCredential) => {
        const user = userCredential.user.uid;
        console.log(userCredential)
        localStorage.setItem("email", user);
        setloader(false)
        navigate("/");
        ToastAlert(`Welcome ${userCredential.user.displayName}`, "success");
      })
      .catch((error) => {
        setloader(false)
        ToastAlert(error.code, "error");
        localStorage.clear()
      });

    setuserLoginData({ email : "", password : ""})
    setValidEmailFormat(true);
    setValidPassFormat(true);
    
  }
  
  
  return (
    <Box
      component={"div"}
      className="h-screen"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Card className="w-96">
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            Login
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={userLoginData.email}
            onChange={(e) => {
              setuserLoginData({...userLoginData, email: e.target.value});
            }}
            size="lg"
          />
          {!validEmailFormat && <div style={{ color: 'red' }}>Please enter valid email</div>}
          <Input
            label="Password"
            type="password"
            value={userLoginData.password}
            onChange={(e) => {
              setuserLoginData({...userLoginData, password: e.target.value});
            }}
            size="lg"
          />
          {!validPassFormat && <div style={{ color: 'red' }}>Password legth should be less than 8</div>}
          <div className="-ml-2.5">
            <Checkbox label="Remember Me" />
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          {!loader?<Button onClick={handleSubmit} variant="gradient" fullWidth>
            Login
          </Button> : <Button className="flex justify-center" variant="gradient" fullWidth>
             <Spinner/>
          </Button>}
          <Typography variant="small" className="mt-6 flex justify-center">
            Don&apos;t have an account?
            <Typography
              as="a"
              variant="small"
              color="blue-gray"
              className="ml-1 font-bold cursor-pointer"
              onClick={() => navigate("/SignUp")}
            >
              Sign up
            </Typography>
          </Typography>
        </CardFooter>
      </Card>
    </Box>
  );
}
