import React from "react";
import { Paper, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { Link } from "react-router-dom";
const exampleItems = [
  {
    image: "https://github.com/sujal0311/temp/blob/main/banner1final.png?raw=true",
    
  },
  {
    image: "https://github.com/sujal0311/temp/blob/main/bannernew1.png?raw=true",
    
  },
];

const Carouselcomp = () => {
  return (
    <Carousel
      animation="slide"
      indicators={false}
      timeout={500}
      navButtonsAlwaysVisible={true}
      navButtonsAlwaysInvisible={false}
      cycleNavigation={true}
      fullHeightHover={false}
      sx={{
        maxWidth: "100%",
        flexGrow: 1,
        mt: 2,
      }}
    >
      {exampleItems.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </Carousel>
  );
};

function Item(props) {
  return (
    <Paper
      sx={{
        position: "relative",
        backgroundColor: "grey.100",
        color: "#fff",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        overflow: "hidden", // To ensure content doesn't overflow
        height: {
           // Height for mobile screens (extra-small devices)
          sm: '40vh', // Height for small screens (small devices)
          md: '50vh', // Height for medium screens (tablets)
          lg: '60vh', // Height for large screens (desktops)
          xl: '70vh'  // Height for extra-large screens (large desktops)
        },
      }}
      elevation={10}
    >
     <Link to={'/'}> <img
        src={props.item.image}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover", // Ensures the image covers the entire height and width
        }}/></Link>
    
    </Paper>
  );
}

export default Carouselcomp;
