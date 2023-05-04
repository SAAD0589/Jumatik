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
          MENTIONS LEGALES
        </Text>
        <Divider mb={2} />
        <Box float="left">

  <UnorderedList textAlign="left" fontSize="20px">
    <ListItem>
    Jumatik.ma est une application web gratuite d'annonces créée par l'entreprise BENIFIT.IO.
    </ListItem>
    <ListItem>
    BENIFIT.IO est une entreprise enregistrée au Maroc sous le numéro de registre de commerce 51939.    </ListItem>
    <ListItem>
    Le siège social de BENIFIT.IO est situé à Rabat, Maroc.
    </ListItem>
    <ListItem>
    Pour contacter BENIFIT.IO, veuillez envoyer un email à contact@benifit.io.
    </ListItem>
    <ListItem>
    Le directeur de la publication pour Jumatik.ma est AIT BENI IFIT Achraf, en qualité de représentant légal de BENIFIT.IO.    </ListItem>
    <ListItem>
    L'hébergement de Jumatik.ma est assuré par LWS
    </ListItem>
    <ListItem>
    Jumatik.ma a été développé par BENIFIT.IO et est la propriété exclusive de JUMATIK SARL.
    </ListItem>
    <ListItem>
    Tous les contenus publiés sur Jumatik.ma sont la propriété de leurs auteurs respectifs.    </ListItem>
    <ListItem>
    BENIFIT.IO ne sera pas responsable des dommages directs ou indirects causés par l'utilisation de Jumatik.ma.   </ListItem>
    <ListItem>
    Tous les litiges découlant de ou liés à l'utilisation de Jumatik.ma seront soumis à la compétence exclusive des tribunaux marocains.    </ListItem>
  </UnorderedList>

  <Text textAlign="left" lineHeight="taller" fontSize="20px">
  Ces mentions légales sont fournies à titre indicatif et peuvent être sujettes à des modifications ultérieures.  </Text>
</Box>

      </Card>
    </Box>
  );
}
