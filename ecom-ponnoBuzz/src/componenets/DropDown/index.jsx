import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { ToastAlert } from "../../utils/toast";
import { Spinner } from "@material-tailwind/react";

const Index = () => {
  const [cate, setCate] = useState([]);
  const [load, setLoad] = useState(false);

  const fetchApiCate = () => {
    setLoad(true);
    axios
      .get("https://dummyjson.com/products/categories?limit=100")
      .then((res) => {
        // console.log("Fetched categories:", res.data);
        setCate(res.data);
        setLoad(false);
      })
      .catch((error) => {
        setLoad(false);
        ToastAlert(error.code, "error");
      });
  };

  useEffect(() => {
    fetchApiCate();
  }, []);

  const filterCategories = (filterFn) => {
    const filtered = cate.filter((category) => {
      if (typeof category.slug !== "string") {
        console.warn("Non-string slug found:", category);
        return false;
      }
      return filterFn(category.slug);
    });
    // console.log("Filtered categories:", filtered);
    return filtered;
  };

  const menCategories = filterCategories(
    (slug) => slug.includes("mens") && !slug.includes("womens")
  );

  const womenCategories = filterCategories(
    (slug) => slug.includes("womens") && slug.includes("mens")
  );

  const cosmetics = filterCategories(
    (slug) => slug.includes("fragrances") || slug.includes("skincare")
  );

  const electronics = filterCategories(
    (slug) => slug.includes("smartphones") || slug.includes("laptops")
  );

  const vehicles = filterCategories(
    (slug) => slug.includes("automotive") || slug.includes("motorcycle")
  );

  const furniture = filterCategories(
    (slug) => slug.includes("furniture") || slug.includes("home-decoration")
  );

  const accessories = filterCategories(
    (slug) => slug.includes("sunglasses") || slug.includes("groceries") || slug.includes("lighting")
  );

  const renderCategoryList = (categories) => {
    return (
      <ul>
        {!load ? (
          categories.map((category, index) => (
            <li
              className="text-[15px] px-2 cursor-pointer hover:bg-[#e2e8f0] rounded-lg hover:text-[black]"
              key={index}
            >
              {category.name}
            </li>
          ))
        ) : (
          <p className="flex justify-center place-items-center text-white gap-2 text-[#475569]">
            Loading... <Spinner color="blue-gray" />
          </p>
        )}
      </ul>
    );
  };

  return (
    <div className="mt-[5.5rem] max-w-screen hidden lg:block">
      <ul className="flex lg:flex-row flex-col w-auto bg-[#cbd5e1] py-2 justify-evenly mx-auto list-none">
        <Tooltip
          arrow
          placement="bottom"
          className="text-[#334155] px-4 py-3 cursor-pointer"
          title={renderCategoryList(menCategories)}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <Typography
            as="li"
            variant="medium"
            color="black"
            className="flex cursor-pointer justify-center gap-x-2 p-1 font-medium w-screen"
          >
            <a className="flex max-w-screen items-center">Men</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </Typography>
        </Tooltip>

        <Tooltip
          arrow
          placement="bottom"
          className="text-[#334155] px-4 py-3 cursor-pointer"
          title={renderCategoryList(womenCategories)}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <Typography
            as="li"
            variant="medium"
            color="black"
            className="flex justify-center items-center gap-x-2 p-1 font-medium w-screen"
          >
            <a className="flex items-center">Women</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </Typography>
        </Tooltip>

        <Tooltip
          arrow
          placement="bottom"
          className="text-[#334155] px-4 py-3 cursor-pointer"
          title={renderCategoryList(electronics)}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <Typography
            as="li"
            variant="medium"
            color="black"
            className="flex justify-center items-center gap-x-2 p-1 font-medium w-screen"
          >
            <a className="flex items-center">Electronics</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </Typography>
        </Tooltip>

        <Tooltip
          arrow
          placement="bottom"
          className="text-[#334155] px-4 py-3 cursor-pointer"
          title={renderCategoryList(furniture)}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <Typography
            as="li"
            variant="medium"
            color="black"
            className="flex justify-center items-center gap-x-2 p-1 font-medium w-screen"
          >
            <a className="flex items-center">Furniture</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </Typography>
        </Tooltip>

        <Tooltip
          arrow
          placement="bottom"
          className="text-[#334155] px-4 py-3 cursor-pointer"
          title={renderCategoryList(cosmetics)}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <Typography
            as="li"
            variant="medium"
            color="black"
            className="flex justify-center items-center gap-x-2 p-1 font-medium w-screen"
          >
            <a className="flex items-center">Cosmetics</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </Typography>
        </Tooltip>

        <Tooltip
          arrow
          placement="bottom"
          className="text-[#334155] px-4 py-3 cursor-pointer"
          title={renderCategoryList(vehicles)}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <Typography
            as="li"
            variant="medium"
            color="black"
            className="flex justify-center items-center gap-x-2 p-1 font-medium w-screen"
          >
            <a className="flex items-center">Vehicles</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </Typography>
        </Tooltip>

        <Tooltip
          arrow
          placement="bottom"
          className="text-[#334155] px-4 py-3 cursor-pointer"
          title={renderCategoryList(accessories)}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <Typography
            as="li"
            variant="medium"
            color="black"
            className="flex justify-center items-center gap-x-2 p-1 font-medium w-screen"
          >
            <a className="flex items-center">Accessories</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </Typography>
        </Tooltip>
      </ul>
    </div>
  );
};

export default Index;
