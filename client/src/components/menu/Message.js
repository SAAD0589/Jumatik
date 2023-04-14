// chakra imports
import { Icon, Flex, Text, useColorModeValue, Avatar, AvatarBadge } from "@chakra-ui/react";
import { MdUpgrade } from "react-icons/md";
import React from "react";

export function Message(props) {
  const {image, name, message, Click} = props;
  const textColor = useColorModeValue("navy.700", "white");
  return (
    <>
<Flex onClick={Click}><Flex 
        justify='center'
        align='center'
        mr={6}
       >
        <Avatar src={image}  color='white'
            bg='#11047A'
            size='lg'
            w='60px'
            h='60px'>
            <AvatarBadge boxSize="1em" bg="green.500" />
            </Avatar>
      </Flex>
      <Flex flexDirection='column'>
        <Text
          mb='5px'
          fontWeight='bold'
          color={textColor}
          fontSize={{ base: "md", md: "md" }}>
          {name}
        </Text>
        <Flex alignItems='center'>
          <Text
            fontSize={{ base: "sm", md: "sm" }}
            lineHeight='100%'
            color={textColor}>
            {message}
          </Text>
        </Flex>
      </Flex></Flex>
      
    </>
  );
}
