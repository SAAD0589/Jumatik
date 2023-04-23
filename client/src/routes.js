import React, { useState, useEffect } from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdEmail,
  MdCategory,
  MdPersonAddAlt1,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import Dashboard from 'views/admin/default';
import Categories from 'views/admin/categories';
import CategoryDetails from 'views/admin/categories/CategoryDetails';
import AdDetails from 'views/ads/adDetails';
import RTL from 'views/admin/rtl';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import Confirmation from 'views/auth/Confirmation';
import Licence from 'views/infos/Licence';
import TermOfUse from 'views/infos/TermOfUse';
import Mentions from 'views/infos/Mentions';
import ConfirmRequest from 'views/auth/ConfirmRequest';
import PasswordReset from 'views/auth/PasswordReset';
import ForgotPassword from 'views/auth/ForgotPassword';
import RegisterCentered from 'views/register/Register';
import RegisterForm from 'views/register/RegisterForm';
import UpdateUser from 'views/register/UpdateUser';
import CreateAd from 'views/ads/createAd';
import UpdateAd from 'views/ads/updateAd';
import RecentAds from 'views/ads/recentAds';
import Search from 'views/search';
import Chat from 'views/admin/chat';
import axios from 'axios';
import { t } from "helpers/TransWrapper";

const userToken = JSON.parse(localStorage.getItem('user-token'));
let combinedRoutes ;
const routes = [

  {
    name: t('Marketplace'),
    layout: '/admin',
    path: '/default',
    icon: (
      <Icon as={MdHome} width="20px" height="20px" color="inherit" mt={1} />
    ),
    component: NFTMarketplace,
  },

  {
    name: t(`Détails de l'annonce`) ,
    layout: '/ads',
    path: '/:id',

    component: AdDetails,
  },
  {
    name: t('Récemment ajoutées'),
    layout: '/ad',
    path: '/recentAds',

    component: RecentAds,
  },
  {
    name: t('Recherche avancée'),
    layout: '/search',
    path: '/',

    component: Search,
  },
  {
    name: t('Recherche avancée'),
    layout: '/search',
    path: '?text=:text',

    component: Search,
  },
  {
    name: 'Licence',
    layout: '/infos',
    path: '/licence',

    component: Licence,
  },
  {
    name: `Termes d'utilisation`,
    layout: '/infos',
    path: '/termofuse',

    component: TermOfUse,
  },
  {
    name: `Mentions Légales`,
    layout: '/infos',
    path: '/mentions',

    component: Mentions,
  },

  {
    name: t('Catégories'),
    layout: '/admin',
    path: '/categories',
    icon: (
      <Icon as={MdCategory} width="20px" height="20px" color="inherit" mt={1} />
    ),
    component: Categories,
  },
  {
    name: t('Catégories'),
    layout: '/categories',
    path: '/category/:id',
    component: CategoryDetails,
  },
];
  

const adminRoutes = [      
  {
  name: 'Dashboard',
  layout: '/admin',
  path: '/dashboard',
  icon: (
    <Icon
      as={MdPerson}
      width="20px"
      height="20px"
      color="inherit"
      mt={1}
    />
  ),
  component: Dashboard,
},
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: (
      <Icon
        as={MdPerson}
        width="20px"
        height="20px"
        color="inherit"
        mt={1}
      />
    ),
    component: Profile,
  },

  {
    name: t('Modifier mon profile'),
    component: UpdateUser,
    layout: '/register',
    path: '/updateUser',
  },

  {
    name: t('Annonce') ,
    component: CreateAd,
    layout: '/ad',
    path: '/createAd',
  },
  {
    name: t('Modifier Annonce'),
    component: UpdateAd,
    layout: '/ad',
    path: '/updateAd/:id',
  },
  {
    name: t('Boite de messagerie'),
    icon: (
      <Icon
        as={MdEmail}
        width="20px"
        height="20px"
        color="inherit"
        mt={1}
      />
    ),
    component: Chat,
    layout: '/admin',
    path: '/chat',
  },]
const regularUserRoutes = [    {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: (
      <Icon
        as={MdPerson}
        width="20px"
        height="20px"
        color="inherit"
        mt={1}
      />
    ),
    component: Profile,
  },

  {
    name: t('Modifier mon profile'),
    component: UpdateUser,
    layout: '/register',
    path: '/updateUser',
  },

  {
    name: t('Annonce'),
    component: CreateAd,
    layout: '/ad',
    path: '/createAd',
  },
  {
    name: t('Modifier Annonce'),
    component: CreateAd,
    layout: '/ad',
    path: '/updateAd/:id',
  },
  {
    name: t('Boite de messagerie'),
    icon: (
      <Icon
        as={MdEmail}
        width="20px"
        height="20px"
        color="inherit"
        mt={1}
      />
    ),
    component: Chat,
    layout: '/admin',
    path: '/chat',
  },]
const guestRoutes = [{
    name: t('Connexion'),
    layout: '/auth',
    path: '/sign-in',
    icon: (
      <Icon
        as={MdLock}
        width="20px"
        height="20px"
        color="inherit"
        mt={1}
      />
    ),
    component: SignInCentered,
  },

  {
    name: 'Confirmation inscription',

    path: '/confirm/:token',
    layout: '/register',
    component: Confirmation,
  },
  {
    name: 'Confirmation request',
    layout: '/register',

    path: '/confirmRequest',

    component: ConfirmRequest,
  },
  {
    name: 'Password Reset',
    layout: '/register',

    path: '/reset-password/:token',

    component: PasswordReset,
  },
  {
    name: 'Mot de passe perdu',
    layout: '/register',

    path: '/forgot-password',

    component: ForgotPassword,
  },
  {
    component: RegisterForm,
    layout: '/register',
    path: '/registerForm',
  },]

  if (userToken) {
    if (userToken.isAdmin) {
      combinedRoutes = [...routes, ...adminRoutes];  
    } else {
      combinedRoutes = [...routes, ...regularUserRoutes];  
    }
  } else {
    combinedRoutes = [...routes, ...guestRoutes];  
  }
export default combinedRoutes;
