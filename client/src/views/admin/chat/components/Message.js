// chakra imports
import { Icon, Flex, Text, useColorModeValue, Avatar, AvatarBadge } from "@chakra-ui/react";
import { MdUpgrade } from "react-icons/md";
import React, {useEffect, useState} from "react";
import axios from "axios";

export function Message(props) {
  const { Click, currentUser, conversation} = props;
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios(`${process.env.REACT_APP_API}/users?userId=` + friendId);
        setUser(res.data);
      } catch (err) {
        
      }
    };
  


    getUser();
  }, [currentUser, conversation]);

  const textColor = useColorModeValue("navy.700", "white");
  return (
    <>
<Flex onClick={Click} cursor='pointer'>
<Flex 
        justify='center'
        align='center'
        mr={6}
       >
        <Avatar src={user?.profilePicture}  color='white'
            bg='#11047A'
            size='lg'
            w='40px'
            h='40px'>
            <AvatarBadge boxSize="0.8em" bg="green.500" />
            </Avatar>
      </Flex>
      <Flex flexDirection='column' alignItems='center'>
        <Text
          mt={2}
          fontWeight='bold'
          color={textColor}
          fontSize={{ base: "md", md: "md" }}>
          {user?.firstName + " " + user?.lastName}
        </Text>
       
       
      </Flex></Flex>
      
    </>
  );
}
