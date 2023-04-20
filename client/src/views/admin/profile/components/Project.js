// Chakra imports
import {
  Box,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
  Badge,
  Button
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import { t } from "helpers/TransWrapper";
import React from "react";
// Assets
import { MdEdit } from "react-icons/md";

export default function Project(props) {
  const { title, ranking, link, image,status,linkUpdate,linkDelete, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const brandColor = useColorModeValue("brand.500", "white");
  const bg = useColorModeValue("white", "navy.700");
  let colorScheme;

switch(status) {
  case 'Validée':
    colorScheme = 'green';
    break;
  case 'Brouillon':
    colorScheme = 'orange';
    break;
  case 'Annulée':
    colorScheme = 'red';
    break;
  default:
    colorScheme = 'blue';
}
  return (
    <Card bg={bg} {...rest} p='14px'>
      <Flex align='center' direction={{ base: "column", md: "row" }}>
        <Image h='80px' w='80px' src={image} borderRadius='8px' me='20px' />
        <Box mt={{ base: "10px", md: "0" }}>
          <Text
            color={textColorPrimary}
            fontWeight='500'
            fontSize='md'
            mb='4px'>
            {title}
          </Text>
          <Text
            fontWeight='500'
            color={textColorSecondary}
            fontSize='sm'
            me='4px'>
            {ranking} •{" "}
            <Button variant='action' ml={3} fontWeight='500'  onClick={link} fontSize='sm'>
               {t(`Voir l'annonce en details`)}
            </Button>
             <Button variant='action' ml={3} fontWeight='500'  onClick={linkUpdate} fontSize='sm'>
               {t(`Modifier l'annonce`)}
            </Button> 
             <Button colorScheme='red' ml={3} fontWeight='500'  onClick={linkDelete} fontSize='sm'>
               {t(`Supprimer l'annonce`)}
            </Button> 
          </Text>
        </Box>
        <Badge me='16px'
          ms='auto' colorScheme={colorScheme}>{status}</Badge>
        {/* <Link
          href={link}
          variant='no-hover'
          me='16px'
          ms='auto'
          p='0px !important'>
          <Icon as={MdEdit} color='secondaryGray.500' h='18px' w='18px' />
        </Link> */}
      </Flex>
    </Card>
  );
}
