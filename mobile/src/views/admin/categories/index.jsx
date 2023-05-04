import React, { useState, useEffect } from 'react';
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

import Category from 'components/card/category';

// Assets

import Nft4 from 'assets/img/nfts/Nft4.png';
import { useHistory } from 'react-router-dom';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState();
  const [adsCount, setAdsCount] = useState([]);
  const history = useHistory();
  const getCategoryById = async id => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/categories/category/${id}`
      );
      setCategory(response.data);

      history.push(`/categories/category/${id}`);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/categories`)
      .then(async res => {
        setCategories(res.data);
        // Fetch ads count for each category
        for (const category of res.data) {
          const response = await axios.get(
            `${process.env.REACT_APP_API}/ads/category/count/${category._id}`
          );
          setAdsCount(prevState => ({
            ...prevState,
            [category._id]: response.data,
          }));
        }
      })
      .catch(error => console.error(error));
  }, []);

  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  return (
    <>
      <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          gap="20px"
          mb={{ base: '20px', xl: '0px' }}
        >
          {' '}
          {categories.map(category => {
            const handleClick = () => {
              getCategoryById(category._id); // Get the ad by its id when the component is clicked
            };
            return (
              <Category
                key={category._id}
                label={category.label}
                image={category.CatPicture}
                download={handleClick}
                count={adsCount[category._id]}
              />
            );
          })}{' '}
        </SimpleGrid>{' '}
      </Box>{' '}
    </>
  );
}
