import React from "react";
import { NavLink, Link } from "react-router-dom";
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
} from "@chakra-ui/react";
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/auth.png";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import RegisterForm from "views/register/RegisterForm";


function Register() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
  const googleText = useColorModeValue("navy.700", "white");
  const googleHover = useColorModeValue(
    { bg: "gray.200" },
    { bg: "whiteAlpha.300" }
  );
  const googleActive = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.200" }
  );
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "max-content", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Enregistrement gratuit
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Créez votre compte JUMATIK
          </Text>
        </Box>
        
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: "100%", md: "420px" }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: "auto", lg: "unset" }}
          me="auto"
          mb={{ base: "20px", md: "auto" }}
        >
          <Button
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
            S'enregistrer avec Google
          </Button>
          <Button
            fontSize='sm'
            me='0px'
            mb='26px'
            py='15px'
            h='50px'
            borderRadius='16px'
            bg={googleBg}
            color={googleText}
            fontWeight='500'
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}>
            <Icon as={BsFacebook} w='20px' h='20px' me='10px' color='blue.500' />
            Connexion avec Facebook
          </Button>
          <Flex align="center" mb="25px">
            <HSeparator />
            <Text color="gray.400" mx="14px">
              ou
            </Text>
            <HSeparator />
          </Flex>
          <Box>
          <NavLink to="/register/registerForm" > <Button
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
            >
              S'enregistrer manuellement
            </Button></NavLink>
         
            
       </Box>
       <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            maxW="100%"
            mt="0px"
          >
            <Text color={textColorDetails} fontWeight="400" fontSize="14px">
              Vous avez deja pas encore de compte?
              <NavLink to="/auth/sign-in">
                <Text
                  color={textColorBrand}
                  as="span"
                  ms="5px"
                  fontWeight="500"
                >
                  Se connecter
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
        
      </Flex>
    </DefaultAuth>
  );
}

export default Register;
