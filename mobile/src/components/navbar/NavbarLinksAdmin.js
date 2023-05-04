// Chakra Imports
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Badge,
  Box,
  HStack,
  keyframes,
} from '@chakra-ui/react';
import {
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdEmail,
  MdCategory,
  MdPersonAddAlt1,
} from 'react-icons/md';
import { NavLink, useHistory } from 'react-router-dom';
// Custom Components
import { FaAppStoreIos, FaGooglePlay } from 'react-icons/fa';

//import css module
import { ItemContent } from 'components/menu/ItemContent';
import { NewFollower } from 'components/notifications/NewFollower';
import { NewMessage } from 'components/notifications/NewMessage';
import { t, LanguageNavbar, getLocale  }  from 'helpers/TransWrapper';

import { Message } from 'components/menu/Message';

import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import Chat from 'views/admin/chat';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
// Assets
import navImage from 'assets/img/layout/Navbar.png';
import {
  MdNotificationsNone,
  MdInfoOutline,
  MdOutlineChat,
} from 'react-icons/md';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { FaEthereum } from 'react-icons/fa';
import routes from 'routes.js';
import { ThemeEditor } from './ThemeEditor';
import axios from 'axios';
export default function HeaderLinks(props) {
  const { secondary } = props;
  // Chakra Color Mode
  const pulseRing = keyframes`
	0% {
    transform: scale(0.3);
  }
  40% {
    opacity: 0.3;
  },
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
	`;
  const navbarIcon = useColorModeValue('gray.400', 'white');
  const { colorMode, toggleColorMode } = useColorMode();
  const { banner, avatar, name, job, posts, followers, following } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const notification = useColorModeValue('red.600', 'red.200');

  const icon = useColorModeValue('brand.500', 'white');
  const [notificationCount, setNotificationsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);

  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');

  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
  );
  const size = '40px';
  const color = 'teal';
  const color2 = 'orange';
  const history = useHistory();
  const fetchNotificationsCount = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/notifications/count/${userToken._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const num = res.data;
      setNotificationsCount(num.count);
    } catch (err) {}
  };
  useEffect(() => {
    fetchNotificationsCount();
  }, []);
  const fetchMessagesCount = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/notifications/messages/${userToken._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const num = res.data;
      setMessagesCount(num.messageCount);
    } catch (err) {}
  };
  useEffect(() => {
    fetchMessagesCount();
  }, []);

  const logout = e => {
    localStorage.removeItem('user-token');
    localStorage.removeItem('token');
    localStorage.removeItem('user-img');
    history.push('/auth/sign-in');
    history.go(0);
  };
  let timeOfDay;
  const date = new Date();
  const hours = date.getHours();

  if (hours < 12) {
    timeOfDay = t('Bonjour');
  } else if (hours >= 12 && hours < 17) {
    timeOfDay = t('Bonjour');
  } else {
    timeOfDay = t('Bonsoir');
  }

  const userToken = JSON.parse(localStorage.getItem('user-token'));
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const storedImage = localStorage.getItem('user-img');
    if (storedImage) {
      setImageSrc(storedImage);
    }
  }, []);

  const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const checkUserToken = () => {
    if (!userToken || userToken === 'undefined') {
      setIsLoggedIn(false);
    }
    setIsLoggedIn(true);
  };
  useEffect(() => {
    checkUserToken();
  }, [isLoggedIn]);

  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <Flex align="center" display={{ base: 'none', xl: 'flex' }}>
        {' '}
        <Text
          fontSize={{ base: 'lg', xl: '18px' }}
          fontWeight="bold"
          textAlign="center"
          px="10px"
        >
          {t('Téléchargez notre application mobile !')}
        </Text>
        <HStack spacing={5} px={5} alignItems="flex-start">
          <Box
            position="relative"
            w={size}
            h={size}
            _before={{
              content: "''",
              position: 'relative',
              display: 'block',
              width: '300%',
              height: '300%',
              boxSizing: 'border-box',
              marginLeft: '-100%',
              marginTop: '-100%',
              borderRadius: '50%',
              bgColor: color,
              animation: `2.25s ${pulseRing} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
            }}
          >
            <IconButton
              position="absolute"
              top={0}
              aria-label="PlayStore"
              variant="action"
              size="md"
              icon={<FaGooglePlay size="25px" />}
            />
          </Box>
          <Box
            position="relative"
            w={size}
            h={size}
            _before={{
              content: "''",
              position: 'relative',
              display: 'block',
              width: '300%',
              height: '300%',
              boxSizing: 'border-box',
              marginLeft: '-100%',
              marginTop: '-100%',
              borderRadius: '50%',
              bgColor: color2,
              animation: `2.25s ${pulseRing} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
            }}
          >
            <IconButton
              position="absolute"
              top={0}
              aria-label="AppStore"
              variant="action"
              size="md"
              icon={<FaAppStoreIos size="25px" />}
            />
          </Box>
        </HStack>
        <HStack spacing={2} px={2} alignItems="flex-start"><LanguageNavbar/></HStack>
      
      
      </Flex>
      <SearchBar
        mb={secondary ? { base: '10px', md: 'unset' } : 'unset'}
        me="10px"
        borderRadius="30px"
      />
      <SidebarResponsive routes={routes} />
      {userToken ? (
        <React.Fragment>
          {' '}
          <Menu>
            <MenuButton p="0px">
              <Box position="relative">
                <Icon
                  mt="6px"
                  as={MdOutlineChat}
                  color={navbarIcon}
                  w="22px"
                  h="22px"
                  me="10px"
                />
                <Text
                  color={notification}
                  fontSize="0.8em"
                  fontWeight="bold"
                  px={1}
                  w={5}
                  position="absolute"
                  right="0"
                  top="-3"
                >
                  {messagesCount === 0 ? null : messagesCount}
                </Text>{' '}
              </Box>
            </MenuButton>{' '}
            <MenuList
              boxShadow={shadow}
              p="20px"
              borderRadius="20px"
              bg={menuBg}
              border="none"
              mt="22px"
              me={{ base: '30px', md: 'unset' }}
              minW={{ base: 'unset', md: '400px', xl: '450px' }}
              maxW={{ base: '360px', md: 'unset' }}
            >
              <Flex jusitfy="space-between" w="100%" mb="20px">
                <Text fontSize="md" fontWeight="600" color={textColor}>
                  {t('Boite de messagerie')}{' '}
                </Text>{' '}
              </Flex>{' '}
              <Flex flexDirection="column">
                <SearchBar
                  w="100%"
                  mb={secondary ? { base: '15px', md: '15px' } : '15px'}
                  me="15px"
                  borderRadius="30px"
                />

                <NewMessage currentUserId={userToken._id} />
              </Flex>{' '}
            </MenuList>{' '}
          </Menu>
          <Menu>
            <MenuButton p="0px">
              <Box position="relative">
                <Icon
                  mt="6px"
                  as={MdNotificationsNone}
                  color={navbarIcon}
                  w="22px"
                  h="22px"
                  me="10px"
                />
                <Text
                  color={notification}
                  fontSize="0.8em"
                  fontWeight="bold"
                  px={1}
                  w={5}
                  position="absolute"
                  right="0"
                  top="-3"
                >
                  {notificationCount === 0 ? null : notificationCount}{' '}
                </Text>{' '}
              </Box>
            </MenuButton>{' '}
            <MenuList
              boxShadow={shadow}
              p="20px"
              borderRadius="20px"
              bg={menuBg}
              border="none"
              mt="22px"
              me={{ base: '30px', md: 'unset' }}
              minW={{ base: 'unset', md: '400px', xl: '450px' }}
              maxW={{ base: '360px', md: 'unset' }}
            ></MenuList>
            <MenuList
              boxShadow={shadow}
              p="20px"
              borderRadius="20px"
              bg={menuBg}
              border="none"
              mt="22px"
              me={{ base: '30px', md: 'unset' }}
              minW={{ base: 'unset', md: '400px', xl: '450px' }}
              maxW={{ base: '360px', md: 'unset' }}
            >
              <Flex jusitfy="space-between" w="100%" mb="20px">
                <Text fontSize="md" fontWeight="600" color={textColor}>
                  {' '}
                  {t('Notifications')}
                </Text>
              </Flex>{' '}
              <Flex flexDirection="column">
                <NewFollower currentUserId={userToken._id} />
              </Flex>{' '}
            </MenuList>
          </Menu>
        </React.Fragment>
      ) : (
        <Menu>
          <MenuButton p="0px">
            <Icon
              mt="6px"
              as={MdPerson}
              color={icon}
              w="22px"
              h="22px"
              me="10px"
            />
          </MenuButton>{' '}
          <MenuList
            boxShadow={shadow}
            p="0px"
            mt="10px"
            borderRadius="20px"
            bg={menuBg}
            border="none"
          >
            <Flex w="100%" mb="0px">
              <Text
                ps="20px"
                pt="16px"
                pb="10px"
                w="100%"
                borderBottom="1px solid"
                borderColor={borderColor}
                fontSize="sm"
                fontWeight="700"
                color={textColor}
              >
                👋 &nbsp; {t('Bienvenu sur JUMATIK')}{' '}
              </Text>{' '}
            </Flex>{' '}
            <Flex flexDirection="column" p="10px">
              <NavLink to="/auth/login">
                <MenuItem
                  _hover={{ bg: 'none' }}
                  _focus={{ bg: 'none' }}
                  borderRadius="8px"
                  px="14px"
                >
                  <Text fontSize="sm"> {t('Se connecter')}</Text>{' '}
                </MenuItem>{' '}
              </NavLink>{' '}
              <NavLink to="/auth/register">
                <MenuItem
                  _hover={{ bg: 'none' }}
                  _focus={{ bg: 'none' }}
                  borderRadius="8px"
                  px="14px"
                >
                  <Text fontSize="sm"> {t(`S'enregistrer`)}</Text>{' '}
                </MenuItem>{' '}
              </NavLink>{' '}
            </Flex>{' '}
          </MenuList>{' '}
        </Menu>
      )}
      <Menu>
        <MenuButton onClick={toggleColorMode} p="0px">
          <Icon
            onClick={toggleColorMode}
            mt="6px"
            as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
            color={navbarIcon}
            w="22px"
            h="22px"
            me="10px"
          />
        </MenuButton>{' '}
      </Menu>
      {userToken && (
        <Menu>
          <MenuButton p="0px">
            <Avatar
              _hover={{ cursor: 'pointer' }}
              color="white"
              src={userToken.profilePicture}
              bg="#11047A"
              size="sm"
              w="40px"
              h="40px"
            />
          </MenuButton>{' '}
          <MenuList
            boxShadow={shadow}
            p="0px"
            mt="10px"
            borderRadius="20px"
            bg={menuBg}
            border="none"
          >
            <Flex w="100%" mb="0px">
              <Text
                ps="20px"
                pt="16px"
                pb="10px"
                w="100%"
                borderBottom="1px solid"
                borderColor={borderColor}
                fontSize="sm"
                fontWeight="700"
                color={textColor}
              >
                👋 &nbsp; {timeOfDay}, &nbsp; {userToken.firstName}{' '}
              </Text>{' '}
            </Flex>{' '}
            <Flex flexDirection="column" p="10px">
              <NavLink to="/admin/profile">
                <MenuItem
                  _hover={{ bg: 'none' }}
                  _focus={{ bg: 'none' }}
                  borderRadius="8px"
                  px="14px"
                >
                  <Text fontSize="sm"> {t(`Afficher mon profile`)} </Text>{' '}
                </MenuItem>{' '}
              </NavLink>
              <MenuItem
                onClick={logout}
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                color="red.400"
                borderRadius="8px"
                px="14px"
              >
                <Text fontSize="sm"> {t(`Déconnexion`)} </Text>{' '}
              </MenuItem>{' '}
            </Flex>{' '}
          </MenuList>{' '}
        </Menu>
      )}{' '}
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
