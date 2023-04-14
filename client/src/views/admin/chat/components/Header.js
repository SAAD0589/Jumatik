import React from "react";
import { Flex, Avatar, AvatarBadge, Text } from "@chakra-ui/react";

const Header = (props) => {
	const {avatar, name} = props;
  return (
	<Flex w="100%" mb={3}>
  	<Avatar size="lg" src={avatar}>
    	<AvatarBadge boxSize="1.25em" bg="green.500" />
  	</Avatar>
  	<Flex flexDirection="column" mx="5" justify="center">
    	<Text fontSize="lg" fontWeight="bold">
	{name}
    	</Text>
    	<Text color="green.500">En ligne</Text>
  	</Flex>
	</Flex>
  );
};

export default Header;