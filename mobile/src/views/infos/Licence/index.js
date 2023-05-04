import {
  Flex,
  useColorModeValue,
  Divider,
  Box,
  Grid,
  Text,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import React from 'react';

export default function Licence() {
  const bg = useColorModeValue('white', 'navy.800');
  return (
    <Box pt={{ base: '100px', md: '80px', xl: '80px' }}>
      <Card>
        <Text fontSize="35px" fontWeight="700" mb={4}>
          LICENCE JUMATIK
        </Text>
        <Divider mb={2} />
        <Box float="left">
  <Text textAlign="left" lineHeight="taller" fontSize="20px" >
    Jumatik.ma est une application web gratuite que vous pouvez utiliser sans restriction, à condition de respecter les conditions suivantes :
  </Text>
  <UnorderedList textAlign="left" fontSize="20px">
    <ListItem>
      Vous pouvez utiliser l'application pour publier des annonces gratuitement.
    </ListItem>
    <ListItem>
      Vous ne pouvez pas distribuer ou revendre l'application à des tiers, ni en extraire le code source.
    </ListItem>
    <ListItem>
      Vous acceptez que nous ne sommes pas responsables des dommages directs ou indirects causés par l'utilisation de l'application.
    </ListItem>
    <ListItem>
      Nous nous réservons le droit de modifier ces conditions à tout moment, et nous vous recommandons de les vérifier régulièrement.
    </ListItem>
  </UnorderedList>

  <Text textAlign="left" lineHeight="taller" fontSize="20px">
    Notez que nous pourrions ajouter des fonctionnalités premium à l'avenir qui pourraient être payantes. Si vous choisissez de souscrire à l'une de ces fonctionnalités, vous devrez accepter les conditions de service correspondantes et payer les frais associés.
  </Text>
</Box>

      </Card>
    </Box>
  );
}
