import React, { useState } from "react";
import { CarouselCustomNavigation } from "../../componenets/Caroseul";
import Marquee from "../../componenets/Marquee";
import { Typography } from "@mui/material";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import EcommerceCard from "../../componenets/Cards";
import DropDown from "../../componenets/DropDown";
import { Spinner } from "@material-tailwind/react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const index = (props) => {
  // Slice the first 6 items from the props.data array
  const displayedData = props.data.slice(3, 9); // featured items
  const displayedData2 = props.data.slice(35, 41); // new arrival items

  return (
    <>
      <DropDown />
      {!props.load ? (
        <>
          <CarouselCustomNavigation slicedData={props.data.slice(7, 13)} />(
          <Box component={"div"} className="lg:my-[6rem] my-[6rem]">
            <Typography
              variant="p"
              className="text-4xl"
              color={"#475569"}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              Fetured Products
            </Typography>
            <Typography
              variant="p"
              color={"#64748b"}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              Colletion of new modern design
            </Typography>
            <Box
              component={"div"}
              className=" lg:mx-[8rem] md:mx-[2rem] mx-[2rem]"
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  mt: "2rem",
                  justifyContent: "center",
                }}
                className={"lg:mx-[2rem] lg:gap-[1rem] gap-[2rem] "}
              >
                {Array.from(displayedData).map((item, index) => (
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
          </Box>
          <Marquee />
          <Box component={"div"} className="lg:my-[6rem] my-[6rem]">
            <Typography
              variant="p"
              fontSize={50}
              color={"#475569"}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              New Arrival
            </Typography>
            <Typography
              variant="p"
              color={"#64748b"}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              Don't miss these 70% sale
            </Typography>
            <Box
              component={"div"}
              className=" lg:mx-[8rem] md:mx-[2rem] mx-[2rem]"
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  mt: "2rem",
                  justifyContent: "center",
                }}
                className={"lg:mx-[2rem] lg:gap-[1rem] gap-[2rem] "}
              >
                {Array.from(displayedData2).map((item, index) => (
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
          </Box>
          )
        </>
      ) : (
        <p className="flex justify-center place-items-center h-screen gap-2 text-2xl text-[#475569]">
          Hang on... <Spinner className="h-10 w-10" color="blue-gray" />
        </p>
      )}
    </>
  );
};

export default index;
