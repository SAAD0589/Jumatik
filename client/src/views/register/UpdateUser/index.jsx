import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';
// Custom components
import { HSeparator } from 'components/separator/Separator';
// Assets
import illustration from 'assets/img/auth/auth.png';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import Card from 'components/card/Card.js';

export default function UpdateUser() {
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const currentUser = JSON.parse(localStorage.getItem('user-token'));
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const history = useHistory();
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
   
    password: '',
    passwordVerification: '',
    phone: currentUser.phone,
    address: currentUser.address,
   
    profilePicture: '',
  });
  const [error, setError] = useState({
    firstName: '',
    lastName: '',
    phone: '',
   
    address: '',
    password: '',
    passwordVerification: '',
  });


  const HandleChange = e => {
    const { name, value } = e.target;
    setUser({
      ...user, //spread operator
      [name]: value,
    });
    validateInput(e);
  };

  const validateInput = e => {
    let { name, value } = e.target;
    setError(prev => {
      const stateObj = { ...prev, [name]: '' };

      switch (name) {
        case 'firstName':
          if (!value) {
            stateObj[name] = 'Entre votre prenom';
          }
          break;
        case 'lastName':
          if (!value) {
            stateObj[name] = 'Entre votre Nom';
          }
          break;
        case 'phone':
          if (!value) {
            stateObj[name] = 'Entre votre Telephone';
          }
          break;
        case 'address':
          if (!value) {
            stateObj[name] = 'Entre votre Adresse';
          }
          break;
        case 'password':
          if (!value) {
            stateObj[name] = 'Rentrez votre Mot de passe.';
          }
          break;

        case 'confirmPassword':
          if (!value) {
            stateObj[name] = 'Confirmez votre Mot de passe.';
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };
  const [file, setFile] = useState(currentUser.profilePicture);

  const onFileChange = event => {
    setUser({
      ...user, //spread operator
      profilePicture: event.target.files[0],
    });
    
    setFile(URL.createObjectURL(event.target.files[0]));
  };
  const DeleteImg = event => {
    // Update the state
    setFile();
  };

  const update = async () => {
   
   
    const formData = new FormData();
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('password', user.password); 
    formData.append('phone', user.phone);
    formData.append('address', user.address);
  
    formData.append('passwordVerification', user.passwordVerification);
    if (user.profilePicture) {
      const blobToDataURL = blob =>
      new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      const dataURL = await blobToDataURL(user.profilePicture);
      formData.append('profilePicture', dataURL);
    }

    // const payload = {
    //   firstName: user.firstName,
    //  lastName: user.lastName,
    //  password: user.password,
    // phone: user.phone,
    // address: user.address,
    // passwordVerification: user.passwordVerification,
    // profilePicture: user.dataURL,

    // }
    
    const configuration = {
      method: 'patch',
      url: `${process.env.REACT_APP_API}/users/update/${currentUser._id}`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`, },
    };
    

    // prevent the form from refreshing the whole page
    // make the API call
    await axios(configuration)
      .then(result => {
        const updatedUser = result.data;
    
        // Update local storage data
        localStorage.setItem('user-token', JSON.stringify(updatedUser));
        if (!updatedUser) {
          alert('Erreur de modification');
          return;
        }
        
        setTimeout(() => {
          history.push('/admin/profile');
          history.go(0);
        }, 500);
      })
      .catch(error => {
        error = new Error();
      });
  };
  const handleSubmit = async () => {
    await update();
  };

  return (
    <Card  padding="20px" mt={{ base: '80px', md: '10px' }}>   
    <Flex
  
    direction="column"
    w={{ base: '100%', md: '100%' }}
    maxW="100%"
    background="transparent"
    borderRadius="15px"
    mx={{ base: 'auto', lg: 'unset' }}
    me="auto"
    mb={{ base: '20px', md: 'auto' }}
  >
  <Text mb={5} color={textColor} align='start' fontSize='2xl' fontWeight='600'>
            Modification de votre profile
            </Text>
    <FormControl onSubmit={e => handleSubmit(e)}>
      <FormLabel
        display="flex"
        ms="4px"
        fontSize="sm"
        fontWeight="500"
        color={textColor}
        mb="8px"
      >
        Ajoutez votre image de profile
      </FormLabel>
      <Stack direction={['column', 'row']} spacing={6} mb="20px">
        <Center>
          <Avatar size="xl" bg="#11047A" src={file}>
            <AvatarBadge
              as={IconButton}
              size="sm"
              rounded="full"
              top="-10px"
              colorScheme="red"
              aria-label="remove Image"
              icon={<SmallCloseIcon onClick={DeleteImg} />}
            />
          </Avatar>
        </Center>

        <Center w="full">
          <Input
            variant="auth"
            name="profilePicture"
            fontSize="sm"
            ms={{ base: '0px', md: '0px' }}
            pt="10px"
            mb="24px"
            fontWeight="500"
            size="lg"
            type="file"
            onChange={onFileChange}
          />{' '}
        </Center>
      </Stack>
    
      <SimpleGrid columns={2} spacing={10}>
        <Box height="90px">
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
          >
            Nom<Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            isRequired={true}
            variant="auth"
            name="lastName"
            fontSize="sm"
            ms={{ base: '0px', md: '0px' }}
            type="text"
            placeholder="Entrez votre nom"
            mb="24px"
            fontWeight="500"
            size="lg"
            value={user.lastName}
            onBlur={validateInput}
            onChange={HandleChange}
          />
          {error.lastName && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Erreur </AlertTitle>
              <AlertDescription>{error.lastName}</AlertDescription>
            </Alert>
          )}
        </Box>
        <Box height="90px">
          <FormLabel
            display="flex"
            name="firstName"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
          >
            Prénom<Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            isRequired={true}
            variant="auth"
            name="firstName"
            fontSize="sm"
            ms={{ base: '0px', md: '0px' }}
            type="text"
            placeholder="Entrez votre Prénom "
            mb="24px"
            fontWeight="500"
            size="lg"
            value={user.firstName}
            onBlur={validateInput}
            onChange={HandleChange}
          />
          {error.firstName && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Erreur </AlertTitle>
              <AlertDescription>{error.firstName}</AlertDescription>
            </Alert>
          )}
        </Box>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={10}>
        <Box height="90px">
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
          >
            Téléphone<Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            isRequired={true}
            variant="auth"
            fontSize="sm"
            ms={{ base: '0px', md: '0px' }}
            type="tel"
            placeholder="Entrez votre Num de Téléphone "
            mb="24px"
            fontWeight="500"
            size="lg"
            name="phone"
            value={user.phone}
            onBlur={validateInput}
            onChange={HandleChange}
          />
          {error.phone && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Erreur </AlertTitle>
              <AlertDescription>{error.phone}</AlertDescription>
            </Alert>
          )}
        </Box>
        
      </SimpleGrid>

      <FormLabel
        display="flex"
        ms="4px"
        fontSize="sm"
        fontWeight="500"
        color={textColor}
        mb="8px"
      >
        Adresse complète<Text color={brandStars}>*</Text>
      </FormLabel>

      <Textarea
        fontSize="sm"
        mb="24px"
        fontWeight="500"
        size="lg"
        ms={{ base: '0px', md: '0px' }}
        isRequired={true}
        placeholder="Entrez votre Adresse complète"
        value={user.address}
        onBlur={validateInput}
        name="address"
        onChange={HandleChange}
      />
      {error.address && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Erreur </AlertTitle>
          <AlertDescription>{error.address}</AlertDescription>
        </Alert>
      )}

   
      <SimpleGrid columns={2} spacing={10}>
        <Box height="90px">
          <FormLabel
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            display="flex"
          >
            Mot de passe<Text color={brandStars}>*</Text>
          </FormLabel>
          <InputGroup size="md">
            <Input
              isRequired={true}
              fontSize="sm"
              placeholder="Min. 8 characters"
              mb="24px"
              size="lg"
              type={show ? 'text' : 'password'}
              variant="auth"
              value={user.password}
              name="password"
              onBlur={validateInput}
              onChange={HandleChange}
            />
            {error.password && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>Erreur </AlertTitle>
                <AlertDescription>{error.password}</AlertDescription>
              </Alert>
            )}
            <InputRightElement display="flex" alignItems="center" mt="4px">
              <Icon
                color={textColorSecondary}
                _hover={{ cursor: 'pointer' }}
                as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                onClick={handleClick}
              />
            </InputRightElement>
          </InputGroup>
        </Box>
        <Box height="90px">
          <FormLabel
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            display="flex"
          >
            Confirmez Mot de passe<Text color={brandStars}>*</Text>
          </FormLabel>
          <InputGroup size="md">
            <Input
              isRequired={true}
              fontSize="sm"
              placeholder="Min. 8 characters"
              mb="24px"
              size="lg"
              type={show ? 'text' : 'password'}
              variant="auth"
              value={user.passwordVerification}
              onBlur={validateInput}
              name="passwordVerification"
              onChange={HandleChange}
            />
            {error.passwordVerification && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>Erreur </AlertTitle>
                <AlertDescription>
                  {error.passwordVerification}
                </AlertDescription>
              </Alert>
            )}
            <InputRightElement display="flex" alignItems="center" mt="4px">
              <Icon
                color={textColorSecondary}
                _hover={{ cursor: 'pointer' }}
                as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                onClick={handleClick}
              />
            </InputRightElement>
          </InputGroup>
        </Box>
      </SimpleGrid>

      <Button
        fontSize="sm"
        variant="brand"
        fontWeight="500"
        w="100%"
        h="50"
        mb="24px"
        onClick={handleSubmit}
      >
        Modifier
      </Button>
    </FormControl>

    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="start"
      maxW="100%"
      mt="0px"
    >
  
    </Flex>
  </Flex></Card>
 
  );
}


