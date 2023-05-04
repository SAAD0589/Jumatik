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

export default function Chat() {
  const bg = useColorModeValue('white', 'navy.800');
  return (
    <Box pt={{ base: '100px', md: '80px', xl: '80px' }}>
      <Card>
        <Text fontSize="35px" fontWeight="700" mb={4}>
          TERMES D'UTILISATION JUMATIK
        </Text>
        <Divider mb={2} />
        <Box float="left">
  <Text textAlign="left" lineHeight="taller" fontSize="20px" >
    Jumatik.ma est une application web gratuite que vous pouvez utiliser sans restriction, à condition de respecter les conditions suivantes :
  </Text>
  <OrderedList textAlign="left" fontSize="30px">
    <ListItem>
    Définitions
    </ListItem>
    <Text textAlign="left" lineHeight="taller" fontSize="20px">
    Dans les présentes conditions, les termes suivants auront les significations suivantes :
      </Text>
      <UnorderedList textAlign="left" lineHeight="taller" fontSize="20px">
  <ListItem>"Application" désigne l'application web gratuite Jumatik.ma.</ListItem>
  <ListItem>"Utilisateur" désigne toute personne ou entité qui accède ou utilise l'application.</ListItem>

</UnorderedList>
    <ListItem>
    Propriété intellectuelle
    </ListItem>
    <Text textAlign="left" lineHeight="taller" fontSize="20px">
    L'application et tout le contenu qui y est associé, y compris les marques, les logos, les images et les textes, sont la propriété exclusive de Jumatik.ma.  </Text>

    <ListItem>
    Limitation de responsabilité    </ListItem>
    <Text textAlign="left" lineHeight="taller" fontSize="20px">
    L'utilisation de l'application est à vos risques et périls. Jumatik.ma ne sera en aucun cas responsable des dommages directs ou indirects résultant de l'utilisation de l'application.  </Text>
    <ListItem>
    Modification des conditions    </ListItem>
    <Text textAlign="left" lineHeight="taller" fontSize="20px">
    Jumatik.ma se réserve le droit de modifier ces conditions à tout moment, sans préavis. Les modifications prendront effet immédiatement après leur publication sur l'application.  </Text>
    <ListItem>
    Dispositions générales    </ListItem>
    <Text textAlign="left" lineHeight="taller" fontSize="20px">
    Si une disposition des présentes conditions est jugée invalide ou inapplicable, cela n'affectera pas la validité des autres dispositions.</Text>
    <Text textAlign="left" lineHeight="taller" fontSize="20px">
    Les présentes conditions seront régies par et interprétées conformément au droit marocain. Tout litige découlant de ou lié aux présentes conditions sera soumis à la compétence exclusive des tribunaux marocains.

En utilisant l'application, vous acceptez les présentes conditions dans leur intégralité. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser l'application.</Text>
   
  </OrderedList>

  <Text textAlign="left" lineHeight="taller" fontSize="20px">
    Notez que nous pourrions ajouter des fonctionnalités premium à l'avenir qui pourraient être payantes. Si vous choisissez de souscrire à l'une de ces fonctionnalités, vous devrez accepter les conditions de service correspondantes et payer les frais associés.
  </Text>
</Box>

      </Card>
    </Box>
  );
}
