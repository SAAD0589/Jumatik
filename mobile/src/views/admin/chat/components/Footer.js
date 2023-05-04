import React from "react";
import { Flex, Input, Button } from "@chakra-ui/react";

const Footer = ({ inputMessage, setInputMessage, handleSendMessage }) => {
  return (
	<Flex w="100%" mt="5">
  	<Input
    variant='auth'
    	placeholder="Type Something..."
    	border="none"
    	borderRadius="none"
    	
    	onKeyPress={(e) => {
      	if (e.key === "Enter") {
        	handleSendMessage();
      	}
    	}}
    	value={inputMessage}
    	onChange={(e) => setInputMessage(e.target.value)}
  	/>
  	<Button
    	bg="brand.500"
    	color="white"
    	borderRadius="10px"
    	_hover={{
      	bg: "white",
      	color: "black",
      	border: "1px solid black",
    	}}
    	disabled={inputMessage.trim().length <= 0}
    	onClick={handleSendMessage}
  	>
    	Envoyer
  	</Button>
	</Flex>
  );
};

export default Footer;