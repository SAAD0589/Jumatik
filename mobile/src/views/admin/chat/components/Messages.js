import React, { useEffect, useRef, useState } from "react";
import { Avatar, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
const Messages = ({ messages, currentUser }) => {
	const [user, setUser] = useState(null);
	useEffect(() => {
  
	  const getUser = async () => {
		try {
		  const res = await axios(`${process.env.REACT_APP_API}/users?userId=` + messages.sender);
		  setUser(res.data);
		  
		} catch (err) {
		  
		}
	  };
	
  
  
	  getUser();
	}, [messages]);
  const AlwaysScrollToBottom = () => {
	const elementRef = useRef();
	useEffect(() => elementRef.current.scrollIntoView());
	return <div ref={elementRef} />;
  };

  return (
	<Flex flexDirection="column" p="3">
  	    
    	{messages.sender  === currentUser._id ? (
        	<Flex w="100%" justify="flex-end" >
          	<Flex borderRadius={10}
            	bg="brand.500"
            	color="white"
            	maxW="350px"
            	p="3"
          	>
            	<Text>{messages.text}</Text>
          	</Flex>
        	</Flex>) : (	
				<Flex  w="100%">
          	<Avatar
            	
            	src={user?.profilePicture}
            	bg="blue.300"
          	></Avatar>
          	<Flex
            borderRadius={10}
            	bg="gray.100"
            	color="black"
            	minW="100px"
            	maxW="350px"
            	my="1"
            	p="3"
                ml={2}
          	>
            	<Text>{messages.text}</Text>
          	</Flex>
        	</Flex>) }
      	
      	
    	
      	
        
      	
    	
  	
  	<AlwaysScrollToBottom />
	</Flex>
  );

		}
export default Messages;