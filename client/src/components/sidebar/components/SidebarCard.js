import {
  Button,
  Flex,
  Image,
  Link,
  Text,
  useColorModeValue,
  HStack,
  IconButton
} from "@chakra-ui/react";
import { FaAppStoreIos,FaGooglePlay } from 'react-icons/fa';


import { NavLink } from "react-router-dom";
import logoWhite from "../../../assets/img/layout/logoWhite.png";
import React from "react";

export default function SidebarDocs() {
  const bgColor = "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)";
  const borderColor = useColorModeValue("white", "navy.800");
 const user = localStorage.getItem('user-token');
  return (
    <Flex
      justify='center'
      direction='column'
      align='center'
      bg={bgColor}
      borderRadius='20px'
      me='20px'
      position='relative'>
      <Flex
        border='5px solid'
        borderColor={borderColor}
        bg='linear-gradient(135deg, #868CFF 0%, #4318FF 100%)'
        borderRadius='50%'
        w='94px'
        h='94px'
        align='center'
        justify='center'
        mx='auto'
        position='absolute'
        left='50%'
        top='-47px'
        transform='translate(-50%, 0%)'>
        <Image src={logoWhite} w='40px' h='40px' />
      </Flex>
      <Flex
        direction='column'
        align='center'
        justify='center'
        px='15px'
        pt='55px'>
        <Text
          fontSize={{ base: "lg", xl: "18px" }}
          color='white'
          fontWeight='bold'
          lineHeight='150%'
          textAlign='center'
          px='10px'
          mb='14px'>
         JUMATIK votre Marketplace 100% digitale

        </Text>
      
      </Flex>
   
   
    </Flex>
  );
}
