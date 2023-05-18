// TransWrapper.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '../locales/en.json';
import translationFR from '../locales/fr.json';
import translationAR from '../locales/ar.json';
import { Box,Button,MenuList,Icon ,Select, Menu, MenuButton, MenuItem, IconButton, useColorModeValue } from "@chakra-ui/react";
import LanguageDetector from 'i18next-browser-languagedetector';
import { useHistory } from 'react-router-dom';
import { FaLanguage } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";
import { Flag } from "@chakra-ui/icons";
import { ReactComponent as UkIcon } from "../assets/img/uk.svg";
import { ReactComponent as FrIcon } from "../assets/img/fr.svg";
import { ReactComponent as ArIcon } from "../assets/img/ar.svg";
import { useState, useEffect, useMemo } from "react";


const languageIcons = {
  en: UkIcon,
  fr: FrIcon,
  ar: ArIcon,
};

function LanguageIcon({ language, selected }) {
  const LanguageIconComponent = languageIcons[language];
  const boxSize = "32px"; // decrease the size of the unselected icon
  return <Box position="relative"><Icon as={LanguageIconComponent} boxSize={boxSize}  /></Box> ;
}

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
      ar: {
        translation: translationAR,
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
      <option value="ar"> عربى </option>
    </Select></>
  
  );
};
const LanguageNavbar = () => {
  const history = useHistory();
  localStorage.setItem('language', getLocale());


  const [selectedLanguage, setSelectedLanguage] = useState(getLocale()); // update the initial value

  const languages = useMemo(() => [
    { label: "English", value: "en-gb", flag: <LanguageIcon language="en" selected={selectedLanguage === "en"} /> },
    { label: "Français", value: "fr-fr", flag: <LanguageIcon language="fr" selected={selectedLanguage === "fr"} /> },
    { label: "عربى", value: "ar", flag: <LanguageIcon language="ar" selected={selectedLanguage === "ar"} /> },
  ], []);
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    i18n.changeLanguage(newLanguage, (error, t) => {
      if (error) return console.log('something went wrong loading', error);
      localStorage.setItem('language', newLanguage);
      history.go(0);
    

    });
    

  };
  useEffect(() => {
    const language = localStorage.getItem("language");
    if (language && languages.some((lang) => lang.value === language)) {
      setSelectedLanguage(language);
    }
  }, [languages]);
  return (
    <Menu>
      <MenuButton p="0px" >
        {languages.find((language) => language.value === selectedLanguage)?.flag}
      </MenuButton>
      <MenuList>
        {languages.map(({ label, value, flag }) => (
          <MenuItem key={value} value={value} onClick={handleLanguageChange}>
           
            {label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
export { t, LanguageSwitcher, getLocale, LanguageNavbar };
