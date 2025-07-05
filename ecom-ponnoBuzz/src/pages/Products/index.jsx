import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import EcommerceCard from "../../componenets/Cards";
import { TextField } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { ToastAlert } from "../../utils/toast";
import { Spinner } from "@material-tailwind/react";
import {useNavigate} from "react-router-dom"

// Firebasse imports

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const Index = (props) => {
  const navigate = useNavigate()
  const [categoriesData, setCategoriesData] = useState({});
  let [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // const [ refresh,setRefresh] = useState(false)
  const itemsPerPage = 10;

  // Calculate total number of pages
  const totalPages = Math.ceil(props.data.length / itemsPerPage);

  // Calculate the range of items to display for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, props.data.length);
  const realData = props.data.slice(startIndex, endIndex);

  const handleChangePage = (event, page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  // db data getting
  const [prodId, setProdId] = useState("");
  const [ProdCollection, setProdCollection] = useState([]);
  const [dbloader, setdbloader] = useState(false);
  const fetchData = async () => {
    setdbloader(true);
    try {
      const querySnapshot = await getDocs(collection(db, "userProds"));
      const tempArr = [];
      querySnapshot.forEach((doc) => {
        // console.log(`${doc.id} => ${doc.data()}`);
        setProdId(doc.id);
        // console.log(doc.data());
        tempArr.push({
          id: doc.id,
          product: doc.data(),
        });
      });
      setdbloader(false);
      setProdCollection([...tempArr]);
    } catch (error) {
      // ToastAlert("Error in fetching Data", "error");
      setdbloader(false);
    }
  };


  console.log("ProdCollection", ProdCollection);
  const filteration = () => {
    const filteredCategories = {};
    // Merge realData and ProdCollection into one array if ProdCollection is available
    const allData = [
      ...realData,
      ...(ProdCollection
        ? ProdCollection.map((item) => item.product.value)
        : []),
    ];
    allData.forEach((item) => {
      // Check if the item matches the search query
      if (item.title.toLowerCase().includes(search.toLowerCase())) {
        // Check if the category exists in filteredCategories, if not, initialize it
        if (!filteredCategories[item.category]) {
          filteredCategories[item.category] = [item];
        } else {
          filteredCategories[item.category].push(item);
        }
      }
    });
    setCategoriesData(filteredCategories);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filteration();
  }, [currentPage, props.data, search, ProdCollection]);
  // console.log(ProdCollection)
  return (
    <>
      <Box className="lg:mt-[8rem]  mt-[9rem]">
        <Box
          sx={{ display: "flex", justifyContent: "space-between", mx: "2rem" }}
        >
          <Typography
            variant="p"
            className="lg:text-4xl text-2xl"
            color={"#475569"}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            All Products
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              id="outlined-basic"
              size="small"
              autoFocus
              label="Search"
              variant="outlined"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <Typography variant="p" mt={1} color={"red"}>
              {search ? `search results : ${search}` : ""}
            </Typography>
          </Box>
        </Box>
        {props.load || dbloader ? (
          <p className="flex justify-center place-items-center h-screen gap-2 text-2xl text-[#475569]">
            Loading... <Spinner className="h-10 w-10" color="blue-gray" />
          </p>
        ) : (
          Object.entries(categoriesData).map(([category, items]) => (
            <Box
              key={category}
              sx={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                mt: "2rem",
                justifyContent: "center",
              }}
              className={"lg:mx-[2rem] lg:gap-[1rem] gap-[2rem] "}
            >
              <Typography
                variant="p"
                className="lg:text-4xl text-center text-2xl my-[10rem] font-bold"
                color={"#475569"}
                sx={{ textDecoration: "underline" }}
              >
                {category}
              </Typography>
              <CategoryItems UprodId={prodId} items={items} />
            </Box>
          ))
        )}
      </Box>
      <Stack
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "5rem",
        }}
        spacing={2}
      >
        <Pagination
          color="secondary"
          sx={{ fontWeight: "900" }}
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          shape="rounded"
        />
      </Stack>
    </>
  );
};

const CategoryItems = ({ items, UprodId }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "3rem",
        mt: "3rem",
        mb: "3rem",
        justifyContent: "center",
        mx: "2rem",
      }}
    >
      {items.map((item, index) => (
        // console.log(item)
        <Box key={index}>
          <EcommerceCard
            UprodId={UprodId}
            id={item.id}
            img={item.thumbnail}
            title={item.title}
            desc={item.description}
            price={item.price}
          />
        </Box>
      ))}
    </Box>
  );
};

export default Index;
