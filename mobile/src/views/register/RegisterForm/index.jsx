import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import { t } from 'helpers/TransWrapper';

function RegisterForm() {
  // Chakra color mode
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

  const history = useHistory();
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordVerification: '',
    phone: '',
    address: '',
    UserType: ['Acheter'],
    ProPart: 'part',
    profilePicture: '',
  });
  const [error, setError] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    passwordVerification: '',
  });
  const [selectedProPart, setSelectedProPart] = useState(user.ProPart);
  const [SelectedBuyerSeller, setSelectedBuyerSeller] = useState(user.UserType);

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
  const [file, setFile] = useState([]);

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

  const register = async () => {
   
   
    const formData = new FormData();
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('phone', user.phone);
    formData.append('address', user.address);
    formData.append('UserType', SelectedBuyerSeller);
    formData.append('ProPart', selectedProPart);
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
    
    const configuration = {
      method: 'post',
      url: `${process.env.REACT_APP_API}/auth/register`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    };

    // prevent the form from refreshing the whole page
    // make the API call
    await axios(configuration)
      .then(result => {
        setLogin(true);

        const token = result.data;

        if (!token) {
          const errorData =  result.json();
          throw new Error(errorData.error);
        }
        
        setTimeout(() => {
          history.push('/register/confirmRequest');
          history.go(0);
        }, 500);
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
  const handleSubmit = async () => {
    if (!user.firstName.trim()) {
      toast.error('Prenom obligatoire!', {
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
    if (!user.lastName.trim()) {
      toast.error('Nom obligatoire!', {
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
    await register();
    if (!user.email.trim()) {
      toast.error('Email obligatoire!', {
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
    if (!user.phone.trim()) {
      toast.error('Telephone obligatoire!', {
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
    if (!user.address.trim()) {
      toast.error('Adresse obligatoire!', {
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
    if (!user.password.trim()) {
      toast.error('Mot de passe obligatoire!', {
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
    if (!user.passwordVerification.trim()) {
      toast.error('Veuillez verifier votre mot de passe!', {
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
    if (!user.ProPart.trim()) {
      toast.error('Rentrez votre statut!', {
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
    if (!user.UserType.trim()) {
      toast.error('Rentrez votre choix (Acheteur ou vendeur)!', {
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
    if (user.password !== user.passwordVerification) {
      toast.error('Les mots de passes ne correspondent pas!', {
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
    await register();
  };

  return (
    <Card  padding="20px" mt={{ base: '80px', md: '10px' }}>   
               <ToastContainer />

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
             {t('Enregistement gratuit')}
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
         {t('Inserez votre image de profile')}
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
      <FormLabel
        display="flex"
        ms="4px"
        fontSize="sm"
        fontWeight="500"
        color={textColor}
        mb="8px"
      >
         {t('Vous êtes ?')}<Text color={brandStars}>*</Text>
      </FormLabel>
      <RadioGroup
        name="ProPart"
        variant="auth"
        onChange={setSelectedProPart}
        value={selectedProPart}
        mb="20px"
      >
        <Stack  direction="row">
          <Radio colorScheme="red" size="lg" value="pro">
             {t('Professionnel')}
          </Radio>
          <Radio colorScheme="green" size="lg" value="part">
             {t('Particulier')}
          </Radio>
        </Stack>
      </RadioGroup>
      <SimpleGrid columns={2} spacing={5}>
        <Box height="90px">
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
          >
             {t('Nom')}<Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            isRequired={true}
            variant="auth"
            name="lastName"
            fontSize="sm"
            ms={{ base: '0px', md: '0px' }}
            type="text"
            placeholder={t('Nom')}
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
             {t('Prénom')}<Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            isRequired={true}
            variant="auth"
            name="firstName"
            fontSize="sm"
            ms={{ base: '0px', md: '0px' }}
            type="text"
            placeholder={t('Prénom')}
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
      <SimpleGrid columns={2} spacing={5}>
        <Box height="90px">
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
          >
             {t('Téléphone')}<Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            isRequired={true}
            variant="auth"
            fontSize="sm"
            ms={{ base: '0px', md: '0px' }}
            type="tel"
            placeholder={t('Téléphone')}
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
        <Box height="90px">
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
          >
             {t('Email')}<Text color={brandStars}>*</Text>
          </FormLabel>
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
            value={user.email}
            name="email"
            onBlur={validateInput}
            onChange={HandleChange}
          />
          {error.email && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Erreur </AlertTitle>
              <AlertDescription>{error.email}</AlertDescription>
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
         {t('Adresse complète')}<Text color={brandStars}>*</Text>
      </FormLabel>

      <Textarea
        fontSize="sm"
        mb="24px"
        fontWeight="500"
        size="lg"
        ms={{ base: '0px', md: '0px' }}
        isRequired={true}
        placeholder={t('Adresse complète')}
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

      <FormLabel
        display="flex"
        ms="4px"
        fontSize="sm"
        fontWeight="500"
        color={textColor}
        mb="8px"
      >
         {t('Que désirez-vous ?')}<Text color={brandStars}>*</Text>
      </FormLabel>
      <Box mb={5}>
        {' '}
        <CheckboxGroup
          variant="auth"
          onChange={setSelectedBuyerSeller}
          value={SelectedBuyerSeller}
        >
          <Stack spacing={40} direction="row">
            <Checkbox colorScheme="red" size="lg" value="Acheter">
               {t('Acheter')}
            </Checkbox>
            <Checkbox colorScheme="green" size="lg" value="Vendre">
               {t('Vendre')}
            </Checkbox>
          </Stack>
        </CheckboxGroup>
      </Box>
      <SimpleGrid columns={1} spacing={10}>
        <Box height="90px">
          <FormLabel
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            display="flex"
          >
             {t('Mot de passe')}<Text color={brandStars}>*</Text>
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
             {t('Confirmez Mot de passe')}<Text color={brandStars}>*</Text>
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
         {t(`S'enregistrer`)}
      </Button>
    </FormControl>

    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="start"
      maxW="100%"
      mt="0px"
    >
      <Text color={textColorDetails} fontWeight="400" fontSize="14px">
         {t(`Vous avez deja un compte ?`)}
        <NavLink to="/auth/sign-in">
          <Text color={textColorBrand} as="span" ms="5px" fontWeight="500">
             {t(`Se connecter`)}
          </Text>
        </NavLink>
      </Text>
    </Flex>
  </Flex></Card>
 
  );
}

export default RegisterForm;
