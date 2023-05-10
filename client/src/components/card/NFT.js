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
  SimpleGrid,
} from '@chakra-ui/react';
// Custom components
import { NavLink, useHistory } from 'react-router-dom';

import Card from 'components/card/Card.js';
// Assets
import React, { useState, useEffect } from 'react';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { MdLocationOn, MdAccessTimeFilled } from 'react-icons/md';
import axios from 'axios';

export default function NFT(props) {
  const {
    image,
    name,
    author,
    bidders,
    category,
    Click,
    currentbid,
    city,
    dateCreated,
    id,
    userId,
    status,
  } = props;
  const [like, setLike] = useState({});
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorBid = useColorModeValue('brand.500', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const currentUser = localStorage.getItem('user-token');
  const history = useHistory();
  const handleLike = async () => {
    if (currentUser) {
      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_API}/ads/${id}/like`,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        const updatedAd = response.data;
      } catch (error) {
        console.error(error);
      }
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/ads/${id}/like`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        const likes = response.data;

        // const values = Object.values(likes);
        // const hasLiked = likes.includes(currentUser._id);
        // setLike(hasLiked);
      } catch (error) {
        console.error(error);
      }
    } else history.push('/auth/login');
  };

  return (
    <Card>
      <Flex direction={{ base: 'column' }}>
        <Box align="center"  >
          <Image
            src={image}
            boxSize='250px'
    objectFit='cover'
            borderRadius="10px"
          />{' '}
        </Box>{' '}
        <Box mt={4} align="start" h="100%" onClick={Click} cursor="pointer">
          <Flex
            justify="space-between"
            direction={{
              base: 'row',
              md: 'column',
              lg: 'row',
              xl: 'column',
              '2xl': 'row',
            }}
            mb="auto"
          >
            <Flex direction="column" align="flex-start">
              <Text color={brandColor} fontWeight="500" fontSize="2xl" mb="4px">
                {' '}
                {currentbid}{' '}
              </Text>{' '}
              <Text
                color={textColor}
                fontSize={{
                  base: 'lg',
                  md: 'lg',
                  lg: 'lg',
                  xl: 'md',
                  '2xl': 'md',
                  '3xl': 'lg',
                }}
                mb="5px"
                fontWeight="bold"
                me="14px"
              >
                {' '}
                {name}{' '}
              </Text>{' '}
              <Text
                color="secondaryGray.600"
                fontSize={{
                  base: 'sm',
                }}
                fontWeight="400"
                me="14px"
              >
                {' '}
                {category}{' '}
              </Text>{' '}
            </Flex>{' '}
            {/* <AvatarGroup
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
                                             */}{' '}
          </Flex>{' '}
          <Flex display="flex" flexDirection="row">
            <Flex
              mr={5}
              align="start"
              justify="end"
              direction={{
                base: 'column',
                md: 'column',
                lg: 'column',
                xl: 'column',
                '2xl': 'column',
              }}
            >
              <Text fontWeight="300" fontSize="sm" color="secondaryGray.600">
                <Icon
                  w={4}
                  h={4}
                  mr={1}
                  as={MdLocationOn}
                  color="secondaryGray.600"
                />{' '}
                {city}{' '}
              </Text>{' '}
            </Flex>{' '}
            <Flex
              align="end"
              justify="center"
              direction={{
                base: 'column',
                md: 'column',
                lg: 'column',
                xl: 'column',
                '2xl': 'column',
              }}
              mt="25px"
            >
              <Text fontWeight="200" fontSize="sm" color="secondaryGray.600">
                <Icon
                  w={4}
                  h={4}
                  mr={1}
                  as={MdAccessTimeFilled}
                  color="secondaryGray.600"
                />
                Il y a {dateCreated}{' '}
              </Text>{' '}
            </Flex>{' '}
          </Flex>{' '}
        </Box>{' '}
      </Flex>{' '}
    </Card>
  );
}
