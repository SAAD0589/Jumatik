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
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card.js';
import Menu from 'components/menu/MainMenu';
import IconBox from 'components/icons/IconBox';
import {
    columnsDataCheck,
    columnsDataComplex,
    columnsDataUsers,
    columnsSubcategories,
    columnsSecteurs
  } from "views/admin/default/variables/columnsData";
// Assets
import { MdCheckBox, MdDragIndicator } from 'react-icons/md';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ComplexTable from "views/admin/default/components/ComplexTable";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";

export default function SpecialFields(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'navy.700');
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const [name, setName] = useState();
  const [type, setType] = useState();
  const [options, setOptions] = useState();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

 const customField = {
    name: name,
    category: selectedCategory,
    type: type,
    options: options?.split(","),
  
  };
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const add = async () => {
  

    const configuration = {
      method: 'post',
      url: `${process.env.REACT_APP_API}/customFields//add/new`,
      data: customField,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    await axios(configuration)
      .then(result => {
       

        toast(
            `Champ ajouté avec sucées`,
            {
              position: 'top-center',
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            }
          );

     
      })
      .catch(error => {
        error = new Error();
      });
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
    setType('');
    setOptions('');


  };


  return (
    <Card p="20px" align="center" direction="column" w="100%" {...rest}>
      <Flex alignItems="center" w="100%" mb="30px">
        <Text color={textColor} fontSize="2xl" fontWeight="700">
          Champs spéciaux
        </Text>
      </Flex>

      <Flex alignItems="start" w="100%" mb="30px">
        <Text align="left" color={textColor} fontSize="md" fontWeight="500">
          Pour ajouter des champs personnalisés pour une catégorie spécifique,
          suivez ces étapes simples :
          <UnorderedList>
            <ListItem>
              Cliquez sur le bouton "Ajouter un champ personnalisé".
            </ListItem>
            <ListItem>
              Entrez le nom du champ personnalisé dans le champ "Nom du champ".
            </ListItem>
            <ListItem>
              Choisissez le type de champ personnalisé dans le menu déroulant
              "Type de champ". Vous pouvez choisir parmi les types suivants :
              "Texte", "Zone de texte", "Bouton radio" ou "Sélection".
            </ListItem>
            <ListItem>
              Si vous avez choisi "Bouton radio" ou "Sélection" comme type de
              champ personnalisé, entrez les options disponibles dans le champ
              "Options" séparées par des virgules.
            </ListItem>
            <ListItem>
              Cliquez sur le bouton "Enregistrer" pour ajouter le champ
              personnalisé.
            </ListItem>
          </UnorderedList>
        </Text>
      </Flex>
      <FormControl  onSubmit={e => handleSubmit(e)}>
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
            Type de champ personnalisé 
          </FormLabel>
          <Select value={type} onChange={e => setType(e.target.value)}
              
              fontSize="md"
              mb="24px"
              size="lg"
              variant="auth">
            <option value="text">Text</option>
            <option value="textarea">Zone de texte</option>
            <option value="radio">Bouton radio</option>
            <option value="select">Selection</option>
          </Select>
        </Box>
        {type === 'radio' || type === 'select' ? (
          <>
            <Box height="90px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Options de champ personnalisées (séparées par des virgules et sans espaces)
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
          w="80%"
          h="50"
          mb="24px"
          onClick={handleSubmit}
        >
          Enregistrer{' '}
        </Button>{' '}
      </FormControl>
      <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
    </Card>
  );
}
