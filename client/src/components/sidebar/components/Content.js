// chakra imports
import {
  Box,
  Flex,
  Stack,
  Button,
  Icon,
  HStack,
  IconButton,
  Link,
} from '@chakra-ui/react';
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
//   Custom components
import Brand from '../../../components/sidebar/components/Brand';
import Links from '../../../components/sidebar/components/Links';
import SidebarCard from '../../../components/sidebar/components/SidebarCard';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { t, LanguageSwitcher, getLocale  }  from 'helpers/TransWrapper';

// FUNCTIONS

function SidebarContent(props) {
  const { routes } = props;
  const user = localStorage.getItem('user-token');

  // SIDEBAR
  return (
    <Flex direction="column" height="100%" pt="25px" borderRadius="30px">
      <Brand />
      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="20px" pe={{ md: '16px', '2xl': '1px' }}>
          <Links routes={routes} />
          <Flex alignContent={'center'} pt="25px">
            <NavLink to="/search">
              <Button
                variant="brand"
                fontWeight="regular"
                fontSize="sm"
                minW="250px"
                mx="auto"
              >
                <Icon as={MdScreenSearchDesktop} w="20px" h="20px" me="10px" />
               
                {t('Recherche avancée')}
              </Button>
            </NavLink>
          </Flex>
        </Box>

        <Box ps="20px" pe={{ md: '16px', '2xl': '1px' }}>
          <Flex alignContent={'center'} pt="5px">
            <NavLink to={user ? '/ad/createAd' : '/auth/sign-in'}>
              <Button
                variant="brand"
                fontWeight="regular"
                fontSize="sm"
                minW="250px"
                mx="auto"
              >
                <Icon as={MdOutlineAddToQueue} w="20px" h="20px" me="10px" />
                {t('Annonce gratuite')}
              </Button>
            </NavLink>

          </Flex>
          <LanguageSwitcher />

        </Box>
      </Stack>
      <HStack
        mt={{ base: 5, lg: 5, md: 5 }}
        spacing={1}
        px={5}
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
      <Box
        ps="20px"
        pe={{ md: '16px', '2xl': '0px' }}
        mt="60px"
        mb="40px"
        borderRadius="30px"
      >
        <SidebarCard />
      </Box>
    </Flex>
  );
}

export default SidebarContent;
