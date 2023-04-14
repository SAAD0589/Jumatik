// Chakra imports
import {
  Box,
  Flex,
  Icon,
  Progress,
  Text,
  useColorModeValue,
  Avatar,
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card.js';
import IconBox from 'components/icons/IconBox';
import Menu from 'components/menu/MainMenu';
// Assets
import { MdOutlineCloudDone } from 'react-icons/md';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {GiNightSleep} from "react-icons/gi";
export default function Followers(props) {
  const { currentUserId } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const brandColor2 = useColorModeValue('brand.800', 'white');
  const textColorSecondary = 'gray.400';
  const box = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const [followers, setFollowers] = useState([]);

  const fetchFollowers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/users/${currentUserId}/followers`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const followers = response.data;

      // Fetch user data for each follower and include the profile picture
      const followersWithUserData = await Promise.all(
        followers.map(async follower => {
          const userDataResponse = await axios.get(
            `${process.env.REACT_APP_API}/users/${follower._id}`
          );
          return {
            ...follower,
            userData: userDataResponse.data,
            profilePicture: userDataResponse.data.profilePicture, 
          };
        })
      );

      setFollowers(followersWithUserData);
      
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchFollowers();
  }, [currentUserId]);
  return (
    <Card mb={{ base: '0px', lg: '20px' }}>
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mt="10px"
        mb="4px"
      >
        Vos abonnés{' '}
      </Text>
      {followers.length !== 0 ? <Box w="100%" mt="10px">
        {' '}
        {followers.slice(0, 6).map(f => (
          <Flex key={f._id} mt={3}>
            <Avatar
              _hover={{ cursor: 'pointer' }}
              color="white"
              src={f.profilePicture}
              bg="#11047A"
              size="sm"
              w="40px"
              h="40px"
            />
            <Flex w="100%" ml={3} align="center">
              {' '}
              <Text fontWeight={500} fontSize="md">
                {' '}
                {f.userData.firstName + ' ' + f.userData.lastName}{' '}
              </Text>{' '}
            </Flex>{' '}
            <Flex alignItems='end'  w='100%' >
                                                  <Menu ms='auto' />
                                                </Flex> {' '}
          </Flex>
        ))}{' '}
      </Box> :    <Flex opacity='50%' m='auto' alignItems='center' flexDirection='column'>
  <Icon color={brandColor2} align='center' as={GiNightSleep} h='120px' w='120px' />
  <Text align='center' color={brandColor2} fontWeight="bold" fontSize="md" mt="10px" mb="4px">
  Aucun abonné pour le moment{' '}
  </Text>
</Flex>}
      
    </Card>
  );
}
