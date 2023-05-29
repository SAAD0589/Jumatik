// Chakra imports
import {
  Box,

  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Center,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Select,
  Textarea,
  useColorModeValue,
  Stack,
  Radio,
  RadioGroup,
  SimpleGrid,
  Avatar,
  AvatarBadge,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Grid,
  Divider,
  Fade, ScaleFade, Slide, SlideFade, Collapse,
  useDisclosure
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card.js';
import Menu from 'components/menu/MainMenu';
import IconBox from 'components/icons/IconBox';
import { FaAngleDown } from "react-icons/fa";

import {
  columnsDataCheck,
  columnsDataComplex,
  columnsDataComplexSc,
  columnsDataUsers,
  columnsSubcategories,
  columnsSecteurs,
} from 'views/admin/default/variables/columnsData';
// Assets
import { MdCheckBox, MdDragIndicator } from 'react-icons/md';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ComplexTable from 'views/admin/default/components/ComplexTable';
import tableDataComplex from 'views/admin/default/variables/tableDataComplex.json';
import ComplexTableSc from 'views/admin/default/components/ComplexTableSc';

export default function SpecialFields(props) {
  const { ...rest } = props;
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const handleToggle1 = () => setIsOpen1(!isOpen1);
  const handleToggle2 = () => setIsOpen2(!isOpen2);
  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'navy.700');
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const [name, setName] = useState();
  const [type, setType] = useState();
  const [options, setOptions] = useState();
  const [nameS, setNameS] = useState();
  const [typeS, setTypeS] = useState();
  const [sOptions, setSOptions] = useState();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedSubcategoryLabel, setSelectedSubcategoryLabel] = useState('');
  const [customFields, setCustomFields] = useState([]);
  //  const [selectedCustomFieldId, setselectedCustomFieldId] = useState('');
  const [selectedCustomField, setSelectedCustomField] = useState('');
  const [selectedCustomFieldValue, setSelectedCustomFieldValue] = useState('');


  
  const customField = {
    name: name,
    category: selectedCategory,
    subcategory: selectedSubcategory,
    type: type,
    options: options?.split(','),
  };
  const subCustomField = {
    name: nameS,
    customFieldId: selectedCustomField._id,
    customFieldValue: selectedCustomFieldValue,
    category: selectedCategory,
    subcategory: selectedSubcategory,
    type: typeS,
    options: sOptions?.split(','),
  };



  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    if (selectedCategoryId) {
      axios
        .get(`${process.env.REACT_APP_API}/subcategories/${selectedCategoryId}`)
        .then(res => setSubcategories(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedCategoryId]);
  useEffect(() => {
    if (selectedSubcategory) {
      axios
        .get(`${process.env.REACT_APP_API}/customFields/get/subcategory/${selectedSubcategory}`)
        .then(res => setCustomFields(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedSubcategory]);

  const add = async () => {
    const configuration = {
      method: 'post',
      url: `${process.env.REACT_APP_API}/customFields/add/new`,
      data: customField,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    await axios(configuration)
      .then(result => {
        toast(`Champ ajouté avec sucées`, {
          position: 'top-center',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      })
      .catch(error => {
        error = new Error();
      });
  };
  const addSubC = async () => {
    const configuration = {
      method: 'post',
      url: `${process.env.REACT_APP_API}/subCustomFields/add/new`,
      data: subCustomField,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    await axios(configuration)
      .then(result => {
        toast(`Champ ajouté avec sucées`, {
          position: 'top-center',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      })
      .catch(error => {
        error = new Error();
      });
  };
  const handleSubmitSubC = async e => {
    e.preventDefault();

    if (!subCustomField.name?.trim()) {
      toast.error('Nommez votre champ!', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    }
    if (!subCustomField.type?.trim()) {
      toast.error('Ajoutez un type a  votre champ!', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    }


    if (!selectedCustomField.name?.trim()) {
      toast.error('Attribuez une un champs à votre sous-champ!', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    }

    await addSubC();
    setNameS('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setTypeS('');
    setSOptions('');
  };
  const handleSubmit = async e => {
    e.preventDefault();

    if (!customField.name?.trim()) {
      toast.error('Nommez votre champ!', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    }
    if (!customField.type?.trim()) {
      toast.error('Ajoutez un type a  votre champ!', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    }

    if (!selectedCategory?.trim()) {
      toast.error('Attribuez une catégorie à votre champ!', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    }

    await add();
    setName('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setType('');
    setOptions('');
  };
 

  return (
    <Card p="20px" align="center" direction="column" w="100%" {...rest}>
      <Flex alignItems="center" w="100%" mb="30px">
        <Text color={textColor} fontSize="2xl" fontWeight="700">
          Champs et Sous-champs spéciaux
        </Text>
      </Flex>

      <Flex alignItems="start" w="100%" mb="30px">
        <Text align="left" color={textColor} fontSize="md" fontWeight="500">
          Pour ajouter des champs et sous-champs personnalisés pour une
          catégorie et une sous-catégorie spécifiques, suivez ces étapes simples
          :
          <UnorderedList>
          <ListItem>
             Cliquez sur le bouton <strong>'Ajouter un Champs spécial'</strong> ou <strong>'Ajouter un Sous-champs spécial'</strong>
            </ListItem>
            <ListItem>
              Entrez le nom du champ (ou sous-champs) personnalisé dans le champ
              "Nom du champ".
            </ListItem>
           
            <ListItem>
              Choisissez le type de champ (ou sous-champs) personnalisé dans le
              menu déroulant "Type de champ". Vous pouvez choisir parmi les
              types suivants : "Texte", "Zone de texte", "Bouton radio" ou
              "Sélection".
            </ListItem>
            <ListItem>
              Si vous avez choisi "Bouton radio" ou "Sélection" comme type de
              champ personnalisé, entrez les options disponibles dans le champ
              (ou sous-champs) "Options" séparées par des virgules.
            </ListItem>
            <ListItem>
              Cliquez sur le bouton "Enregistrer" pour ajouter le champ (ou
              sous-champs) personnalisé.
            </ListItem>
          </UnorderedList>
        </Text>
      </Flex>
      <Divider mb={5} />
      <Grid templateColumns="repeat(2, 1fr)" gap={10}>
        <Box>
          <Box mb={10}>
            {' '}
            <Button colorScheme='purple' 
            fontSize="xl" 
            fontWeight="600" 
            rightIcon={<Icon as={FaAngleDown} transition="transform 0.2s" transform={isOpen1  ? "rotate(180deg)" : null} />} 
            onClick={handleToggle1}>
              Ajouter un Champs spécial
            </Button>
          </Box>
          <Collapse in={isOpen1} animateOpacity>
          <FormControl onSubmit={e => handleSubmit(e)}>
            <Box height="90px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Nom du champs personnalisé
              </FormLabel>
              <Input
                id="specialFieldName"
                isRequired={true}
                variant="auth"
                name="specialFieldName"
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                type="text"
                placeholder="Nom du champs"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Box>
            <Box height="90px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Choisissez une categorie
              </FormLabel>{' '}
              <Select
                id="category"
                name="categoryName"
                isRequired={true}
                fontSize="md"
                mb="24px"
                size="lg"
                variant="auth"
                onChange={e => {
                  const selectedCategoryId =
                    e.target.options[e.target.selectedIndex].dataset.id;
                  const selectedCategory = categories.find(
                    category => category._id === selectedCategoryId
                  );
                  setSelectedCategory(selectedCategory.name);
                  setSelectedCategoryId(selectedCategoryId);
                  setSelectedCategoryLabel(selectedCategory.label);
                }}
                placeholder="Choisir une categorie"
              >
                {categories.map(category => (
                  <option
                    key={category._id}
                    value={category.name}
                    name={category.label}
                    data-id={category._id}
                  >
                    {category.label}
                  </option>
                ))}
              </Select>
            </Box>
            <Box height="90px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Choisir une sous-categorie
              </FormLabel>{' '}
              <Select
                id="category"
                name="categoryName"
                isRequired={true}
                fontSize="sm"
                mb="24px"
                size="lg"
                variant="auth"
                onChange={e => {
                  setSelectedSubcategory(e.target.value);
                  setSelectedSubcategoryLabel(
                    e.target.options[e.target.selectedIndex].text
                  );
                }}
                placeholder="Choisir une sous-categorie"
              >
                {' '}
                {subcategories.map(subcategory => (
                  <option
                    key={subcategory._id}
                    value={subcategory.name}
                    name={subcategory.label}
                  >
                    {' '}
                    {subcategory.label}{' '}
                  </option>
                ))}{' '}
              </Select>
            </Box>
            <Box height="90px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Type de champ personnalisé 
              </FormLabel>
              <Select
                value={type}
                onChange={e => setType(e.target.value)}
                fontSize="md"
                mb="24px"
                size="lg"
                variant="auth"
              >
                <option value="text">Text</option>
                <option value="textarea">Zone de texte</option>
                <option value="radio">Bouton radio</option>
                <option value="select">Selection</option>
              </Select>
            </Box>
            {type === 'radio' || type === 'select' ? (
              <>
                <Box mb={5} height="90px">
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Options de champ personnalisées (séparées par des virgules
                    et sans espaces)
                  </FormLabel>
                  <Input
                    id="name"
                    isRequired={true}
                    variant="auth"
                    name="name"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="text"
                    placeholder="Options du champ"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    value={options}
                    onChange={e => setOptions(e.target.value)}
                  />
                </Box>
              </>
            ) : null}{' '}
            <Button
              fontSize="md"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              onClick={handleSubmit}
            >
              Enregistrer{' '}
            </Button>{' '}
          </FormControl></Collapse>
        </Box>
        <Box>
          <Box mb={10}>
            
            <Button colorScheme='blue' 
            fontSize="xl" 
            fontWeight="600"
            rightIcon={<Icon as={FaAngleDown} transition="transform 0.2s" transform={isOpen2 ? "rotate(180deg)" : null} />} 
            onClick={handleToggle2}>
              Ajouter un Sous-champs spécial
            </Button>
          </Box>
          <Collapse in={isOpen2} animateOpacity>
          <FormControl onSubmit={e => handleSubmitSubC(e)}>
            <Box height="90px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Nom du Sous-champs personnalisé
              </FormLabel>
              <Input
                id="specialFieldName"
                isRequired={true}
                variant="auth"
                name="specialFieldName"
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                type="text"
                placeholder="Nom du Sous-champs"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={name}
                onChange={e => setNameS(e.target.value)}
              />
            </Box>
            <Box height="90px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Choisissez une categorie
              </FormLabel>{' '}
              <Select
                id="category"
                name="categoryName"
                isRequired={true}
                fontSize="md"
                mb="24px"
                size="lg"
                variant="auth"
                onChange={e => {
                  const selectedCategoryId =
                    e.target.options[e.target.selectedIndex].dataset.id;
                  const selectedCategory = categories.find(
                    category => category._id === selectedCategoryId
                  );
                  setSelectedCategory(selectedCategory.name);
                  setSelectedCategoryId(selectedCategoryId);
                  setSelectedCategoryLabel(selectedCategory.label);
                }}
                placeholder="Choisir une categorie"
              >
                {categories.map(category => (
                  <option
                    key={category._id}
                    value={category.name}
                    name={category.label}
                    data-id={category._id}
                  >
                    {category.label}
                  </option>
                ))}
              </Select>
            </Box>
            <Box height="90px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Choisir une sous-categorie
              </FormLabel>{' '}
              <Select
                id="category"
                name="categoryName"
                isRequired={true}
                fontSize="sm"
                mb="24px"
                size="lg"
                variant="auth"
                onChange={e => {
                  setSelectedSubcategory(e.target.value);
                  setSelectedSubcategoryLabel(
                    e.target.options[e.target.selectedIndex].text
                  );
                }}
                placeholder="Choisir une sous-categorie"
              >
                {' '}
                {subcategories.map(subcategory => (
                  <option
                    key={subcategory._id}
                    value={subcategory.name}
                    name={subcategory.label}
                  >
                    {' '}
                    {subcategory.label}{' '}
                  </option>
                ))}{' '}
              </Select>
            </Box>
            <Box height="90px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Choisir un champs personnalisé
              </FormLabel>{' '}
              <Select
                id="category"
                name="categoryName"
                isRequired={true}
                fontSize="sm"
                mb="24px"
                size="lg"
                variant="auth"
                onChange={e => {
    const selectedCustomField = customFields.find(customField => customField.name === e.target.value);
    setSelectedCustomField(selectedCustomField);
    console.log(selectedCustomField._id);
  }}
                placeholder="Choisir un champs personnalisé"
              >
                {' '}
                {customFields.map(customField => (
                  <option
                    key={customField._id}
                    value={customField.name}
                    name={customField.name}
                  >
                    {' '}
                    {customField.name}{' '}
                  </option>
                ))}{' '}
              </Select>
            </Box>
            <Box height="90px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Choisir la valeure du champs personnalisé
              </FormLabel>{' '}
              <Select
                id="category"
                name="categoryName"
                isRequired={true}
                fontSize="sm"
                mb="24px"
                size="lg"
                variant="auth"
                onChange={e => {
                  setSelectedCustomFieldValue(e.target.value);
                  
                
                }}
                placeholder="Choisir la valeure du champs personnalisé"
              >
                {' '}
                {selectedCustomField?.options?.map(option => (
                  <option
                    key={option._id}
                    value={option}
                    name={option}
                  >
                    {' '}
                    {option}{' '}
                  </option>
                ))}{' '}
              </Select>
            </Box>
            <Box height="90px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Type du Sous-champs personnalisé 
              </FormLabel>
              <Select
                value={typeS}
                onChange={e => setTypeS(e.target.value)}
                fontSize="md"
                mb="24px"
                size="lg"
                variant="auth"
              >
                <option value="text">Text</option>
                <option value="textarea">Zone de texte</option>
                <option value="radio">Bouton radio</option>
                <option value="select">Selection</option>
              </Select>
            </Box>
            {typeS === 'radio' || typeS === 'select' ? (
              <>
                <Box mb={5} height="90px">
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Options du sous-champ personnalisées (séparées par des
                    virgules et sans espaces)
                  </FormLabel>
                  <Input
                    id="name"
                    isRequired={true}
                    variant="auth"
                    name="name"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="text"
                    placeholder="Options du champ"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    value={options}
                    onChange={e => setSOptions(e.target.value)}
                  />
                </Box>
              </>
            ) : null}{' '}
            <Button
              fontSize="md"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              onClick={handleSubmitSubC}
            >
              Enregistrer{' '}
            </Button>{' '}
          </FormControl></Collapse>
        </Box>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={10}>  <ComplexTable
        columnsData={columnsDataComplex}
        
      />
        <ComplexTableSc
        columnsData={columnsDataComplexSc}
        
      /></Grid>
    
    </Card>
  );
}
