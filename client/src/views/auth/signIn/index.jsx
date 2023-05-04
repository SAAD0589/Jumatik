import React, { useState, useEffect } from 'react';
import { NavLink, Redirect, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin  } from '@react-oauth/google';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

import {
  FacebookLogin,
  FacebookLoginResponse,
} from '@capacitor-community/facebook-login';
import { Plugins } from '@capacitor/core';

//import { GoogleLoginButton  } from "react-social-login-buttons";

// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import axios from 'axios';

// Custom components
import { HSeparator } from 'components/separator/Separator';
import DefaultAuth from 'layouts/auth/Default';
import lzstring from 'lz-string';
// Assets
import illustration from 'assets/img/auth/auth.png';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import { MdOutlineRemoveRedEye, MdOutlineMailOutline } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { t } from 'helpers/TransWrapper';
import { Browser } from '@capacitor/browser';

const SignIn = () => {

  // Chakra color mode
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState();
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const googleBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.200');
  const googleText = useColorModeValue('navy.700', 'white');
  const googleHover = useColorModeValue(
    { bg: 'gray.200' },
    { bg: 'whiteAlpha.300' }
  );
  const googleActive = useColorModeValue(
    { bg: 'secondaryGray.300' },
    { bg: 'whiteAlpha.200' }
  );
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  // set configurations
  const [authenticated, setauthenticated] = useState(false);
  const dispatch = useDispatch();

  const configuration = {
    method: 'post',
    url: `${process.env.REACT_APP_API}/auth/login`,
    data: {
      email,
      password,
    },
  };
  useEffect(() => {
    FacebookLogin.initialize({
      appId: '599879425305048',
    });
  }, []);


  const handleFacebookLogin = async () => {
    const result = await FacebookLogin.login({ permissions: ['public_profile', 'email'] });
  
    console.log('Facebook Login Result: ', result);
  
    try {
  
      // Make a request to your backend with the user data to authenticate the user
      axios.post(`${process.env.REACT_APP_API}/auth/oauth/facebook/callback`, { code: result.accessToken.token })
        .then((res) => {
          const token = res.data.token;
          localStorage.setItem('token', token);
          setUser(token);
          const currentUser = res.data.user;
          localStorage.setItem('user-token', JSON.stringify(currentUser));
          history.push('/');
          history.go();
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const [accessToken, setAccessToken] = useState(null);

 
 


  const loginG  = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async response => {   
      
      try {
            axios.post(`${process.env.REACT_APP_API}/auth/oauth/google/callback`, { code: response.code })
              .then((res) => {
                
                const token = res.data.token;
                localStorage.setItem('token', token);
                
                setUser(token);
                const currentUser = res.data.user;
                localStorage.setItem('user-token', JSON.stringify(currentUser));
                history.push('/');
        history.go();
              })
              .catch((err) => {
                
              });
          }
          
            
           catch (error) {
            console.error(error);
          }
        }
  })

  


  const onFailure = (error) => {
    // Handle error
    toast.error(`${error.response.data.msg}`, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
  };

  const connexion = async (values, onSubmitProps) => {
    const btnPointer = document.querySelector('#login-btn');
    btnPointer.innerHTML = 'Patientez SVP..';
    btnPointer.setAttribute('disabled', true);

    await axios(configuration)
      .then(result => {
        btnPointer.innerHTML = t('Connexion');
        btnPointer.removeAttribute('disabled');
        const data = result.data;
        const currentUser = data.user;
        const token = data.token;
        if (!currentUser) {
                   return;
        }
        try {
          localStorage.setItem('user-token', JSON.stringify(currentUser));
          localStorage.setItem('token', token);
        } catch (error) {
          console.error('Error storing user and token in local storage:', error);
        }
        const dataURL = currentUser.profilePicture;

        history.push('/');
        history.go();
      })
      .catch(error => {
        toast.error(`${error.response.data.msg}`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
      });
  };
  const handleSubmit = async (values, onSubmitProps) => {
    if (!email.trim()) {
      toast.error('Rentrez un email valide!', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      return;
    }
    if (!password.trim()) {    
      toast.error('Mot de passe invalide!', {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
      return;
    }
    await connexion(values, onSubmitProps);
  };


  return (
    <GoogleOAuthProvider clientId="764637492527-ipbna7b0ig65url663gpdbnqsc0gkhec.apps.googleusercontent.com">
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      
           <ToastContainer />
<Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '14vh' }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
          {t('Connexion')}{' '}
          </Heading>{' '}
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            {t('Connecter vous sur votre compte JUMATIK')}{' '}
          </Text>{' '}
        </Box>{' '}
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          <Button
          onClick={loginG}
            fontSize="sm"
            me="0px"
            mb="26px"
            py="15px"
            h="50px"
            borderRadius="16px"
            bg={googleBg}
            color={googleText}
            fontWeight="500"
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}
          >
            <Icon as={FcGoogle} w="20px" h="20px" me="10px" />
             {t('Connexion avec Google')}{' '}
          </Button>
          <Button
            onClick={handleFacebookLogin}
            fontSize="sm"
            me="0px"
            mb="26px"
            py="15px"
            h="50px"
            borderRadius="16px"
            bg={googleBg}
            color={googleText}
            fontWeight="500"
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}
          >
            <Icon
              as={BsFacebook}
              w="20px"
              h="20px"
              me="10px"
              color="blue.500"
            />
             {t('Connexion avec Facebook')}{' '}
          </Button>{' '} 
          <NavLink to="/register/registerForm" > 
          <Button
              fontSize="sm"
              variant="solid"
              colorScheme="purple"
              fontWeight="300"
              w="100%"
              h="50"
              mb="24px"
            >
             <Icon
              as={MdOutlineMailOutline}
              w="20px"
              h="20px"
              me="10px"
              
            />
              {t(`S'enregistrer avec votre adresse mail`)}
            </Button></NavLink>
 
          <Flex align="center" mb="25px">
            <HSeparator />
            <Text color="gray.400" mx="14px">
                {t('ou')}{' '}
            </Text>{' '}
            <HSeparator />
          </Flex>{' '}
          <FormControl onSubmit={e => handleSubmit(e)}>
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              {t('Email')} <Text color={brandStars}> * </Text>{' '}
            </FormLabel>{' '}
            <Input
              isRequired={true}
              variant="auth"
              fontSize="sm"
              ms={{ base: '0px', md: '0px' }}
              type="email"
              placeholder="mail@gmail.com"
              mb="24px"
              fontWeight="500"
              size="lg"
              value={email}
              name="email"
              onChange={e => setEmail(e.target.value)}
            />{' '}
            <FormLabel
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              display="flex"
            >
               {t('Mot de passe')}  <Text color={brandStars}> * </Text>{' '}
            </FormLabel>{' '}
            <InputGroup size="md">
              <Input
                isRequired={true}
                fontSize="sm"
                placeholder="Min. 8 characters"
                mb="24px"
                size="lg"
                type={show ? 'text' : 'password'}
                variant="auth"
                onChange={e => setPassword(e.target.value)}
                value={password}
                name="password"
              />
              <InputRightElement display="flex" alignItems="center" mt="4px">
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: 'pointer' }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />{' '}
              </InputRightElement>{' '}
            </InputGroup>{' '}
            <Flex justifyContent="space-between" align="center" mb="24px">
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  id="remember-login"
                  colorScheme="brandScheme"
                  me="10px"
                />
                <FormLabel
                  htmlFor="remember-login"
                  mb="0"
                  fontWeight="normal"
                  color={textColor}
                  fontSize="sm"
                >
                   {t('Se souvenir de moi')} {' '}
                </FormLabel>{' '}
              </FormControl>{' '}
              <NavLink to="/register/forgot-password">
                <Text
                  color={textColorBrand}
                  fontSize="sm"
                  w="124px"
                  fontWeight="500"
                >
                    {t('Mot de passe perdu')}
                </Text>{' '}
              </NavLink>{' '}
            </Flex>{' '}
            <Button
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              id="login-btn"
              mb="24px"
              onClick={handleSubmit}
            >
              {t('Connexion')}{' '}
            </Button>
          </FormControl>{' '}
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            maxW="100%"
            mt="0px"
          >
       
          </Flex>{' '}
        </Flex>{' '}
      </Flex>{' '}
    </DefaultAuth>
    </GoogleOAuthProvider>
  );
};

export default SignIn;
