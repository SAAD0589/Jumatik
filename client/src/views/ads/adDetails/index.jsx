import {
  Box,
  Grid,
  Flex,
  Icon,
  Progress,
  Text,
  useColorModeValue,
  IconButton,
  useBreakpointValue,
  Image,
  Avatar,
  Center,
  SimpleGrid,
} from '@chakra-ui/react';
import Card from 'components/card/Card.js';
import { NavLink, useHistory } from 'react-router-dom';
// Custom components
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import Banner from 'views/ads/adDetails/components/Banner';
import Carrousel from 'views/ads/adDetails/components/Carrousel';
import General from 'views/admin/profile/components/General';
import Notifications from 'views/admin/profile/components/Notifications';
import Projects from 'views/admin/profile/components/Projects';
import Storage from 'views/admin/profile/components/Storage';
import Description from 'views/ads/adDetails/components/Description';
import AdAsList from 'views/ads/adDetails/components/AdAsList';
import HistoryItem from 'views/ads/adDetails/components/HistoryItem';
import { useParams } from 'react-router-dom';
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
import banner from 'assets/img/auth/banner.png';
import avatar from 'assets/img/avatars/avatar4.png';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import NFT from 'components/card/NFT';
import { t } from 'helpers/TransWrapper';

function AdDetails() {
  const { id } = useParams();
  const [count, setCount] = useState([]);
  const [SelectedAd, setSelectedAd] = useState([]);

  const [currentAd, setAd] = useState([]);
  const [selectedImage, setSelectedImage] = useState();
  const [customFieldsValues, setCustomFieldsValues] = useState([]);
  const [subCustomFieldsValues, setSubCustomFieldsValues] = useState([]);
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const history = useHistory();
  const settings = {
    dots: true,
    arrows: false,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const [slider, setSlider] = React.useState();
  const top = useBreakpointValue({ base: '50%', md: '50%' });
  const side = useBreakpointValue({ base: '0%', md: '0px' });
  const getAdById = async id => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/ads/ad/${id}`
      );
      setSelectedAd(response.data);

      history.push(`/ads/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_API}/ads/ad/${id}`)
        .then(response => {
          setAd(response.data);
        });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);
  const fetchCustomFieldsValues = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_API}/customFieldsValues/get/ad/${id}`)
        .then(response => {
          setCustomFieldsValues(response.data);
        });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCustomFieldsValues();
  }, [id]);
  const fetchSubCustomFieldsValues = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_API}/subCustomFieldsValues/get/ad/${id}`)
        .then(response => {
          setSubCustomFieldsValues(response.data);
        });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchSubCustomFieldsValues();
  }, [id]);

  const fetchUserAdsCount = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/ads/${currentAd.userId}/count`,
        {}
      );
      setCount(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserAdsCount();
  }, [currentAd]);
  const [userAds, setUserAds] = useState([]);

  const fetchUserAds = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_API}/ads/${currentAd.userId}`, {})
        .then(response => {
          setUserAds(response.data);
        });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchUserAds();
  }, [currentAd.userId]);

  //   let ImgData;
  // for (let i = 0; i < currentAd.adPictures.length; i++) {
  //    ImgData = currentAd.adPictures[i];

  // }
  //

  console.log(customFieldsValues);

  const date = new Date(currentAd.createdAt);
  const formattedDate = date.toLocaleDateString();

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '20px' }}>
      {/* Main Fields */}

      <Grid
        mb="20px"
        templateColumns={{
          base: '1fr',
          lg: 'repeat(2, 1fr)',
          '3xl': '1fr 1fr',
        }}
        templateRows={{
          base: '1fr',
          lg: 'repeat(1, 1fr)',
          '2xl': '1fr',
        }}
        gap={{ base: '20px', xl: '20px' }}
      >
        <Card
          mb={{ base: '20px', lg: '20px' }}
          align="start"
         
          flexGrow={1}
          flexShrink={1}
          minH="50%"
        >

          {currentAd.adPictures?.every(
            picture => Object.keys(picture).length === 0
          ) ?     <Box align="center"  >
          <Image
            src={Nft3}
            boxSize='400px'
    objectFit='cover'
            borderRadius="20px"
          />{' '}
        </Box> : (
            <Box
              position={'relative'}
              height={'full'}
              width={'full'}
              overflow={'hidden'}
            >
              {/* CSS files for react-slick */}
              <link
                rel="stylesheet"
                type="text/css"
                charSet="UTF-8"
                href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
              />
              <link
                rel="stylesheet"
                type="text/css"
                href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
              />
              {/* Left Icon */}
              <IconButton
                aria-label="left-arrow"
                colorScheme="messenger"
                borderRadius="full"
                position="absolute"
                left={side}
                top={top}
                transform={'translate(0%, -50%)'}
                zIndex={2}
                onClick={() => slider?.slickPrev()}
              >
                <BiLeftArrowAlt />
              </IconButton>
              {/* Right Icon */}
              <IconButton
                aria-label="right-arrow"
                colorScheme="messenger"
                borderRadius="full"
                position="absolute"
                right={side}
                top={top}
                transform={'translate(0%, -50%)'}
                zIndex={2}
                onClick={() => slider?.slickNext()}
              >
                <BiRightArrowAlt />
              </IconButton>
              {/* Slider */}
              <Slider {...settings} ref={slider => setSlider(slider)}>
                {' '}
                {currentAd.adPictures?.map((picture, index) => (
                  <Box key={index} align="center">
                    <Image
                      borderRadius="20px"
                      p={1}
                      boxSize="400px"
                      objectFit="fit"
                      id={index}
                      src={picture}
                      alt={picture}
                      onClick={() => setSelectedImage(picture)}
                      cursor="pointer"
                    />
                  </Box>
                ))}{' '}
              </Slider>
            </Box>
          )}
        </Card>
        <Banner
          gridArea="1 / 2 / 2 / 2"
          banner={banner}
          avatar={currentAd.userProfilePicture}
          name={currentAd.firstName + ' ' + currentAd.lastName}
          job={currentAd.phone}
          posts={count.adCount}
          userId={currentAd.userId}
        />
      </Grid>
      <Description
        name={currentAd.name}
        category={currentAd.categoryLabel}
        description={currentAd.description}
        price={
          currentAd.price === currentAd.price + ' MAD'
            ? currentAd.price + ' MAD'
            : t('Non défini')
        }
        dateCreated={formattedDate}
        city={currentAd.city}
        receiverId={currentAd.userId}
        id={currentAd._id}
        phone={currentAd.phone}
      />

      <Grid
        mb="20px"
        templateColumns={{
          base: '1fr',
          lg: 'repeat(1, 1fr)',
          '2xl': '1fr 1fr',
        }}
        templateRows={{
          base: '1fr',
          lg: 'repeat(1, 1fr)',
          '2xl': '1fr',
        }}
        gap={{ base: '20px', xl: '20px' }}
      >
        {customFieldsValues.length > 0 && (
          <Flex
            flexDirection="column"
            mb={{ base: '0px', '2xl': '20px' }}
            align="flex-start"
          >
            <Card align="start" mb="20px">
              <Text
                color={textColorPrimary}
                fontWeight="bold"
                fontSize="4xl"
                mt="10px"
                mb="4px"
              >
                {t('Caractéristiques')}
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={5}>
              {subCustomFieldsValues.map(value => {
                  return (
                    <>
                      {' '}
                      <Flex>
                        {' '}
                        <Text
                          color={textColorPrimary}
                          fontWeight="bold"
                          fontSize="xl"
                          mt="10px"
                          mb="4px"
                        >
                          {value.field_name}
                        </Text>
                      </Flex>
                      <Flex>
                        {' '}
                        <Text
                          color={textColorPrimary}
                          fontWeight="regular"
                          fontSize="xl"
                          mt="10px"
                          mb="4px"
                        >
                          {value.value}
                        </Text>
                      </Flex>
                    </>
                  );
                })}
                {customFieldsValues.map(value => {
                  return (
                    <>
                      {' '}
                      <Flex>
                        {' '}
                        <Text
                          color={textColorPrimary}
                          fontWeight="bold"
                          fontSize="xl"
                          mt="10px"
                          mb="4px"
                        >
                          {value.field_name}
                        </Text>
                      </Flex>
                      <Flex>
                        {' '}
                        <Text
                          color={textColorPrimary}
                          fontWeight="regular"
                          fontSize="xl"
                          mt="10px"
                          mb="4px"
                        >
                          {value.value}
                        </Text>
                      </Flex>
                    </>
                  );
                })}
              
              </Grid>
            </Card>
          </Flex>
        )}

        <Flex
          flexDirection="column"
          mb={{ base: '0px', '2xl': '20px' }}
          align="flex-start"
        >
          <Card align="start" mb="20px">
            <Text
              color={textColorPrimary}
              fontWeight="bold"
              fontSize="4xl"
              mt="10px"
              mb="4px"
            >
              {t('Autre annonces')}
            </Text>
          </Card>
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            gap="20px"
            mb={{ base: '20px', xl: '0px' }}
          >
            {userAds && userAds.length > 0 ? (
              userAds.slice(0, 9).map(ad => {
                const handleClick = () => {
                  getAdById(ad._id); // Get the ad by its id when the component is clicked
                };

                return (
                  <Flex key={ad._id}>
                    <NFT
                      id={ad._id}
                      //userId= {currentUser._id}
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
                      image={
                        ad.adPictures[0] && Object.keys(ad.adPictures[0]).length
                          ? ad.adPictures[0]
                          : Nft3
                      }
                      category={ad.categoryLabel}
                      currentbid={
                        ad.price === ad.price + ' MAD'
                          ? ad.price + ' MAD'
                          : t('Non défini')
                      }
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
            ) : (
              <div> Loading... </div>
            )}{' '}
          </SimpleGrid>{' '}
        </Flex>
      </Grid>
    </Box>
  );
}
export default AdDetails;
