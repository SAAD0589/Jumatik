// Chakra imports
import { Text, useColorModeValue, Flex } from '@chakra-ui/react';
// Assets
import Project1 from 'assets/img/profile/Project1.png';
import Project2 from 'assets/img/profile/Project2.png';
import Project3 from 'assets/img/profile/Project3.png';
import axios from 'axios';
// Custom components
import Card from 'components/card/Card.js';
import React, { useState, useEffect } from 'react';
import HistoryItem from 'views/ads/adDetails/components/HistoryItem';
import Nft3 from 'assets/img/nfts/Nft3.png';

export default function Projects(props) {
  // Chakra Color Mode
  const userId = props;
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'gray.400';
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset'
  );

  const [ads, setAds] = useState([]);

  const fetchData = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_API}/ads/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(response => {
          setAds(response.data);
        });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [userId]);

  return (
    <Card mb={{ base: '0px', '2xl': '20px' }}>
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mt="10px"
        mb="4px"
      >
        Autre annonces{' '}
      </Text>
      {ads && ads.length > 0 ? (
        ads.map(ad => {
          return (
            <Flex key={ad._id}>
              <HistoryItem
                name={ad.name}
                author={ad.firstName + ' ' + ad.lastName}
                date="30s ago"
                image={
                  ad.adPictures[0] && Object.keys(ad.adPictures[0]).length
                    ? ad.adPictures[0]
                    : Nft3
                }                price={ad.price}
              />{' '}
            </Flex>
          );
        })
      ) : (
        <div> Loading... </div>
      )}{' '}
    </Card>
  );
}
