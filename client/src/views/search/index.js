import React, { useState, useEffect } from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Center,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Textarea,
  useColorModeValue,
  Stack,
  Radio,
  RadioGroup,
  SimpleGrid,
  Avatar,
  AvatarBadge,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Grid,
  InputLeftElement,
  InputLeftAddon,
} from '@chakra-ui/react';
import {
  AsyncCreatableSelect,
  AsyncSelect,
  CreatableSelect,
  Select,
} from 'chakra-react-select';
// Custom components
import Banner from 'views/admin/marketplace/components/Banner';
import TableTopCreators from 'views/admin/marketplace/components/TableTopCreators';
import HistoryItem from 'views/admin/marketplace/components/HistoryItem';
import NFT from 'components/card/NFT';
import Card from 'components/card/Card.js';
import SearchableSelectWithSearchInput from 'components/searchableSelect/SearchableSelect.js';

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
import { MdSearch, MdCategory, MdLocationPin } from 'react-icons/md';

import tableDataTopCreators from 'views/admin/marketplace/variables/tableDataTopCreators.json';
import { tableColumnsTopCreators } from 'views/admin/marketplace/variables/tableColumnsTopCreators';
import AdAsList from 'views/ads/recentAds/components/AdAsList';
import { SearchIcon } from '@chakra-ui/icons';

