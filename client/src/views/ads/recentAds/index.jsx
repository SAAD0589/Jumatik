import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import axios from 'axios';
// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  Link,
  Text,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';

// Custom components
import Banner from 'views/admin/marketplace/components/Banner';
import TableTopCreators from 'views/admin/marketplace/components/TableTopCreators';
import HistoryItem from 'views/admin/marketplace/components/HistoryItem';
import NFT from 'components/card/NFT';
import Card from 'components/card/Card.js';

// Assets
import Nft1 from 'assets/img/nfts/Nft1.png';
import Nft2 from 'assets/img/nfts/Nft2.png';
import Nft3 from 'assets/img/nfts/Nft3.png';
import Nft4 from 'assets/img/nfts/Nft4.png';
import Nft5 from 'assets/img/nfts/Nft5.png';
import Nft6 from 'assets/img/nfts/Nft6.png';
import Avatar1 from 'assets/img/avatars/avatar1.png';
import Avatar2 from 'assets/img/avatars/avatar2.png';
import Avatar3 from 'assets/img/avatars/avatar3.png';
import Avatar4 from 'assets/img/avatars/avatar4.png';
import { AiOutlineIdcard, AiOutlineOrderedList } from 'react-icons/ai';

import tableDataTopCreators from 'views/admin/marketplace/variables/tableDataTopCreators.json';
import { tableColumnsTopCreators } from 'views/admin/marketplace/variables/tableColumnsTopCreators';
import AdAsList from 'views/ads/recentAds/components/AdAsList';

export default function RecentAds() {
  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const [ads, setAds] = useState([]);
  const [SelectedAd, setSelectedAd] = useState([]);
  const history = useHistory();
  const [showLList, setshowList] = useState(false);
  const [showCard, setshowCard] = useState(true);
  const getAdById = async id => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/ads/ad/${id}`);
      setSelectedAd(response.data);

      history.push(`/ads/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAds = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/ads`);
      setAds(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <Box pt={{ base: '120px', md: '80px', xl: '30px' }}>
      {' '}
      {/* Main Fields */}{' '}
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
        gap={{ base: '20px', xl: '20px' }}
        display={{ base: 'block', xl: 'grid' }}
      >
        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 1 / 1 / 3', '2xl': '1 / 1 / 2 / 2' }}
        >
          <Card mb={5}>
            <Flex>
              <Button
                mr={5}
                w={100}
                h={10}
                borderRadius={20}
                leftIcon={<AiOutlineIdcard />}
                colorScheme="teal"
                variant="solid"
                onClick={() => [setshowCard(true), setshowList(false)]}
              >
                Cartes{' '}
              </Button>{' '}
              <Button
                w={100}
                h={10}
                borderRadius={20}
                leftIcon={<AiOutlineOrderedList />}
                colorScheme="pink"
                variant="solid"
                onClick={() => [setshowCard(false), setshowList(true)]}
              >
                Listes{' '}
              </Button>{' '}
            </Flex>{' '}
          </Card>
          <Flex direction="column">
            {' '}
            {showLList && ads && ads.length > 0
              ? ads.map(ad => {
                  const handleClick = () => {
                    getAdById(ad._id); // Get the ad by its id when the component is clicked
                  };
                  
                  return (
                    <Flex
                      mb={5}
                      key={ad._id}
                      onClick={handleClick}
                      cursor="pointer"
                    >
                      <AdAsList
                        title={ad.name}
                        category={ad.categoryLabel}
                        //link={ad.name}
                        price= {ad.price === "Non défini" ? "Non défini " : ad.price + " MAD"}
                        image={ ad.adPictures[0] && Object.keys(ad.adPictures[0]).length ? ad.adPictures[0] : Nft3}
                        city={ad.city}
                        bidders={[
                          Avatar1,
                          Avatar2,
                          Avatar3,
                          Avatar4,
                          Avatar1,
                          Avatar1,
                          Avatar1,
                          Avatar1,
                        ]}
                        dateCreated={
                          new Date() - new Date(ad.createdAt) >= 86400000
                            ? `${Math.floor(
                                (new Date() - new Date(ad.createdAt)) /
                                  1000 /
                                  60 /
                                  60 /
                                  24
                              )} Jours`
                            : `${Math.floor(
                                (new Date() - new Date(ad.createdAt)) /
                                  1000 /
                                  60 /
                                  60
                              )} Heures`
                        }
                      />{' '}
                    </Flex>
                  );
                })
              : null}{' '}
            {showCard && (
              <SimpleGrid
                columns={{ base: 1, md: 2 }}
                gap="20px"
                mb={{ base: '20px', xl: '0px' }}
              >
                {' '}
                {ads && ads.length > 0
                  ? ads.map(ad => {
                      const handleClick = () => {
                        getAdById(ad._id); // Get the ad by its id when the component is clicked
                      };
                      
                      return (
                        <Flex key={ad._id}>
                          <NFT
                            name={ad.name}
                            author={ad.firstName + ' ' + ad.lastName}
                            bidders={[
                              Avatar1,
                              Avatar2,
                              Avatar3,
                              Avatar4,
                              Avatar1,
                              Avatar1,
                              Avatar1,
                              Avatar1,
                            ]}
                            image={ ad.adPictures[0] && Object.keys(ad.adPictures[0]).length ? ad.adPictures[0] : Nft3}
                            category={ad.categoryLabel}
                                               currentbid={ad.price === "Non défini" ? "Non défini " : ad.price + " MAD"}

                            Click={handleClick}
                            city={ad.city}
                            dateCreated={
                              new Date() - new Date(ad.createdAt) >= 86400000
                                ? `${Math.floor(
                                    (new Date() - new Date(ad.createdAt)) /
                                      1000 /
                                      60 /
                                      60 /
                                      24
                                  )} Jours`
                                : `${Math.floor(
                                    (new Date() - new Date(ad.createdAt)) /
                                      1000 /
                                      60 /
                                      60
                                  )} Heures`
                            }
                          />{' '}
                        </Flex>
                      );
                    })
                  : null}{' '}
              </SimpleGrid>
            )}{' '}
          </Flex>{' '}
        </Flex>{' '}
        {/* <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}
        >
          <Card
            w={{ base: '100%', xl: '25%' }}
            p="0px"
            mb="20px"
            position={{ base: 'relative', xl: 'fixed' }}
          >
            <Flex
              align={{ sm: 'flex-start', lg: 'center' }}
              justify="space-between"
              w="100%"
              px="22px"
              py="18px"
            >
              <Text color={textColor} fontSize="xl" fontWeight="600">
                Sponsorisées{' '}
              </Text>{' '}
              <Button variant="action"> Voir plus </Button>{' '}
            </Flex>

            <HistoryItem
              name="Annonce sponsorise 1"
              author="achraf ait beni ifit"
              image={Nft5}
              price="1000 MAD"
            />
            <HistoryItem
              name="Annonce sponsorise 1"
              author="achraf ait beni ifit"
              image={Nft5}
              price="1000 MAD"
            />
            <HistoryItem
              name="Annonce sponsorise 1"
              author="achraf ait beni ifit"
              image={Nft5}
              price="1000 MAD"
            />
            <HistoryItem
              name="Annonce sponsorise 1"
              author="achraf ait beni ifit"
              image={Nft5}
              price="1000 MAD"
            />
          </Card>{' '}
        </Flex>{' '} */}
      </Grid>{' '}
     
    </Box>
  );
}
