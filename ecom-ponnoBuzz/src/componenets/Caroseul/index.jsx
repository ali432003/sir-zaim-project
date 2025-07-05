import { useState, useEffect } from "react";
import { Carousel } from "@material-tailwind/react";
import Typography from "@mui/material/Typography";

import CircularProgress from "@mui/material/CircularProgress";

export function CarouselCustomNavigation(props) {
  const [isCarouselLoading, setIsCarouselLoading] = useState(true);

  // Simulating loading delay for demonstration purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCarouselLoading(false);
    }, 4000); // Set loading time in milliseconds

    return () => clearTimeout(timer);
  }, [props.slicedData]);

  return (
    <>
      <Carousel
        autoplay={true}
        autoplayDelay={5000}
        loop={true}
        //   transition
        className="rounded h-[25rem]"
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                  activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      >
        <img
          src="/banner/img1.jpg"
          alt="image 1"
          className="h-full w-full object-cover"
        />
        <img
          src="/banner/img2.jpg"
          alt="image 2"
          className="h-full w-full object-cover"
        />
        <img
          src="/banner/img3.jpg"
          alt="image 3"
          className="h-full w-full object-cover"
        />
        <img
          src="/banner/img4.jpg"
          alt="image 3"
          className="h-full w-full object-cover"
        />
        <img
          src="/banner/img5.jpg"
          alt="image 3"
          className="h-full w-full object-cover"
        />
      </Carousel>
    </>
  );
}
