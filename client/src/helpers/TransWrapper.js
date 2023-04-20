// TransWrapper.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '../locales/en.json';
import translationFR from '../locales/fr.json';
import { Select, Menu, MenuButton, MenuItem, IconButton, useColorModeValue } from "@chakra-ui/react";
import LanguageDetector from 'i18next-browser-languagedetector';
import { useHistory } from 'react-router-dom';
import { Fr, Us } from 'react-flags-icons'
import { FaLanguage } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";

const options = [
  { label: "English", value: "en", icon: <FaLanguage /> },
  { label: "Français", value: "fr", icon: <MdLanguage /> },
];


const getLocale = () => i18n.language.toLowerCase();
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationEN,
      },
      fr: {
        translation: translationFR,
      },
    },
    fallbackLng: 'fr',
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
      excludeCacheFor: ['cimode'], // exclude caching for this lang
    },
  });

const t = i18n.t.bind(i18n);

const LanguageSwitcher = () => {
  const history = useHistory();
  const iconColor = useColorModeValue("gray.600", "white");

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage, (error, t) => {
      if (error) return console.log('something went wrong loading', error);
      localStorage.setItem('language', newLanguage);
      history.go(0);
    

    });
  };
  

  return (
    <>  
    <Select variant='auth' name="language" value={getLocale()} onChange={handleLanguageChange} mt={5} icon={<MdLanguage />}>
      <option value="en"> English</option>
      <option value="fr"> Français</option>
    </Select></>
  
  );
};

export { t, LanguageSwitcher, getLocale };
