import {
    Flex,
    Input,
    Table,
    Progress,
    Icon,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    Box,
    FormLabel,
    Select,
    Button
  } from "@chakra-ui/react";
  import React, { useMemo,useState,useEffect } from "react";
  import {
    useGlobalFilter,
    usePagination,
    useSortBy,
    useTable,
  } from "react-table";
  
  // Custom components
  import Card from "components/card/Card";
  import Menu from "components/menu/MainMenu";
  import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
  // Assets
  import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
  import axios  from 'axios';

  export default function SubcategoryConfig() {

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const [name, setName] = useState('');
  const [secteur, setSecteur] = useState('');

  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [regions, setRegions] = useState([]);


    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    const brandStars = useColorModeValue('brand.500', 'brand.400');

    useEffect(() => {
      axios
        .get(`${process.env.REACT_APP_API}/regions`)
        .then(res => setRegions(res.data))
        .catch(err => console.error(err));
    }, []);
    useEffect(() => {
      if (selectedRegion) {
        axios
          .get(`${process.env.REACT_APP_API}/cities/${selectedRegion}`)
          .then(res => setCities(res.data))
          .catch(err => console.error(err));
      }
    }, [selectedRegion]);

    useEffect(() => {
      axios
        .get(`${process.env.REACT_APP_API}/categories`)
        .then(res => setCategories(res.data))
        .catch(err => console.error(err));
    }, []);
    const HandleChange = e => {
      setName(e.target.value);
    };
    const HandleChangeSecteur = e => {
      setSecteur(e.target.value);
    };
    const onChangeRegion = e => {
      setSelectedRegion (e.target.value);
    };
    const onChangeCity = e => {
      setCity(e.target.value);
      const selectedCityName = e.target.value;

      const selectedCity = cities.find(city => city.name === selectedCityName);

      if (selectedCity) {
        setSelectedCityId(selectedCity.id);
        // do something with the selected city id
      }
    };
    const nameDr = name.replace(/[^a-zA-Z0-9]/g, '').replace(/\s/g, '');
    console.log(nameDr)

    const data = {
      name: nameDr,
      categoryId: selectedCategoryId,
      label: name,
      
    }
    const dataSecteur = {
      name: secteur,
      city: selectedCityId,
      
    }
    console.log(data)
    const handleSubmit = async e => {
      const configuration = {
        method: 'post',
        url: `${process.env.REACT_APP_API}/subcategories/add/new`,
        data: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      e.preventDefault();
      await axios(configuration)
      .then(result => {
 
      })
      .catch(error => {
        error = new Error();
      });
      toast('Sous categorie ajoutee avec succes!', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });

    
    }
    const handleSubmitSecteur = async e => {
      const configuration = {
        method: 'post',
        url: `${process.env.REACT_APP_API}/secteurs/add/new`,
        data: dataSecteur,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      e.preventDefault();
      await axios(configuration)
      .then(result => {
 
      })
      .catch(error => {
        error = new Error();
      });
      toast('Secteur ajoute avec succes!', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });

    
    }

    return (
      <>
      <Card
        direction='column'
        w='100%'
        px='0px'
        overflowX={{ sm: "scroll", lg: "hidden" }}>
            <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
        <Flex px='25px' justify='space-between' mb='10px' align='center'>
          <Text
            color={textColor}
            fontSize='22px'
            fontWeight='700'
            lineHeight='100%'>
            Configuration des Sous-categories
          </Text>
          
        </Flex>
        <Flex px='20px' justify='space-between' mb='1px' align='center'>

            <Select
            mr={1}
              id="category"
              name="categoryName"
              isRequired={true}
              fontSize="sm"
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
        
          </Flex>
          <Flex px='20px' justify='space-between' mb='1px' align='center'>
          <Input
              id="subCategory"
              isRequired={true}
              variant="auth"
              name="subCategory"
              fontSize="sm"
              ms={{ base: '0px', md: '0px' }}
              type="text"
              placeholder="Entrez le nom de la sous-categorie"
              mb="24px"
              fontWeight="500"
              size="lg"
             value={name}
             onChange={HandleChange}
            />
          </Flex>


          <Flex  px='20px' justify='space-between' mb='1px' align='center'>
          
          <Button 
            fontSize="sm"
            variant="brand"
            fontWeight="500"
            w="100%"
            h="50"
            mb="24px"
           onClick={handleSubmit}
          >
            Ajouter{' '}
          </Button>{' '}
          </Flex>

    
  


      
      
      </Card>
      <Card
        direction='column'
        w='100%'
        px='0px'
        overflowX={{ sm: "scroll", lg: "hidden" }}> 
            <Flex px='25px' justify='space-between' mb='10px' align='center'>
          <Text
            color={textColor}
            fontSize='22px'
            fontWeight='700'
            lineHeight='100%'>
            Configuration des Secteurs
          </Text>
          
        </Flex>
        <Flex px='20px' justify='space-between' mb='1px' align='center'>

                 <Select mr={1}
                        name="region"
                        variant="auth"

                        fontSize="sm"
                        ms={{ base: '0px', md: '0px' }}
                        placeholder="Choisissez votre region "
                        mb="24px"
                        fontWeight="200"
                        size="lg"
                        onChange={onChangeRegion}
                      >
                        {' '}
                        {regions.map(region => (
                          <option key={region.id} value={region.id}>
                            {' '}
                            {region.region}{' '}
                          </option>
                        ))}{' '}
                      </Select>{' '}
                      <Select
                        name="location"
                        variant="auth"

                        fontSize="sm"
                        ms={{ base: '0px', md: '0px' }}
                        placeholder="Choisissez votre ville "
                        mb="24px"
                        fontWeight="200"
                        size="lg"
                        onChange={onChangeCity}
                      >
                        {' '}
                        {cities.map(city => (
                          <option key={city.id} value={city.name}>
                            {' '}
                            {city.name}{' '}
                          </option>
                        ))}{' '}
                      </Select>{' '}
      
          </Flex>
          <Flex  px='20px' justify='space-between' mb='1px' align='center'>
          <Input
              id="secteur"
              isRequired={true}
              variant="auth"
              name="secteur"
              fontSize="sm"
              ms={{ base: '0px', md: '0px' }}
              type="text"
              placeholder="Entrez le nom du secteur"
              mb="24px"
              fontWeight="500"
              size="lg"
             value={secteur}
             onChange={HandleChangeSecteur}
            />
     
          </Flex>
          <Flex  px='20px' justify='space-between' mb='1px' align='center'>        <Button 
            fontSize="sm"
            variant="brand"
            fontWeight="500"
            w="100%"
            h="50"
            mb="24px"
           onClick={handleSubmitSecteur}
          >
            Ajouter{' '}
          </Button>{' '}</Flex>
        </Card>
      </>
    );
  }
  