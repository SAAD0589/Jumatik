// Chakra imports
import {
  AvatarGroup,
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
  SimpleGrid
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card.js';
import React, { useState } from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { MdLocationOn, MdAccessTimeFilled } from 'react-icons/md';
// Assets
import { MdEdit } from 'react-icons/md';

export default function AdAsList(props) {
  const { title, category, link,bidders, price, image, dateCreated, city } = props;
  // Chakra Color Mode
  const [like, setLike] = useState(false);
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'gray.400';
  const brandColor = useColorModeValue('brand.500', 'white');
  const textColorBid = useColorModeValue("brand.500", "white");

  const bg = useColorModeValue('white', 'navy.800');
  return (
    <Card bg={bg} p="7px">
      <Box align="start" display='flex'>
        <Image h="160px" w="160px" src={image} borderRadius="8px" me="20px" />
        <Box mt={{ base: '10px', md: '0' }}>
          <Text color={brandColor} fontWeight="500" fontSize="2xl" mb="4px">
            {price}
          </Text>
          <Text color={brandColor} fontWeight="500" fontSize="md" >
            {title}
          </Text>
          <AvatarGroup mb="15px"
              max={3}
              color={textColorBid}
              size='sm'
              mt={{
                base: "0px",
                md: "10px",
                lg: "0px",
                xl: "10px",
                "2xl": "0px",
              }}
              fontSize='12px'>
              {bidders.map((avt, key) => (
                <Avatar key={key} src={avt} />
              ))}
            </AvatarGroup>
          <Text 
            fontWeight="500"
            color={textColorSecondary}
            fontSize="sm"
          
          >
            {category}
          </Text>
         <Box display='flex' >
         <Text mr={6} fontWeight='300' fontSize='sm' color='secondaryGray.600'>
             <Icon w={4} h={4} mr={1}   as={MdLocationOn} color='secondaryGray.600' />
               {city}
            </Text>
            <Text  fontWeight='200' fontSize='sm' color='secondaryGray.600'>
            <Icon w={4} h={4} mr={1}  as={MdAccessTimeFilled} color='secondaryGray.600' />
               {dateCreated}
            </Text>
         </Box>
        </Box>
      
        {/* <Button     
        me="16px"
          ms="auto"
          p="0px !important"
        
            bg='white'
            _hover={{ bg: "whiteAlpha.900" }}
            _active={{ bg: "white" }}
            _focus={{ bg: "white" }}
   
            top='10px'
            borderRadius='50%'
            minW='36px'
            h='36px'
            onClick={() => {
              setLike(!like);
            }}>
            <Icon
              transition='0.2s linear'
              w='20px'
              h='20px'
              as={like ? IoHeart : IoHeartOutline}
              color='brand.500'
            />
          </Button> */}
   
      </Box>
    </Card>
  );
}
