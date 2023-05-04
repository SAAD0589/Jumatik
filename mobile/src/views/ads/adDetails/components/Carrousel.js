// Chakra imports
import {
    Box,
    Flex,
    Icon,
    Progress,
    Text,
    useColorModeValue,
    IconButton, useBreakpointValue,
    Image,
  } from "@chakra-ui/react";
  // Custom components
  import Card from "components/card/Card.js";
  import IconBox from "components/icons/IconBox";
  import Menu from "components/menu/MainMenu";
  import React from "react";
  import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
// And react-slick as our Carousel Lib
  import Slider from 'react-slick';
  // Assets
  import { MdOutlineCloudDone } from "react-icons/md";
  const settings = {
    dots: true,
    arrowss: false,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  export default function Carousel(props) {
    
    const  Pictures  = props;
    // Chakra Color Mode
    const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
    const brandColor = useColorModeValue("brand.500", "white");
    const textColorSecondary = "gray.400";
    const box = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const [slider, setSlider] = React.useState<Slider | null>(null);
    const top = useBreakpointValue({ base: '90%', md: '50%' });
  const side = useBreakpointValue({ base: '30%', md: '10px' });
    return (
      <Card mb={{ base: "0px", lg: "20px" }} align='center'>
      
        <Box w='100%' mt='auto'>
          <Flex w='100%' justify='space-between' mb='10px'>
          <Box
      position={'relative'}
      height={'600px'}
      width={'full'}
      overflow={'hidden'}>
      {/* CSS files for react-slick */}
      <link
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      {/* Left Icon */}
      <IconButton
        aria-label="left-arrow"
        colorScheme="messenger"
        borderRadius="full"
        position="absolute"
        left={side}
        top={top}
        transform={'translate(0%, -50%)'}
        zIndex={2}
        onClick={() => slider?.slickPrev()}>
        <BiLeftArrowAlt />
      </IconButton>
      {/* Right Icon */}
      <IconButton
        aria-label="right-arrow"
        colorScheme="messenger"
        borderRadius="full"
        position="absolute"
        right={side}
        top={top}
        transform={'translate(0%, -50%)'}
        zIndex={2}
        onClick={() => slider?.slickNext()}>
        <BiRightArrowAlt />
      </IconButton>
      {/* Slider */}
      <Slider {...settings} ref={(slider) => setSlider(slider)}>
        { 
          
          Pictures?.map((picture, index) => (
          <Image src={picture} alt={index} />
        ))}
      </Slider>
    </Box>
          </Flex>
       
        </Box>
      </Card>
    );
  }
  