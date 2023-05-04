/*eslint-disable*/
import React from "react";
import {
  Box,
  Flex,
  Link,
  List,
  ListItem,
  Text,
  Button,
  useColorMode,
  useColorModeValue,
  Divider,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import {
  MdScreenSearchDesktop,
  MdOutlineAddToQueue,
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdFacebook,
  MdOutlineEmail,
} from 'react-icons/md';

import {
  BsGithub,
  BsDiscord,
  BsPerson,
  BsInstagram,
  BsLinkedin,
  BsYoutube,
  BsTwitter,
} from 'react-icons/bs';
import { FaTiktok } from 'react-icons/fa';
import Brand from '../../components/sidebar/components/Brand';
import Links from '../../components/sidebar/components/Links';
import { t } from "helpers/TransWrapper";


export default function Footer(props) {
  const bg = useColorModeValue('gray.150', 'navy.900')
  const link = useColorModeValue('brand.600', 'white')
  const { routes } = props;

  const textColor = useColorModeValue("gray.400", "white");
  const { toggleColorMode } = useColorMode();
  return (
    <footer>
    <VStack spacing={4} w="full" align="center" px={6} py={4} bg={bg}>
      <Flex direction={['column', 'column', 'row']}>
        <VStack spacing={2} align="flex-start" w={{ base: 'full', lg: 2 / 5 }} mr={8}>
        <Brand />          <Text>
        {t('JUMATIK votre Marketplace 100% digitale Toutes vos transactions en toute sécurité et sans Intermédiaire')}          </Text>
          <HStack
        mt={{ base: 5, lg: 5, md: 5 }}
        spacing={1}
     
        alignItems="flex-start"
      >
        <Link target="_blank" href='https://facebook.com/jumatikads'>    
        <IconButton
          aria-label="facebook"
          variant="action"
          size="md"
          isRound={true}
          icon={<MdFacebook size="25px" />}
        />
        </Link>{' '}
        <Link target="_blank" href='https://instagram.com/jumatikmaroc'>    

        <IconButton
          aria-label="Instagram"
          variant="action"
          size="md"
          isRound={true}
          icon={<BsInstagram size="22px" />}
        />
           </Link>{' '}
        <IconButton
          aria-label="Linkedin"
          variant="action"
          size="md"
          isRound={true}
          icon={<BsLinkedin size="22px" />}
        />
                <Link target="_blank" href='https://youtube.com'>    

        <IconButton
          aria-label="Youtube"
          variant="action"
          size="md"
          isRound={true}
          icon={<BsYoutube size="22px" />}
        />
         </Link>{' '}
        <IconButton
          aria-label="Twitter"
          variant="action"
          size="md"
          isRound={true}
          icon={<BsTwitter size="22px" />}
        />
        <IconButton
          aria-label="Twitter"
          variant="action"
          size="md"
          isRound={true}
          icon={<FaTiktok size="22px" />}
        />
      </HStack>
        </VStack>
        <SimpleGrid columns={[3, 3, 3]} w="full" gap={6} justifyContent="space-between">
          <VStack align="flex-start">
            <Heading size="sm" textTransform="uppercase">
              {t('Sitemap')}
            </Heading>
            <Links routes={routes} />

          </VStack>
      
          <VStack align="flex-start">
            <Heading size="sm" textTransform="uppercase">
              {t('Infos Légales')}
            </Heading>
            <Link
            fontWeight='500'
            color={textColor}
            href='mailto:contact@jumatik.ma'>
             {t('Support')}
          </Link>
          <Link
            fontWeight='500'
            color={textColor}
            href='#/infos/licence'
            target='_blank'>
            Licence
          </Link>            
          <Link
            fontWeight='500'
            color={textColor}
            href='#/infos/termofuse'
            target='_blank'>
             {t(`Termes d'utilisation`)}
            
          </Link>
          <Link
            fontWeight='500'
            color={textColor}
            href='#/infos/mentions'
            target='_blank'>
                        {t(`Mentions Légales`)}

          </Link>          </VStack>
          <VStack align="flex-start">
            <Heading size="sm" textTransform="uppercase">
             {t(`Application mobile`)}
            </Heading>
            
          </VStack>
        </SimpleGrid>
      </Flex>
      <Divider  mx="auto" />
      <Text
        color={textColor}
        textAlign={{
          base: "center",
          xl: "start",
        }}
        mb={{ base: "20px", xl: "0px" }}>
        {" "}
        &copy; {1900 + new Date().getYear()}
        <Text as='span' fontWeight='500' ms='4px'>
        JUMATIK. All Rights Reserved. Made with love by
          <Link
            mx='3px'
            color={link}
            href='https://benifit.io'
            target='_blank'
            fontWeight='700'>
            Benifit.io
          </Link>
        </Text>
      </Text>   </VStack>
  </footer>
   
  );
}
