// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  Text,
  useColorModeValue,
  Button,
  Stack,
  Center,
} from '@chakra-ui/react';
import axios from 'axios';
import Card from 'components/card/Card.js';
import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import {
  MdPersonAdd,
  MdPhone,
  MdPersonAddDisabled,
  MdPersonSearch,
  MdSettings,
  MdLogout,
} from 'react-icons/md';

export default function Banner(props) {
  const { banner, avatar, name, job, posts, userId } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'gray.400';
  const borderColor = useColorModeValue(
    'white !important',
    '#111C44 !important'
  );
  const userData = localStorage.getItem('user-token');
  const currentUser = JSON.parse(userData);
  const [followersCount, setFollowersCount] = useState();
  const [followingCount, setFollowingCount] = useState();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const history = useHistory();
  const logout = e => {
    localStorage.removeItem('user-token');
    localStorage.removeItem('user-img');
    localStorage.removeItem('token');

    history.push('/auth/sign-in');
    history.go(0);
  };
  const updateProfile = e => {
    history.push('/register/updateUser');
    history.go(0);
  };

  const fetchFollowers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/users/${currentUser._id}/followers`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const followers = response.data;
      setFollowersCount(followers.length);

      setFollowers(followers);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, [currentUser._id]);
  const fetchFollowing = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/users/${currentUser._id}/following`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const following = response.data;
      setFollowingCount(following.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, [currentUser._id]);

  return (
    <Card mb={{ base: '0px', lg: '20px' }} align="center">
      <Box
        bg={`url(${banner})`}
        bgSize="cover"
        borderRadius="16px"
        h="131px"
        w="100%"
      />
      <Avatar
        mx="auto"
        src={avatar}
        h="87px"
        w="87px"
        mt="-43px"
        border="4px solid"
        borderColor={borderColor}
      />{' '}
      <Text color={textColorPrimary} fontWeight="bold" fontSize="xl" mt="10px">
        {' '}
        {name}{' '}
      </Text>{' '}
      <Text color={textColorSecondary} fontSize="sm">
        {' '}
        {job}{' '}
      </Text>{' '}
      <Center>
        <Stack align="center" direction={['column', 'row']} spacing="60px">
          <Box>
            <Flex mx="auto" direction="column">
              <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
                {' '}
                {posts}{' '}
              </Text>{' '}
              <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
                Annonces{' '}
              </Text>{' '}
            </Flex>{' '}
          </Box>{' '}
          <Box>
            <Flex mx="auto" direction="column">
              <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
                {' '}
                {followersCount ? followersCount : 0}{' '}
              </Text>{' '}
              <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
                Abonnés{' '}
              </Text>{' '}
            </Flex>{' '}
          </Box>{' '}
          <Box>
            <Flex mx="auto" direction="column">
              <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
                {' '}
                {followingCount ? followingCount : 0}{' '}
              </Text>{' '}
              <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
                Abonnements{' '}
              </Text>{' '}
            </Flex>{' '}
          </Box>{' '}
        </Stack>{' '}
      </Center>{' '}
      <Stack mt={3} p={1}>
        <Button
          onClick={updateProfile}
          leftIcon={<MdSettings />}
          variant="darkBrand"
          fontWeight="regular"
          fontSize="md"
          minW="100%"
          mx="auto"
        >
          Modifier mon profile{' '}
        </Button>{' '}
        <Button
          leftIcon={<MdLogout />}
          variant="solid"
          colorScheme="red"
          fontWeight="regular"
          fontSize="md"
          minW="100%"
          mx="auto"
          onClick={logout}
        >
          Se déconnecter{' '}
        </Button>{' '}
      </Stack>{' '}
    </Card>
  );
}
