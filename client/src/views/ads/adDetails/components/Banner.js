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
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { io } from 'socket.io-client';

import {
  MdPersonAdd,
  MdPhone,
  MdPersonAddDisabled,
  MdPersonSearch,
  MdSettings,
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
  const [followersFlag, setFollowersFlag] = useState(false);
  const [followingCount, setFollowingCount] = useState();
  const [followers, setFollowers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const socket = useRef(io(process.env.REACT_APP_SOCKET));
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(() => {
    const storedFollowStatus = localStorage.getItem('followStatus');
    return storedFollowStatus ? JSON.parse(storedFollowStatus) : false;
  });
  const notification = {
    recipient: userId, // replace with actual recipient ID
    sender: currentUser?._id, // replace with actual sender ID
    message: `${currentUser?.firstName} ${currentUser?.lastName}, vous suit.`,
    type: 'new_follower', // specify the type of notification
  };
  const history = useHistory();
  socket.current = io(process.env.REACT_APP_SOCKET);
  const updateProfile = e => {
    history.push('/register/updateUser');
   
  };
  const handleFollow = async () => {
    if (currentUser) {
      currentUser?.following.forEach(following => {
        if (following._id === userId) {
          setFollowersFlag(true);
        }
      });
      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_API}/users/follow/${currentUser?._id}/${userId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const followersUserId = response.data;

        history.go(0);
      } catch (error) {
        console.error(error);
      }
      if (!followers.some(follower => follower._id === currentUser?._id)) {
        // only send notification when following
        socket.current.emit('sendNotification', notification);
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API}/notifications`,
            notification,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          const newNotification = response.data;
          setNotifications(newNotification);
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      history.push('/auth/login');
    }
  };
  const handleUnfollow = async () => {
    if (currentUser) {
      const newFollowStatus = !isFollowing;
      setIsFollowing(newFollowStatus);
      localStorage.setItem('followStatus', JSON.stringify(newFollowStatus));

      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_API}/users/follow/${currentUser?._id}/${userId}`,
          null,

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        const updatedAd = response.data;

        history.go(0);
      } catch (error) {
        console.error(error);
      }
    } else {
      history.push('/auth/login');
    }
  };
  const fetchFollowers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/users/${userId}/followers`
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
  }, [userId]);
  const fetchFollowing = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/users/${userId}/following`
      );
      const following = response.data;
      setFollowingCount(following.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, [userId]);

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
      />
      <Text color={textColorPrimary} fontWeight="bold" fontSize="xl" mt="10px">
        {name}
      </Text>
      <Text color={textColorSecondary} fontSize="sm">
        {job}
      </Text>
      <Center>
        <Stack align="center" direction={['column', 'row']} spacing="60px">
          <Box>
            <Flex mx="auto" direction="column">
              <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
                {posts}
              </Text>
              <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
                Annonces
              </Text>
            </Flex>
          </Box>
          <Box>
            <Flex mx="auto" direction="column">
              <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
                {followersCount ? followersCount : 0}
              </Text>
              <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
                Abonnes
              </Text>
            </Flex>
          </Box>
          <Box>
            <Flex mx="auto" direction="column">
              <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
                {followingCount ? followingCount : 0}
              </Text>
              <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
                Abonnements
              </Text>
            </Flex>
          </Box>
        </Stack>
      </Center>
      {currentUser?._id === userId ? (
        <Stack mt={3} p={1}>
        <NavLink to='/admin/profile' > <Button
            leftIcon={<MdPersonSearch />}
            variant="action"
            fontWeight="regular"
            fontSize="md"
            minW="100%"
            mx="auto"
          >
            Afficher mon profile
          </Button></NavLink>
         
          <Button
            leftIcon={<MdSettings />}
            variant="action"
            fontWeight="regular"
            fontSize="md"
            minW="100%"
            mx="auto"
            onClick={updateProfile}
          >
            Modifier mon profile
          </Button>
        </Stack>
      ) : (
        <Stack mt={3} p={1}>
          {followers.some(follower => follower._id === currentUser?._id) ? (
            <Button
              leftIcon={<MdPersonAddDisabled />}
              variant="solid"
              colorScheme="red"
              fontWeight="regular"
              fontSize="md"
              minW="100%"
              mx="auto"
              onClick={handleFollow}
            >
              Se désabonner
            </Button>
          ) : (
            <Button
              leftIcon={<MdPersonAdd />}
              variant="solid"
              colorScheme="green"
              fontWeight="regular"
              fontSize="md"
              minW="100%"
              mx="auto"
              onClick={handleFollow}
            >
              S'abonner
            </Button>
          )}

          <Button
            leftIcon={<MdPhone />}
            variant="action"
            fontWeight="regular"
            fontSize="md"
            minW="100%"
            mx="auto"
            onClick={() => {
    window.location.href = `tel:${job}`; // replace +1234567890 with the phone number you want to call
  }}

          >
            Appeler
          </Button>
        </Stack>
      )}
    </Card>
  );
}
