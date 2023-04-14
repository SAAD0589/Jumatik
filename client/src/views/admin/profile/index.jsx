import { Box, Grid } from '@chakra-ui/react';

// Custom components
import Banner from 'views/admin/profile/components/Banner';
import General from 'views/admin/profile/components/General';
import Notifications from 'views/admin/profile/components/Notifications';
import Projects from 'views/admin/profile/components/Projects';
import Storage from 'views/admin/profile/components/Storage';
import Upload from 'views/admin/profile/components/Upload';
import Followers from 'views/admin/profile/components/Followers';
import Following from 'views/admin/profile/components/Following';

// Assets
import banner from 'assets/img/auth/banner.png';
import avatar from 'assets/img/avatars/avatar4.png';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const user = JSON.parse(localStorage.getItem('user-token'));

export default function Overview() {
  const [count, setCount] = useState([]);
  const userData = localStorage.getItem('user-token');
  const currentUser = JSON.parse(userData);
  const [followersCount, setFollowersCount] = useState();
  const [followingCount, setFollowingCount] = useState();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  // const fetchFollowers = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API}/users/${currentUser._id}/followers`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     );
  //     const followers = response.data;
  //     setFollowersCount(followers.length);

  //     setFollowers(followers);
  //
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchFollowers();
  // }, [currentUser._id]);
  // const fetchFollowing = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API}/users/${currentUser._id}/following`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     );
  //     const following = response.data;
  //     setFollowingCount(following.length);
  //
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchFollowing();
  // }, [currentUser._id]);

  const fetchUserAds = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/ads/${currentUser._id}/count`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setCount(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserAds();
  }, []);
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {' '}
      {/* Main Fields */}{' '}
      <Grid
        templateColumns={{
          base: '1fr',
          lg: '1.5fr 1.25fr 1.25fr',
        }}
        templateRows={{
          base: 'repeat(3, 1fr)',
          lg: '1fr',
        }}
        gap={{ base: '20px', xl: '20px' }}
      >
        <Banner
          gridArea="1 / 1 / 1 / 2"
          banner={banner}
          avatar={user.profilePicture}
          name={user.firstName + ' ' + user.lastName}
          job={user.email}
          posts={count.adCount}
          followers="9.7k"
        />
        <Followers
          gridArea={{ base: '2 / 1 / 3 / 2', lg: '1 / 2 / 2 / 3' }}
          currentUserId={currentUser._id}
        />{' '}
        {/* <Storage
                                  gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
                                  used={25}
                                  total={50}
                                /> */}{' '}
        <Following
          gridArea={{
            base: '3 / 1 / 4 / 2',
            lg: '1 / 3 / 2 / 4',
          }}
          currentUserId={currentUser._id}
        />{' '}
      </Grid>{' '}
      <Projects
        gridArea="1 / 2 / 2 / 2"
        banner={banner}
        avatar={avatar}
        name="Adela Parkson"
        job="Product Designer"
        posts="17"
        followers="9.7k"
        following="274"
      />
    </Box>
  );
}
