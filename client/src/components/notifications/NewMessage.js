// chakra imports
import {
  Icon,
  Flex,
  Text,
  useColorModeValue,
  MenuItem,
  Box,
  Center,
} from '@chakra-ui/react';
import {
  MdUpgrade,
  MdPersonAddAlt1,
  MdOutlineNotificationsPaused,
  MdDeleteForever,
} from 'react-icons/md';
import { TiDelete } from 'react-icons/ti';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { NavLink, useHistory } from 'react-router-dom';

export function NewMessage(props) {
  const { Click, currentUserId, conversation } = props;
  const unread = useColorModeValue('gray.200', 'whiteAlpha.200');
  const read = useColorModeValue('navy.700', 'white');
  const [notificationsSocket, setNotificationsSocket] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notifUsers, setNotifUsers] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const socket = useRef(io(process.env.REACT_APP_SOCKET));
  const history = useHistory();
  const notificationColor = useColorModeValue('red.600', 'red.200');

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET);
    socket.current.on('receiveNotification', data => {
      setNotificationsSocket(prevNotifications => {
        return [
          ...prevNotifications,
          {
            sender: data.senderId,
            recipient: data.senderId,
            type: data.type,
            message: data.message,
            createdAt: Date.now(),
          },
        ];
      });
    });
  }, []);

  useEffect(() => {
    socket.current.emit('addUser', currentUserId);
    socket.current.on('getUsers', users => {
      setNotifUsers(users);
    });
  }, [currentUserId]);
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/notifications/${currentUserId}?type=new_message`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setNotifications(res.data);
    } catch (err) {}
  };
  useEffect(() => {
    fetchNotifications();
  }, [currentUserId]);
  const handleNotificationClick = async notificationId => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API}/notifications/${notificationId}`,
        { read: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      history.push('/admin/chat');
      history.go(0);

      // You could also remove the notification from the list of unread notifications
    } catch (err) {}
  };
  const handleDelete = async notificationId => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API}/notifications/delete/${notificationId}`,
        { read: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      window.location.reload();
      setDeleted(true);
      // You could also remove the notification from the list of unread notifications
    } catch (err) {}
  };
  if (notifications.length === 0) {
    return (
      <>
        <Box w="100%" display="flex" justifyContent="center" mb={2}>
          <Flex direction="row">
            {' '}
            <Icon
              as={MdOutlineNotificationsPaused}
              color="grey"
              w={14}
              h={14}
            />
          </Flex>
        </Box>
        <Box w="100%" display="flex" justifyContent="center">
          <Flex direction="row" align="center">
            <Text
              mb="5px"
              fontWeight="regular"
              color="grey"
              fontSize={{ base: 'md', md: 'md' }}
            >
              Désolé, pas de messages à l'horizon
            </Text>
          </Flex>
        </Box>
      </>
    );
  } else {
    return (
      <>
        {!deleted &&
          notifications.map(notification => (
            <MenuItem
              w="100%"
              bg={notification?.read ? 'none' : unread}
              px="0"
              borderRadius="8px"
              mb="4px"
              mt="2px"
              p={2}
            >
              <Flex
                w="100%"
                onClick={() => handleNotificationClick(notification._id)}
                key={notification._id}
                align="center"
              >
                <Flex
                  justify="center"
                  align="center"
                  borderRadius="16px"
                  minH={{ base: '60px', md: '70px' }}
                  h={{ base: '60px', md: '70px' }}
                  minW={{ base: '60px', md: '70px' }}
                  w={{ base: '60px', md: '70px' }}
                  me="14px"
                  bg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
                >
                  <Icon as={MdPersonAddAlt1} color="white" w={8} h={14} />
                </Flex>
                <Flex flexDirection="column">
                  <Text
                    mb="5px"
                    fontWeight="bold"
                    color={read}
                    fontSize={{ base: 'md', md: 'md' }}
                  >
                    Alerte info : Nouveau message
                  </Text>
                  <Flex alignItems="center">
                    <Text
                      fontSize={{ base: 'sm', md: 'sm' }}
                      lineHeight="100%"
                      color={read}
                    >
                      {notification.message}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              <Flex ml={6}>
                <Icon
                  onClick={() => handleDelete(notification._id)}
                  as={TiDelete}
                  color={notificationColor}
                  w={8}
                  h={8}
                />
              </Flex>{' '}
            </MenuItem>
          ))}
      </>
    );
  }
}
