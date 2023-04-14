import { Flex, useColorModeValue, Divider, Grid, Text } from '@chakra-ui/react';
import Card from 'components/card/Card';
import React, { useState, useEffect, useRef } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import Messages from './components/Messages';
import { Message } from './components/Message';
import axios from 'axios';
import { io } from "socket.io-client";
import { CgLayoutGrid } from 'react-icons/cg';

export default function Chat() {
  const currentUser = JSON.parse(localStorage.getItem('user-token'));
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(
    JSON.parse(localStorage.getItem("currentChat"))
  );
  const [messages, setMessages] = useState([]);
  const socket = useRef(io(process.env.REACT_APP_SOCKET));
  const [newMessage, setNewMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  
  const bgItem = useColorModeValue(
    { bg: 'white', boxShadow: '0px 40px 58px -20px rgba(112, 144, 176, 0.12)' },
    { bg: 'navy.700', boxShadow: 'unset' }
  );

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET);
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", currentUser._id);
    socket.current.on("getUsers", (users) => {
   
    });
  }, [currentUser]);
  const getConversations = async () => {
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
  useEffect(() => {
    getConversations();
  }, [currentUser._id]);
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
         ` ${process.env.REACT_APP_API}/messages/` + currentChat?._id,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setMessages(res.data);
        
      } catch (err) {
        
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSendMessage  = async (e) => {
    e.preventDefault();
    const message = {
      sender: currentUser._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== currentUser._id
    );
    const notification = {
      recipient: receiverId, // replace with actual recipient ID
      sender: currentUser?._id, // replace with actual sender ID
      message: `${currentUser?.firstName} ${currentUser?.lastName}, vous a envoye un message.`,
      type: 'new_message', // specify the type of notification
    };
    socket.current.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId,
      text: newMessage,
    });
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/messages`, message , {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          } );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      
    }
    socket.current.emit('sendNotification', notification);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API}/notifications`, notification, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const newNotification = response.data;
      setNotifications(newNotification);
    } catch (error) {
      console.error(error);
    }

    
  };

  function handleChatClick(chat) {
    setSelectedChat(chat);
    setCurrentChat(chat);
  }
  const bg = useColorModeValue('white', 'navy.800');
  return (
    <Grid
      mb="20px"
      gridTemplateColumns={{ xl: '1fr 1fr', '0.25fr 2fr': '1fr 2fr' }}
      gap={{ base: '20px', xl: '20px' }}
      display={{ base: 'block', xl: 'grid' }}
    >
      <Flex
        flexDirection="column"
        gridArea={{ xl: '1 / 1 / 2 / 2', '2xl': '1 / 1 / 2 / 2' }}
      >
        <Flex
          pt={{ base: '10px', md: '80px', xl: '0px' }}
          mt={{ base: '120px', md: '80px', xl: '73px' }}
          direction="column"
        >
          {conversations.map(c => (
            <Card key={c._id} _hover={bgItem} mt={2}  onClick={() => handleChatClick(c)}
          bg={c === selectedChat ? bg : bgItem}>
              <Message
                conversation={c}
                currentUser={currentUser}
              />
            </Card>
          ))}
        </Flex>
      </Flex>

      <Flex
        flexDirection="column"
        gridArea={{ xl: '1 / 2 / 3 / 4', '2xl': '3 / 2 / 2 / 3' }}
      >
        <Card
          pt={{ base: '10px', md: '80px', xl: '10px' }}
          mt={{ base: '20px', md: '80px', xl: '80px' }}
        >
          <Flex   w="100%" h="600px" justify="center" align="center" bg={bg}>
            {currentChat ? (
              <>
                <Flex overflowY="scroll"  w="100%" h="100%" flexDir="column" >
                 
                  {messages.map(m => (
                    <Messages key={m._id} messages={m} currentUser={currentUser} />
                  ))}{' '}
                 
                 
                </Flex>
                 
              </>
            ) : (
              <Text fontSize={50} opacity="30%">
                {' '}
                Demarrez une conversation
              </Text>
            )}
          </Flex>
          <Flex flexDir="column" align="center"> 
                  <Footer
                    inputMessage={newMessage}
                    setInputMessage={setNewMessage}
                    handleSendMessage={handleSendMessage}
                  /></Flex>
        </Card>
      </Flex>
    </Grid>
  );
}
