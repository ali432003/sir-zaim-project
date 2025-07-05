import react from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    
    Button,
  } from "@material-tailwind/react";
import { Typography } from "@mui/material";
  import {useNavigate} from "react-router-dom"


  

  export default function EcommerceCard(props) {

    
    const navigate = useNavigate()
    return (
      <Card  onClick={()=>{navigate(`/product/${props.id?props.id:props.UprodId}`)}} className="lg:w-80 w-80 lg:h-80 bg-[#cbd5e1] hover:scale-105 cursor-pointer ease-in duration-300">
        <CardHeader shadow={false} floated={false} className="h-96">
          <img
            src={props.img}
            alt="card-image"
            className="h-full w-full object-cover"
          />
        </CardHeader>
        <CardBody>
          <div className="mb-2 flex items-center justify-between">
            <Typography color="blue-gray" variant="p" className="font-medium">
              {props.title}
            </Typography>
            <Typography color="blue-gray" variant="p" className="font-bold">
              {props.price + "$"}
            </Typography>
          </div>
          <Typography
            variant="small"
            color="gray"
            className="font-normal opacity-75"
          >
            {props.desc.slice(0,50) +"..."}
          </Typography>
        </CardBody>
        <CardFooter className="pt-0">
          <Button
            ripple={false}
            fullWidth={true}
            className="bg-[#64748b] text-white shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    );
  }