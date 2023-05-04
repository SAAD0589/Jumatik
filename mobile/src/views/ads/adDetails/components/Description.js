// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  useColorModeValue,
  Container,
  SimpleGrid,
  Image,
  Heading,
  Text,
  Stack,
  StackDivider,
  VStack
} from '@chakra-ui/react';
import { MdLocationOn, MdAccessTimeFilled, MdMessage } from 'react-icons/md';
import { AiFillLike } from 'react-icons/ai';
import { IoLogoWhatsapp } from 'react-icons/io';
// Custom components
import Card from 'components/card/Card.js';
import React, {useState, useEffect} from 'react';
// Assets
import { MdUpload } from 'react-icons/md';
import Dropzone from 'views/admin/profile/components/Dropzone';
import axios from 'axios';
import { NavLink, useHistory } from 'react-router-dom';
import { t } from 'helpers/TransWrapper';

export default function Description(props) {
  const { id,name, phone, category, description, price, dateCreated, city, receiverId  } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const btn = useColorModeValue('gray.400', 'brand.500');
  const textColorSecondary = 'gray.400';
  const userData = localStorage.getItem('user-token');
const currentUser = JSON.parse(userData);
const history = useHistory();
const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);


  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/conversations/${currentUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setConversations(res.data);
      } catch (err) {
        
      }
    };

    fetchConversations();
  }, []);

  const addConv = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/conversations`,
        {
          senderId: currentUser._id,
          receiverId: receiverId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  const validerAd = async (id) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API}/ads/${id}/valider`,{ id },
        {
          headers: {
            
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      history.goBack();
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  const annulerAd = async (id) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API}/ads/${id}/annuler`,{ id },
        {
          headers: {
            
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );      history.goBack();

      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const createConv = async () => {
    
    let selectedChat = null;

    if (conversations.length === 0) {
      const newChat = await addConv();
      selectedChat = newChat;
    } else {
      conversations.forEach((conversation) => {
        if (conversation.members.includes(receiverId)) {
          selectedChat = conversation;
        }
      });

      if (!selectedChat) {
        const newChat = await addConv();
        selectedChat = newChat;
      }
    }

    if (selectedChat) {
      setCurrentChat(selectedChat);
      
      history.push({
        pathname: '/admin/chat',
        state: { currentChat: selectedChat },
      });
    }
    localStorage.setItem('currentChat', JSON.stringify(selectedChat));
  };

  return (
    <Card mb="20px" align="start" p="20px">
      <SimpleGrid columns={{ base: 1, md: 1 }}>
        <Stack align="start" spacing={5}>
          <Text
            textTransform={'uppercase'}
            color={brandColor}
            fontWeight={600}
            fontSize={'sm'}
            bg={useColorModeValue('white', 'brand.500')}
            p={2}
            alignSelf={'flex-start'}
            rounded={'md'}
          >
            {category}
          </Text>
          <Heading>{name}</Heading>
          <Text color={textColorPrimary} fontWeight="500" fontSize="2xl">
            {price} 
          </Text>
          <Text color={'gray.500'} fontSize={'lg'}>
            {description}
          </Text>
          <Flex>
            <Icon w={5} h={5} mr={2} as={MdAccessTimeFilled} />
            <Text
              pr={3}
              color={textColorPrimary}
              fontWeight="500"
              fontSize="sm"
            >
              {dateCreated}
            </Text>

            <Icon w={5} h={5} mr={2} as={MdLocationOn} />
            <Text
              pr={3}
              color={textColorPrimary}
              fontWeight="500"
              fontSize="sm"
            >
              {city}
            </Text>
          </Flex>
        
          {receiverId!=currentUser?._id && (currentUser ?
           <VStack w="100%" p={1} >
            <Button 
              leftIcon={<MdMessage />}
              variant="solid"
              colorScheme='navy'
              fontWeight="regular"
              fontSize="sm"
              minW="100%"
              onClick={createConv}
               
            >
               {t('Contacter')}
            </Button>
            <Button
              leftIcon={<IoLogoWhatsapp />}
              variant="solid"
              colorScheme="whatsapp"
              fontWeight="regular"
              fontSize="sm"
              minW="100%"
              ml="auto"
              onClick={() => {
    const message = "Bonjour, je suis intéressé(e) par vos produits. Pourriez-vous s'il vous plaît m'envoyer plus d'informations ?"; // replace with your pre-defined message
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');}}
            >
              Whatsapp{' '}
              
            </Button>
           
          </VStack> :     
          <NavLink to='/auth/login' >
          <Button
              
              variant="action"
              fontWeight="regular"
              fontSize="sm"
              minW="100%"
              ml="auto"

            >
               {t(`Connectez vous pour contacter l'annonceur`)}
            </Button>
            </NavLink>)}
          
            {
            currentUser?.isAdmin && 
            <VStack w="100%" p={1} >
            <Button 
              
              variant="solid"
              colorScheme='green'
              fontWeight="bold"
              fontSize="sm"
              minW="100%"
              onClick={() => validerAd(id)}
               
            >
              Valider l'annonce
            </Button>
            <Button
              
              variant="solid"
              colorScheme="red"
              fontWeight="bold"
              fontSize="sm"
              minW="100%"
              ml="auto"
              onClick={() => annulerAd(id)}
            >
              Annuler l'annonce{' '}
            </Button>
           
          </VStack>
          }
        </Stack>
      </SimpleGrid>
    </Card>
  );
}
