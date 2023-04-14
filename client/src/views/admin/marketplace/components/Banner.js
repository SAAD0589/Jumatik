import React from "react";
import { NavLink } from "react-router-dom";
import { MdAddToQueue } from "react-icons/md";
// Chakra imports
import { Button, Flex, Link, Text, Icon,Box } from "@chakra-ui/react";

// Assets
import banner from "assets/img/nfts/NftBanner1.png";

export default function Banner() {
  // Chakra Color Mode
  const user = localStorage.getItem('user-token');

  return (
    <Flex
      direction='column'
      bgImage={banner}
      bgSize='cover'
      py={{ base: "30px", md: "56px" }}
      px={{ base: "30px", md: "64px" }}
      borderRadius='30px' mb={5}>
      <Text
        fontSize={{ base: "24px", md: "34px" }}
        color='white'
        mb='14px'
        maxW={{
          base: "100%",
          md: "64%",
          lg: "46%",
          xl: "70%",
          "2xl": "50%",
          "3xl": "42%",
        }}
        fontWeight='700'
        lineHeight={{ base: "32px", md: "42px" }}>
JUMATIK votre  Marketplace 100% digitale      </Text>
      <Text
        fontSize='md'
        color='#E3DAFF'
        maxW={{
          base: "100%",
          md: "64%",
          lg: "40%",
          xl: "56%",
          "2xl": "46%",
          "3xl": "34%",
        }}
        fontWeight='500'
        mb='40px'
        lineHeight='28px'>
       Toutes vos transactions en toute sécurité et sans Intermédiaire
      </Text>
      <Box>
      <Button 
        alignContent="start"
          variant='action'
          fontWeight='regular'
          fontSize='sm'
          minW='250px'
          mx='auto'>
          <Icon as={MdAddToQueue} w='20px' h='20px' me='10px' /><NavLink to={user ? "/ad/createAd" : "/auth/sign-in"}>
          Ajouter une annonce</NavLink>
        </Button>
      </Box>
   
      
      
      </Flex>
  );
}
