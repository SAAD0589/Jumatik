import React, { useState } from 'react';
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react';
import { NavLink, useHistory } from 'react-router-dom';
import { t, LanguageSwitcher, getLocale  }  from 'helpers/TransWrapper';

import { SearchIcon } from '@chakra-ui/icons';
import axios from 'axios';
export function SearchBar(props) {
  // Pass the computed styles into the `__css` prop
  const { variant, background, children, placeholder, borderRadius, ...rest } =
    props;
  // Chakra Color Mode
  const history = useHistory();

  const searchIconColor = useColorModeValue('gray.700', 'white');
  const inputBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const inputText = useColorModeValue('gray.700', 'gray.100');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const handleSearch = async event => {
    event.preventDefault();
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/ads/search?category=` +
          category +
          '&city=' +
          city +
          '&text=' +
          search
      );
      history.push({
        pathname: '/search',
        search: `?text=${search}&category=${category}&city=${city}`,
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <InputGroup w={{ base: '100%', md: '200px' }} {...rest}>
      <InputLeftElement
        onClick={handleSearch}
        children={
          <IconButton
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
            icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
          >
            {' '}
          </IconButton>
        }
      />{' '}
      <Input
        variant="search"
        fontSize="sm"
        onChange={e => setSearch(e.target.value)}
        bg={background ? background : inputBg}
        color={inputText}
        fontWeight="500"
        _placeholder={{ color: 'gray.400', fontSize: '14px' }}
        borderRadius={borderRadius ? borderRadius : '30px'}
        placeholder={placeholder ? placeholder : t('Rechercher...')}
      />{' '}
    </InputGroup>
  );
}