export default function RecentAds() {
  // Chakra Color Mode
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const searchText = searchParams.get('text');
  const searchSubcategory = searchParams.get('subcategory');
  const searchSecteur = searchParams.get('secteur');
  const searchCategory = searchParams.get('category');
  const searchCity = searchParams.get('city');
  const searchRegion = searchParams.get('region');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const colourOptions = [
    { value: 'blue', label: 'Blue', color: '#0052CC' },
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630' },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
  ];
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const [ads, setAds] = useState([]);
  const [SelectedAd, setSelectedAd] = useState([]);
  const history = useHistory();
  const [showLList, setshowList] = useState(false);
  const [showCard, setshowCard] = useState(true);
  const [text, setText] = useState('');

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState('');
  const [selectedCityOption, setSelectedCityOption] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSecteurOption, setSelectedSecteurOption] = useState('');

  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedSubcategoryLabel, setSelectedSubcategoryLabel] = useState('');

  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCityId, setSelectedCityId] = useState('');

  const [secteurs, setSecteurs] = useState([]);
  const [selectedSecteur, setSelectedsecteur] = useState('');

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  const inputText = useColorModeValue('gray.700', 'gray.100');
  const searchIconColor = useColorModeValue('gray.700', 'white');
  const inputBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const onChangeText = e => {
    setText(e.target.value);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    if (selectedCategoryId) {
      axios
        .get(`${process.env.REACT_APP_API}/subcategories/${selectedCategoryId}`)
        .then(res => setSubcategories(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/cities/`)
      .then(res => setCities(res.data))
      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    if (selectedCityId) {
      axios
        .get(`${process.env.REACT_APP_API}/secteurs/${selectedCityId}`)
        .then(res => setSecteurs(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedCityId]);

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
  const fetchAll = async (
    category,
    subcategory,
    region,
    city,
    secteur,
    text
  ) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/ads/search?category=` +
          category +
          '&subcategory=' +
          subcategory +
          '&region=' +
          region +
          '&city=' +
          city +
          '&secteur=' +
          secteur +
          '&text=' +
          text
      );
      setAds(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAll(
      searchRegion,
      searchSubcategory,
      searchSecteur,
      searchCategory,
      searchCity,
      searchText
    );
  }, []);
  const fetchSearch = async (
    category,
    subcategory,
    region,
    city,
    secteur,
    text
  ) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/ads/search?category='` +
          category +
          '&subcategory=' +
          subcategory +
          '&region=' +
          region +
          '&city=' +
          city +
          '&secteur=' +
          secteur +
          '&text=' +
          text
      );
      setAds(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSearch(      searchRegion,
      searchSubcategory,
      searchSecteur,
      searchCategory,
      searchCity,
      searchText);
  }, []);
  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/ads/search?category=` +
          selectedCategory +
          '&subcategory=' +
          selectedSubcategory +
          '&city=' +
          selectedCity +
          '&secteur=' +
          selectedSecteurOption +
          '&text=' +
          text
      );
      setAds(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box pt={{ base: '120px', md: '80px', xl: '20px' }}>
      {' '}
      {/* Main Fields */}{' '}
      <Flex mb="20px" flexDir="column">
        <Flex direction="row" w="100%" alignContent="center">
          <Card mb={5}>
            <Flex
              align="center"
              mt={{ base: '10px', md: '10px' }}
              direction="column"
              w="100%"
              maxW="100%"
              background="transparent"
              borderRadius="15px"
              mx={{ base: 'auto', lg: 'auto' }}
              me="auto"
              mb={{ base: '20px', md: 'auto' }}
            >
              <FormControl>
                <Flex
                  align="center"
                  display={{ base: 'bloc', md: 'flex', xl: 'flex' }}
                >
                  <Flex height="90px" mr="10px" w="100%">
                    <InputGroup w={{ base: '100%', md: '100%' }}>
                      <InputLeftElement
                        children={
                          <IconButton
                            mt={2}
                            bg="inherit"
                            borderRadius="inherit"
                            _hover="none"
                            _active={{
                              bg: 'inherit',
                              transform: 'none',
                              borderColor: 'transparent',
                            }}
                            _focus={{
                              boxShadow: 'none',
                            }}
                            icon={
                              <SearchIcon
                                color={searchIconColor}
                                w="15px"
                                h="15px"
                              />
                            }
                          ></IconButton>
                        }
                      />{' '}
                      <Input
                        variant="auth"
                        name="text"
                        size="lg"
                        onChange={onChangeText}
                        w="100%"
                        fontSize="sm"
                        bg={inputBg}
                        color={inputText}
                        fontWeight="200"
                        _placeholder={{ color: 'gray.400', fontSize: '14px' }}
                        borderRadius="10px"
                        placeholder="Que Recherchez-vous ?"
                      />
                    </InputGroup>{' '}
                  </Flex>{' '}
                </Flex>
                <Flex height="90px" >
                  <Flex w="100%" >
                    <InputGroup>
                      <Select
                        id="city"
                        closeMenuOnSelect={false}
                        name="location"
                        variant="outline"
                        ms={{ base: '0px', md: '0px' }}
                        placeholder="Choisissez votre ville"
                        size="lg"
                        options={cities.map(city => ({
                          value: city.name,
                          label: city.name,
                        }))}
                        value={selectedCityOption}
                        onChange={selectedOption => {
                          const selectedCityName = selectedOption.value;

                          const selectedCity = cities.find(
                            city => city.name === selectedCityName
                          );

                          if (selectedCity) {
                            setSelectedCityId(selectedCity.id);
                            setSelectedCityOption(selectedOption)
                          }
                          setSelectedCity(selectedCityName);
                        }}
                      />
                    </InputGroup>{' '}
                  </Flex>{' '}
                  <Flex w="100%">
                    <InputGroup>
                      <Select
                        id="sector"
                        name="sector"
                        variant="outline"
                        ms={{ base: '0px', md: '0px' }}
                        placeholder="Choisissez votre secteur"
                        size="lg"
                        options={secteurs.map(secteur => ({
                          value: secteur.name,
                          label: secteur.name,
                        }))}
                        onChange={selectedOption =>{   
                          setSelectedsecteur(selectedOption);
                          setSelectedSecteurOption(selectedOption.value)}
                       
                        }
                        value={selectedSecteur}
                      />
                    </InputGroup>{' '}
                  </Flex>
                </Flex>{' '}
                <Flex>
                  <Flex height="90px" mr="10px" w="100%">
                    <InputGroup>
                      <Select
                        id="category"
                        name="categoryName"
                        isRequired={true}
                        fontSize="sm"
                        mb="24px"
                        size="lg"
                        variant="outline"
                        options={categories.map(category => ({
                          value: category.name,
                          label: category.label,
                        }))}
                        onChange={selectedOption => {
                          //const selectedCategoryId =
                          //selectedOption.target.options[selectedOption.target.selectedIndex].dataset.id;
                            const selectedCatName = selectedOption.value;
                          const selectedCategory = categories.find(
                            category => category.name === selectedCatName
                          );
                          setSelectedCategory(selectedCatName);
                          //setSelectedCategoryId(selectedCategoryId);
                          setSelectedCategoryLabel(selectedOption);
                        }}
                        value={selectedCategoryLabel}

                        placeholder="Choisir une categorie"
                      />
                    </InputGroup>{' '}
                  </Flex>{' '}
                  <Flex height="90px" mr="10px" w="100%">
                    <InputGroup>
                      <Select
                        id="category"
                        name="categoryName"
                        isRequired={true}
                        fontSize="sm"
                        mb="24px"
                        options={subcategories.map(subcategory => ({
                          value: subcategory.name,
                          label: subcategory.label,
                        }))}
                        size="lg"
                        variant="outline"
                        
                        onChange={e => {
                          setSelectedSubcategory(e.target.value);
                          setSelectedSubcategoryLabel(
                            e.target.options[e.target.selectedIndex].text
                          );
                        }}
                        value={selectedSubcategory}
                        placeholder="Choisir une sous-categorie"
                      />
                    
                    </InputGroup>{' '}
                  </Flex>{' '}
                </Flex>
                <Button
                  onClick={handleSubmit}
                  fontSize="md"
                  variant="brand"
                  fontWeight="500"
                  w="100%"
                  h="50"
                  mb="15px"
                >
                  Rechercher{' '}
                </Button>{' '}
              </FormControl>{' '}
            </Flex>{' '}
          </Card>{' '}
        </Flex>{' '}
        <Flex flexDirection="Column" w="100%">
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
          </Card>{' '}
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
                      price={
                        ad.price === 'Non défini'
                          ? 'Non défini '
                          : ad.price + ' MAD'
                      }
                      image={
                        ad.adPictures[0] && Object.keys(ad.adPictures[0]).length
                          ? ad.adPictures[0]
                          : Nft3
                      }
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
                      dateCreated={new Date(ad.createdAt).toLocaleDateString()}
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
                          image={
                            ad.adPictures[0] &&
                            Object.keys(ad.adPictures[0]).length
                              ? ad.adPictures[0]
                              : Nft3
                          }
                          category={ad.categoryLabel}
                          currentbid={
                            ad.price === 'Non défini'
                              ? 'Non défini '
                              : ad.price + ' MAD'
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
                : null}{' '}
            </SimpleGrid>
          )}{' '}
        </Flex>{' '}
        {/* <Flex flexDirection="Column" align="end">
                            <Card w={{ base: '100%', xl: '95%' }} p="0px" mb="20px">
                              <Flex
                                align={{ sm: 'flex-start', lg: 'center' }}
                                justify="space-between"
                                w="100%"
                                px="22px"
                                py="18px"
                              >
                                <Text color={textColor} fontSize="xl" fontWeight="600">
                                  Sponsorisées
                                </Text>
                                <Button variant="action">Voir plus</Button>
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
                            </Card>
                          </Flex> */}{' '}
      </Flex>{' '}
    </Box>
  );
}
