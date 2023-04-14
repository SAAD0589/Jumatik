import React from "react";

// Chakra imports
import { Flex, Img } from "@chakra-ui/react";

// Custom components
import Dark from "../../../assets/img/auth/logo-dark.png"
export function SidebarBrand() {
  //   Chakra color mode

  return (
    <Flex align='center' direction='column'>
    
 
  <Img
    maxW={250}
    src={Dark}
    alt="Marketplace 100% digitale"
  />
    </Flex>
  );
}

export default SidebarBrand;
