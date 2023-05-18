import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import axios from 'axios';
import CategorySelect from '../component/CategorySelect';
import useAlert from '../../../components/alert/useAlert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone } from 'react-dropzone';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { FaTrash } from 'react-icons/fa';
import Nft3 from 'assets/img/nfts/Nft3.png';

// Chakra imports
import {
  ThemeProvider,
  theme,
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
  Select,
  Image,
  useDisclosure,
  CloseButton,
  Grid,
  GridItem,
  Progress,
  ButtonGroup
} from '@chakra-ui/react';
import { CloseIcon, AddIcon } from '@chakra-ui/icons';

import { MdUpload } from 'react-icons/md';
import { SmallCloseIcon } from '@chakra-ui/icons';
// Custom components
import { HSeparator } from 'components/separator/Separator';
// Assets
import illustration from 'assets/img/auth/auth.png';
import Dropzone from 'views/admin/profile/components/Dropzone';
import Card from 'components/card/Card.js';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { t } from 'helpers/TransWrapper';

const CreateAd = () => {
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const bg = useColorModeValue('gray.100', 'navy.700');
  const borderColor = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
  const { success, error } = useAlert();
  const history = useHistory();
  const [login, setLogin] = useState(false);
  const userData = localStorage.getItem('user-token');
  const user = JSON.parse(userData);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedSubcategoryLabel, setSelectedSubcategoryLabel] = useState('');

  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCityId, setSelectedCityId] = useState('');

  const [secteurs, setSecteurs] = useState([]);
  const [selectedSecteur, setSelectedsecteur] = useState('');
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33.33);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [tableFields, setTableFields] = useState({});
  const [tableSubFields, setTableSubFields] = useState([]);
  const [tableFieldsCat, setTableFieldsCat] = useState([]);
  const [adId, setAdId] = useState();

  const useGetSubFields = (fieldId, fieldValue) => {
    const [tableSubFields, setTableSubFields] = useState({});

    useEffect(() => {
      axios
        .get(
          `${process.env.REACT_APP_API}/subCustomFields/get/customField/value/${fieldValue}`
        )
        .then(response => {
          setTableSubFields(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }, [fieldId, fieldValue]);

    return { tableSubFields };
  };
  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(
          `${process.env.REACT_APP_API}/customFields/get/category/${selectedCategory}`
        )
        .then(response => {
          setTableFieldsCat(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [selectedCategory]);
  useEffect(() => {
    if (selectedSubcategory) {
      axios
        .get(
          `${process.env.REACT_APP_API}/customFields/get/subcategory/${selectedSubcategory}`
        )
        .then(response => {
          setTableFields(response.data[0]); // set the first object in the array as the state value
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [selectedSubcategory]);

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
    axios
      .get(`${process.env.REACT_APP_API}/cities/`)
      .then(res => setCities(res.data))
      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    if (selectedCityId) {
      axios
        .get(`${process.env.REACT_APP_API}/secteurs/${selectedCityId}`)
        .then(res => setSecteurs(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedCityId]);

  const [ad, setAd] = useState({
    userId: user._id,
    firstName: user?.firstName,
    lastName: user.lastName,
    phone: user.phone,
    categoryName: '',
    subcategoryName: '',
    name: '',
    secteur: '',
    city: '',
    region: '',
    price: t('Non défini'),
    description: '',
    adPictures: [],
    status: t('En cours de Validation'),
    userProfilePicture: user.profilePicture,
  });
  const [fieldsValues, setFieldsValues] = useState([
    {
      ad_id: '',
      field_id: '',
      field_name: '',
      value: '',
    },
  ]);
  const [subFieldsValues, setSubFieldsValues] = useState([
    {
      ad_id: '',
      field_id: '',
      field_name: '',
      value: '',
    },
  ]);

  const HandleChange = e => {
    const { name, value } = e.target;
    setAd({
      ...ad, //spread operator
      [name]: value,
    });
  };
  const [files, setFiles] = useState(new Array(6).fill(null));
  // const fileInputs = useRef(new Array(6).fill(null));
  // const [file, setFile] = useState([]);

  // const handleFileChange = (event,index) => {
  //   setAd({
  //     ...ad, //spread operator
  //     adPictures: event.target.files,
  //   });
  //   setFile(event.target.files);
  //   const newFiles = [...files];
  //   newFiles[index] = event.target.files[0];
  //   setFiles(newFiles);
  // };
  function showToastAndRedirect() {
    try {
      history.push('/');
    } catch (error) {
      console.error(error);
    }
  }
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [adPictures, setAdPictures] = useState([]);

  const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    //file.url=URL.createObjectURL(file);
    reader.readAsDataURL(file);

    reader.onload = () => {
      const newImage = {
        id: images.length + 1,
        src: reader.result,
      };
      const updatedFiles = [...files];
      updatedFiles[index] = file;
      setFiles(updatedFiles);

      const updatedImages = [...images];
      updatedImages[index] = newImage;
      setImages(updatedImages);

      const updatedAdPictures = [...ad.adPictures];
      updatedAdPictures[index] = reader.result;

      setAd({
        ...ad,
        adPictures: updatedImages,
      });
    };

    reader.onerror = error => {
      console.error('Error: ', error);
    };
  };

  // images.forEach(element => {
  // console.log(element.src);
  // })
  const handleDelete = id => {
    setImages(images.filter(image => image.id !== id));
  };

  const handleDragStart = (event, id) => {
    event.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  const handleDrop = (event, index) => {
    event.preventDefault();

    const data = event.dataTransfer.getData('text/plain');
    const draggedImage = images.find(image => image.id === +data);

    const remainingImages = images.filter(image => image.id !== +data);
    const newImages = [
      ...remainingImages.slice(0, index),
      draggedImage,
      ...remainingImages.slice(index),
    ];

    setImages(newImages);
  };

  const handleFieldsChange = (fieldId, fieldType, e) => {
    let value;
    if (fieldType === 'radio') {
      value = e;
    } else if (fieldType === 'select') {
      value = e.target.value;
    } else {
      value = e.target.value;
    }

    setFieldsValues(prevFieldsValues => {
      const updatedValues = [...prevFieldsValues];
      const index = updatedValues.findIndex(item => item.field_id === fieldId);
      if (index >= 0) {
        updatedValues[index].value = value;
      } else {
        updatedValues.push({
          ad_id: ad._id,
          field_id: fieldId,
          field_name: e.target.name,
          value: value,
        });
      }
      return updatedValues;
    });
  };
  useEffect(() => {
    console.log(fieldsValues.find(item => item.field_id === tableFields._id));

    axios
      .get(
        `${process.env.REACT_APP_API}/subCustomFields/get/customField/value/${
          fieldsValues.find(item => item.field_id === tableFields._id)?.value
        }`
      )
      .then(response => {
        setTableSubFields(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [fieldsValues, tableFields._id]);

  const handleSubFieldsChange = (subfieldId, subfieldType, e) => {
    let value;
    if (subfieldType === 'radio') {
      value = e;
    } else if (subfieldType === 'select') {
      value = e.target.value;
    } else {
      value = e.target.value;
    }

    setSubFieldsValues(prevFieldsValues => {
      const updatedValues = [...prevFieldsValues];
      const index = updatedValues.findIndex(
        item => item.field_id === subfieldId
      );
      if (index >= 0) {
        updatedValues[index].value = value;
      } else {
        updatedValues.push({
          ad_id: ad._id,
          field_id: subfieldId,
          field_name: e.target.name,
          value: value,
        });
      }
      return updatedValues;
    });
  };
// 
  const add = async (fieldsValues, subfieldsValues) => {
    const formData = new FormData();
    const promises = [];
    formData.append('userId', ad.userId);
    formData.append('firstName', ad?.firstName);
    formData.append('lastName', ad.lastName);
    formData.append('phone', ad.phone);
    formData.append('name', ad.name);
    formData.append('secteur', selectedSecteur);
    formData.append('city', selectedCity);
    formData.append('region', selectedRegion);
    formData.append('subcategoryName', selectedSubcategory);
    formData.append('subcategoryLabel', selectedSubcategoryLabel);
    formData.append('categoryName', selectedCategory);
    formData.append('categoryLabel', selectedCategoryLabel);
    formData.append('price', ad.price);
    formData.append('description', ad.description);
    formData.append('userProfilePicture', ad.userProfilePicture);
    formData.append('status', ad.status);
    console.log(images);
    images.forEach(element => {
      formData.append("adPictures", element.src) // check this out for more info: https://developer.mozilla.org/en-US/docs/Web/API/FormData/append#example
   })
    
    
    
    

    const configuration = {
      method: 'put',
      url: `${process.env.REACT_APP_API}/ads`,
      data: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    await axios(configuration)
      .then(result => {
        setLogin(true);

        const adToken = result.data;
        setAdId(adToken._id);
        const foundFieldValue = fieldsValues.find(
          item => item.field_id === tableFields._id
        );

        const fieldValue = {
          ad_id: adToken._id,
          field_id: tableFields._id,
          field_name: tableFields.name,
          value: foundFieldValue ? foundFieldValue.value : '',
        };

        try {
          const response = axios.post(
            `${process.env.REACT_APP_API}/customFieldsValues/add/new`,
            fieldValue,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          console.log(response.data);
          // show a success message to the user
          toast.success('Field value created successfully!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        } catch (error) {
          console.log(error);
          // show an error message to the user
          toast.error('Error creating field value!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        }

        const fieldValuesCat = tableFieldsCat.map(field => {
          const foundFieldValue = fieldsValues.find(
            item => item.field_id === field._id
          );
          return {
            ad_id: adToken._id,
            field_id: field._id,
            field_name: field.name,
            value: foundFieldValue ? foundFieldValue.value : '',
          };
        });
        for (const fieldValueCat of fieldValuesCat) {
          try {
            const response = axios.post(
              `${process.env.REACT_APP_API}/customFieldsValues/add/new`,
              fieldValueCat,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );
            console.log(response.data);
            // show a success message to the user
            toast.success('Field value created successfully!', {
              position: 'top-center',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored',
            });
          } catch (error) {
            console.log(error);
            // show an error message to the user
            toast.error('Error creating field value!', {
              position: 'top-center',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored',
            });
          }
        }

        const subfieldValues = tableSubFields.map(field => {
          const foundFieldValue = subfieldsValues.find(
            item => item.field_id === field._id
          );
          return {
            ad_id: adToken._id,
            field_id: field._id,
            field_name: field.name,
            value: foundFieldValue ? foundFieldValue.value : '',
          };
        });
        for (const subfield of subfieldValues) {
          try {
            const response = axios.post(
              `${process.env.REACT_APP_API}/subCustomFieldsValues/add/new`,
              subfield,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );
            console.log(response.data);
            // show a success message to the user
            toast.success('Field value created successfully!', {
              position: 'top-center',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored',
            });
          } catch (error) {
            console.log(error);
            // show an error message to the user
            toast.error('Error creating field value!', {
              position: 'top-center',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored',
            });
          }
        }
        if (!adToken) {
          error('Error', 'Un probleme est survenu ');
          return;
        }
      })
      .catch(error => {
        error = new Error();
      });
  };
  const adData = {
    name: document.getElementById('name')?.value,
    description: document.getElementById('description')?.value,
    userId: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    categoryName: document.getElementById('category')?.value,
    subcategoryName: document.getElementById('subcategory')?.value,
    secteur: document.getElementById('secteur')?.value,
    city: document.getElementById('city')?.value,
    region: document.getElementById('region')?.value,
    price: 'Non défini',
    adPictures: '',
    status: 'Brouillon',
    userProfilePicture: user.profilePicture,

    // Other fields
  };
  const [draftId, setDraftId] = useState(null);

  const saveDraft = async adData => {
    try {
      if (!draftId) {
        const configuration = {
          method: 'post',
          url: `${process.env.REACT_APP_API}/ads/draft/save`,
          data: adData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        };

        await axios(configuration)
          .then(result => {
            const adToken = result.data;
            setDraftId(result.data._id);

            if (!adToken) {
              error('Error', 'Un probleme est survenu ');
              return;
            }
          })
          .catch(error => {
            error = new Error();
          });
      } else {
        // Update the existing draft
        const configuration = {
          method: 'put',
          url: `${process.env.REACT_APP_API}/ads/draft/update/${draftId}`,
          data: adData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        };

        await axios(configuration)
          .then(result => {
            const adToken = result.data;

            if (!adToken) {
              error('Error', 'Un probleme est survenu ');
              return;
            }
          })
          .catch(error => {
            error = new Error();
          });
      }
    } catch (error) {
      console.error(error);
    }
  };
  // Get all links within the app

  useEffect(() => {
    // Save the draft every 30 seconds
    const interval = setInterval(() => {
      saveDraft(adData);
    }, 5000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [adData]);

  // Add beforeunload event listener to save draft when user leaves the current view

  const handleSubmit = async e => {
    e.preventDefault();

    if (!ad.name.trim()) {
      toast.error('Nommez votre annonce!', {
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
    if (!ad.description.trim()) {
      toast.error('Décrivez votre annonce!', {
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
    if (!selectedCity.trim()) {
      toast.error('Donner une ville à votre annonce!', {
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
    if (!ad.price.trim()) {
      toast.error(`Fixez le prix de votre annonce!`, {
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
    if (!selectedCategory.trim()) {
      toast.error('Attribuez une catégorie à votre annonce!', {
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

    await add(fieldsValues, subFieldsValues);

    toast(
      `Nous avons bien reçu votre annonce et nous vous remercions de votre confiance. Votre annonce est en cours de vérification et sera publiée prochainement si elle respecte nos critères de publication.

      Nous vous informerons de la décision prise dans les heures à venir. Merci de patienter pendant que nous examinons votre annonce.`,
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
    setTimeout(() => {
      showToastAndRedirect();
    }, 4000);
  };






  return (
    <Card padding="20px" mt={{ base: '80px', md: '10px' }}>
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
      <Flex
        direction="column"
        w={{ base: '100%', md: '100%' }}
        maxW="100%"
        background="transparent"
        borderRadius="15px"
        mx={{ base: 'auto', lg: 'unset' }}
        me="auto"
        mb={{ base: '20px', md: 'auto' }}
      >
        <Text
          mb={5}
          color={textColor}
          align="start"
          fontSize="2xl"
          fontWeight="600"
        >
          {t('Ajoutez une annonce gratuitement')}{' '}
        </Text>
        <Box textAlign="left">
        <Progress
        alignContent="start"
          hasStripe
          size='md'
          value={progress}
          mb="5%"
          colorScheme="purple"
          width="100%"
         
        borderRadius="full"
        boxShadow="0 2px 5px rgba(0, 0, 0, 0.1)"
          isAnimated></Progress>
        </Box>
      
        <FormControl onSubmit={e => handleSubmit(e)}>
       
        <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        p={6}
        m="10px auto"
        as="form">
        
       
        {step === 1 ?   <>
        <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
       { t('Etape 1: Identification de votre annonce')}
      </Heading>
      <FormControl>
      <FormLabel
            display="flex"
            ms="4px"
            fontSize="md"
            fontWeight="500"
            color={textColor}
            mb="8px"
            mt={10}
          >
            {t('Ajoutez les images du produit (Max 6 images)')}  
          </FormLabel>{' '}
      <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
            mt={10}
          >
          <ul>
            <li>{t('Une annonce avec des images a plus de visibilité')} </li>
            <li>{t('La première image est la principale')} </li>
            <li>{t(`Pour changer l'image principale glisser l'image de votre choix vers la première case`)}
 </li>
          </ul>
         </FormLabel>{' '}
          <Box>
            <Grid  gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }} display={{ base: 'block', xl: 'grid' }} gap={4} mb="10px">
              {Array.from({ length: 6 }).map((_, index) => {
                const image = images[index];

                return (
                  <GridItem key={index} mb={2}>
                  <Box
      border={index === 0 ? '4px dashed red' : '2px dashed gray'}
      height="100%"
      width="100%"
      onDragOver={handleDragOver}
      onDrop={(event) => handleDrop(event, index)}
    >
                      {image ? (
                        <>
                          <Box position="relative">
                            <IconButton
                              colorScheme="red"
                              aria-label="Delete Image"
                              icon={<CloseIcon />}
                              size="sm"
                              onClick={() => handleDelete(image.id)}
                              position="absolute"
                              top="2"
                              right="2"
                            />
                            <Image
                              src={image.src}
                              w="100%"
                              h="100%"
                              objectFit="cover"
                              draggable
                              onDragStart={event =>
                                handleDragStart(event, image.id)
                              }
                            />
                          </Box>
                        </>
                      ) : (
                        index === 0 ?
                        <Button
                          as="label"
                          htmlFor="fileInput"
                          w="100px"
                          h="100px"
                          bg="transparent"
                          _hover={{ bg: 'transparent' }}
                          _active={{ bg: 'transparent' }}
                          _focus={{ boxShadow: 'none' }}
                          leftIcon={<AddIcon />}
                          cursor="pointer"
                        >
                          
                          {t(`Image principale`)}
                          <Input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            style={{
                              display: 'none',
                            }}
                            onChange={event => handleFileChange(event, index)}
                          />
                        </Button> : <Button
                          as="label"
                          htmlFor="fileInput"
                          w="100px"
                          h="100px"
                          bg="transparent"
                          _hover={{ bg: 'transparent' }}
                          _active={{ bg: 'transparent' }}
                          _focus={{ boxShadow: 'none' }}
                          leftIcon={<AddIcon />}
                          cursor="pointer"
                        >
                          {t('Ajouter une image')}
                          <Input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            style={{
                              display: 'none',
                            }}
                            onChange={event => handleFileChange(event, index)}
                          />
                        </Button>
                        
                      )}
                    </Box>
                  </GridItem>
                );
              })}
            </Grid>
          </Box>
          <Flex h="100%" px={5} mb={2}></Flex>
          <Box height="90px">
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="md"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              {t(`Nom de l 'annonce`)}
              <Text color={brandStars}>*</Text>{' '}
            </FormLabel>{' '}
            <Input
              id="name"
              isRequired={true}
              variant="auth"
              name="name"
              fontSize="sm"
              ms={{ base: '0px', md: '0px' }}
              type="text"
              placeholder={t(`Entrez le nom de l'annonce`)}
              mb="24px"
              fontWeight="500"
              size="lg"
              value={ad.name}
              onChange={HandleChange}
              
            />
          </Box>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="md"
            fontWeight="500"
            color={textColor}
            mb="8px"
          >
            {t(`Entrez la description de l 'annonce`)}
            <Text color={brandStars}>*</Text>{' '}
          </FormLabel>
          <Textarea
            id="description"
            fontSize="sm"
            mb="24px"
            fontWeight="500"
            size="lg"
            ms={{ base: '0px', md: '0px' }}
            isRequired={true}
            placeholder="description de l'annonce"
            value={ad.description}
            name="description"
            onChange={HandleChange}
          />
          <Box height="90px">
            <FormLabel
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              display="flex"
            >
              {t(`Entrez le prix en MAD`)} <Text color={brandStars}> * </Text>{' '}
            </FormLabel>{' '}
            <InputGroup size="md">
              <Input
                isRequired={true}
                fontSize="sm"
                placeholder={t(`Entrez le prix en MAD`)}
                mb="24px"
                size="lg"
                variant="auth"
                value={ad.price}
                name="price"
                onChange={HandleChange}
              />
            </InputGroup>{' '}
          </Box>{' '}
      </FormControl>
      </> : step === 2 ? <>
        <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
 { t('Etape 2: Classification de votre annonce ')}
      </Heading>
      <FormControl>
      <Box height="90px">
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="md"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              {t(`Choisir une categorie`)} <Text color={brandStars}> * </Text>{' '}
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
                const selectedCategoryId =
                  e.target.options[e.target.selectedIndex].dataset.id;
                const selectedCategory = categories.find(
                  category => category._id === selectedCategoryId
                );
                setSelectedSubcategory(null);
                setSelectedCategory(selectedCategory.name);
                setSelectedCategoryId(selectedCategoryId);
                setSelectedCategoryLabel(selectedCategory.label);
              }}
              placeholder={t(`Choisir une categorie`)}
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
              fontSize="md"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              {t(`Choisir une sous-categorie`)}{' '}
              <Text color={brandStars}> * </Text>{' '}
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
              placeholder={t(`Choisir une sous-categorie`)}
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
          {selectedSubcategory && (
            <>
              <>
                <Box height="90px">
                  <FormLabel
                    ms="4px"
                    fontSize="md"
                    fontWeight="500"
                    color={textColor}
                    display="flex"
                  >
                    {tableFields.name}
                  </FormLabel>
                  <FormControl isRequired={true}>
                    {tableFields.type === 'text' && (
                      <InputGroup size="md">
                        <Input
                          fontSize="sm"
                          placeholder="Enter text"
                          mb="24px"
                          size="lg"
                          variant="auth"
                          value={
                            fieldsValues.find(
                              item => item.field_id === tableFields._id
                            )?.value
                          }
                          onChange={value =>
                            handleFieldsChange(
                              tableFields._id,
                              tableFields.type,
                              value
                            )
                          }
                          name={tableFields.name}
                        />
                      </InputGroup>
                    )}
                    {tableFields.type === 'textarea' && (
                      <Textarea
                        fontSize="sm"
                        placeholder="Enter text"
                        mb="24px"
                        size="lg"
                        variant="auth"
                        name={tableFields.name}
                        value={
                          fieldsValues.find(
                            item => item.field_id === tableFields._id
                          )?.value
                        }
                        onChange={value =>
                          handleFieldsChange(
                            tableFields._id,
                            tableFields.type,
                            value
                          )
                        }
                      />
                    )}
                    {tableFields.type === 'radio' && (
                      <RadioGroup
                        variant="auth"
                        name={tableFields.name}
                        value={
                          fieldsValues.find(
                            item => item.field_id === tableFields._id
                          )?.value
                        }
                        onChange={value =>
                          handleFieldsChange(
                            tableFields._id,
                            tableFields.type,
                            value
                          )
                        }
                        mb="24px"
                        size="lg"
                      >
                        <Stack direction="row">
                          {tableFields.options.map(option => (
                            <Radio value={option} key={option}>
                              {option}
                            </Radio>
                          ))}
                        </Stack>
                      </RadioGroup>
                    )}
                    {tableFields.type === 'select' && (
                      <Select
                        placeholder="Select option"
                        name={tableFields.name}
                        value={
                          fieldsValues.find(
                            item => item.field_id === tableFields._id
                          )?.value
                        }
                        onChange={value =>
                          handleFieldsChange(
                            tableFields._id,
                            tableFields.type,
                            value
                          )
                        }
                        fontSize="sm"
                        mb="24px"
                        size="lg"
                        variant="auth"
                      >
                        {tableFields.options.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                    )}
                  </FormControl>
                </Box>
                {console.log(
                  fieldsValues.find(item => item.field_id === tableFields._id)
                )}
                {fieldsValues.find(
                  item => item.field_id === tableFields._id
                ) && (
                  <>
                    {tableSubFields.map(subField => (
                      <Box height="90px">
                        <FormLabel
                          ms="4px"
                          fontSize="md"
                          fontWeight="500"
                          color={textColor}
                          display="flex"
                        >
                          {subField.name}
                        </FormLabel>
                        <FormControl isRequired={true}>
                          {subField.type === 'text' && (
                            <InputGroup size="md">
                              <Input
                                fontSize="sm"
                                placeholder="Enter text"
                                mb="24px"
                                size="lg"
                                variant="auth"
                                value={
                                  subFieldsValues.find(
                                    item => item.field_id === subField._id
                                  )?.value
                                }
                                onChange={value =>
                                  handleFieldsChange(
                                    subField._id,
                                    subField.type,
                                    value
                                  )
                                }
                                name={subField.name}
                              />
                            </InputGroup>
                          )}
                          {subField.type === 'textarea' && (
                            <Textarea
                              fontSize="sm"
                              placeholder="Enter text"
                              mb="24px"
                              size="lg"
                              variant="auth"
                              name={subField.name}
                              value={
                                subFieldsValues.find(
                                  item => item.field_id === subField._id
                                )?.value
                              }
                              onChange={value =>
                                handleSubFieldsChange(
                                  subField._id,
                                  subField.type,
                                  value
                                )
                              }
                            />
                          )}
                          {subField.type === 'radio' && (
                            <RadioGroup
                              variant="auth"
                              name={subField.name}
                              value={
                                subFieldsValues.find(
                                  item => item.field_id === subField._id
                                )?.value
                              }
                              onChange={value =>
                                handleSubFieldsChange(
                                  subField._id,
                                  subField.type,
                                  value
                                )
                              }
                              mb="24px"
                              size="lg"
                            >
                              <Stack direction="row">
                                {subField.options.map(option => (
                                  <Radio value={option} key={option}>
                                    {option}
                                  </Radio>
                                ))}
                              </Stack>
                            </RadioGroup>
                          )}
                          {subField.type === 'select' && (
                            <Select
                              placeholder="Select option"
                              name={subField.name}
                              value={
                                subFieldsValues.find(
                                  item => item.field_id === subField._id
                                )?.value
                              }
                              onChange={value =>
                                handleSubFieldsChange(
                                  subField._id,
                                  subField.type,
                                  value
                                )
                              }
                              fontSize="sm"
                              mb="24px"
                              size="lg"
                              variant="auth"
                            >
                              {subField.options.map(option => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </Select>
                          )}
                        </FormControl>
                      </Box>
                    ))}
                  </>
                )}
              </>
            </>
          )}
          {selectedCategory && (
            <>
              {tableFieldsCat.map(field => (
                <Box height="90px">
                  <FormLabel
                    ms="4px"
                    fontSize="md"
                    fontWeight="500"
                    color={textColor}
                    display="flex"
                  >
                    {field.name}
                  </FormLabel>
                  <FormControl isRequired={true}>
                    {field.type === 'text' && (
                      <InputGroup size="md">
                        <Input
                          fontSize="sm"
                          placeholder="Enter text"
                          mb="24px"
                          size="lg"
                          variant="auth"
                          value={
                            fieldsValues.find(
                              item => item.field_id === field._id
                            )?.value
                          }
                          onChange={value =>
                            handleFieldsChange(field._id, field.type, value)
                          }
                          name={field.name}
                        />
                      </InputGroup>
                    )}
                    {field.type === 'textarea' && (
                      <Textarea
                        fontSize="sm"
                        placeholder="Enter text"
                        mb="24px"
                        size="lg"
                        variant="auth"
                        name={field.name}
                        value={
                          fieldsValues.find(item => item.field_id === field._id)
                            ?.value
                        }
                        onChange={value =>
                          handleFieldsChange(field._id, field.type, value)
                        }
                      />
                    )}
                    {field.type === 'radio' && (
                      <RadioGroup
                        variant="auth"
                        name={field.name}
                        value={
                          fieldsValues.find(item => item.field_id === field._id)
                            ?.value
                        }
                        onChange={value =>
                          handleFieldsChange(field._id, field.type, value)
                        }
                        mb="24px"
                        size="lg"
                      >
                        <Stack direction="row">
                          {field.options.map(option => (
                            <Radio value={option} key={option}>
                              {option}
                            </Radio>
                          ))}
                        </Stack>
                      </RadioGroup>
                    )}
                    {field.type === 'select' && (
                      <Select
                        placeholder="Select option"
                        name={field.name}
                        value={
                          fieldsValues.find(item => item.field_id === field._id)
                            ?.value
                        }
                        onChange={value =>
                          handleFieldsChange(field._id, field.type, value)
                        }
                        fontSize="sm"
                        mb="24px"
                        size="lg"
                        variant="auth"
                      >
                        {field.options.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                    )}
                  </FormControl>
                </Box>
              ))}
            </>
          )}
      </FormControl>
      </> : <>
        <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
          { t('Etape 3: Localisation de votre annonce ')}

      </Heading>
      <FormControl>
      <Box height="90px">
            <FormLabel
              ms="4px"
              fontSize="md"
              fontWeight="500"
              color={textColor}
              display="flex"
            >
              {t(`Choisissez votre ville`)} <Text color={brandStars}> * </Text>{' '}
            </FormLabel>{' '}
            <InputGroup>
              <Select
                id="city"
                name="location"
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                placeholder={t(`Choisissez votre ville`)}
                mb="24px"
                fontWeight="200"
                size="lg"
                onChange={e => {
                  const selectedCityName = e.target.value;

                  const selectedCity = cities.find(
                    city => city.name === selectedCityName
                  );

                  if (selectedCity) {
                    setSelectedCityId(selectedCity.id);
                    // do something with the selected city id
                  }
                  setSelectedCity(e.target.value);
                }}
              >
                {' '}
                {cities.map(city => (
                  <option key={city.id} value={city.name}>
                    {' '}
                    {city.name}{' '}
                  </option>
                ))}{' '}
              </Select>
            </InputGroup>
          </Box>{' '}
          <Box height="90px">
            <FormLabel
              ms="4px"
              fontSize="md"
              fontWeight="500"
              color={textColor}
              display="flex"
            >
              {t(`Choisissez votre secteur`)}{' '}
              <Text color={brandStars}> * </Text>{' '}
            </FormLabel>{' '}
            <InputGroup>
              <Select
                id="city"
                name="location"
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                placeholder={t(`Choisissez votre secteur`)}
                mb="24px"
                fontWeight="200"
                size="lg"
                onChange={e => setSelectedsecteur(e.target.value)}
              >
                {' '}
                {secteurs.map(secteur => (
                  <option key={secteur._id} value={secteur.name}>
                    {' '}
                    {secteur.name}{' '}
                  </option>
                ))}{' '}
              </Select>
            </InputGroup>
          </Box>{' '}
          <Alert status="error" mb={5} align="start">
            <AlertDescription>
              {t(
                `Pour créer une nouvelle annonce, veuillez noter que les contenus à caractère sexuel, promotionnels de produits illégaux ou dangereux, ou tout autre contenu considéré comme inapproprié ne seront pas acceptés. Nous nous réservons le droit de refuser ou de retirer toute annonce qui ne respecte pas nos règles de publication. Merci de votre compréhension.`
              )}
            </AlertDescription>
          </Alert>
      </FormControl>
      </>}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1);
                  setProgress(progress - 33.33);
                }}
                isDisabled={step === 1}
                colorScheme="purple"
                variant="solid"
                w="7rem"
                mr="5%">
                 {t('Précédent')}
              </Button>
              <Button
                w="7rem"
                isDisabled={step === 3}
                onClick={() => {
                  setStep(step + 1);
                  if (step === 3) {
                    setProgress(100);
                  } else {
                    setProgress(progress + 33.33);
                  }
                }}
                colorScheme="purple"
                variant="outline">
                {t('Suivant')}
              </Button>
            </Flex>
            {step === 3 ? (
              <Button
            fontSize="sm"
            variant="brand"
            fontWeight="500"
            w="7rem"            
            onClick={handleSubmit}
          >
            {t(`Ajouter`)}{' '}
          </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>


     
         
        </FormControl>
    
      </Flex>

    </Card>
  );
}

export default CreateAd;
