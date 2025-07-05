import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { ToastAlert } from "../../utils/toast";
import { Typography } from "@mui/material";

// import {cloudinary} from "@cloudinary/react"

const index = () => {
  return (
    <div className="mt-[2rem]">
      <Typography fontSize={50} color={"#475569"} sx={{ display:"flex",justifyContent:"center" }} variant="p">Brands</Typography>
      <Typography variant="p" color={"#64748b"} sx={{ display:"flex",justifyContent:"center" }}>Trusted by many Brands</Typography>
      <Marquee
        gradient={true}
        speed={130}
        delay={0}
        play={true}
        direction="left"
        
      >
        <img width={250} height={250} src="/brands/apple.png" alt="" />
        <img width={250} height={250} src="/brands/hp.png" alt="" />
        <img width={250} height={250} src="/brands/huawei.png" alt="" />
        <img width={250} height={250} className="mx-[4rem]" src="/brands/oppo.png" alt="" />
        <img width={250} height={250} src="/brands/samsung.png" alt="" />
        <img width={250} height={250} className="mx-[4rem]" src="/brands/the-warehouese.png" alt="" />
        <img width={250} height={250} src="/brands/brave-bull.jpg" alt="" />
        <img width={250} height={250} src="/brands/loreal.jpg" alt="" />
      </Marquee>
    </div>
  );
};

const Img = () => {
  return (
    <img
      width={250}
      height={250}
      src="https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630"
    />
  );
};

export default index;
