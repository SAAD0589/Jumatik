import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import axios from 'axios';
import CategorySelect from '../component/CategorySelect';
import useAlert from '../../../components/alert/useAlert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
} from '@chakra-ui/react';
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
import { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router-dom';
import { t } from 'helpers/TransWrapper';
function UpdateAd() {
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');

  const brandStars = useColorModeValue('brand.500', 'brand.400');

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
  const [tableFields, setTableFields] = useState([]);

  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');

  const [secteurs, setSecteurs] = useState([]);
  const [selectedSecteur, setSelectedsecteur] = useState('');
  const [adId , setAdId ] = useState();

  const [ad, setAd] = useState([]);

  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/ads/ad/${id}`)
      .then(res => {
        const currentAd = res.data;

        setAd({
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          categoryName: currentAd?.categoryName,
          subcategoryName: currentAd?.subcategoryName,
          name: currentAd?.name,
          secteur: currentAd?.secteur,
          city: currentAd?.city,
          region: currentAd?.region,
          price: currentAd?.price,
          description: currentAd?.description,
          adPictures: currentAd?.adPictures,
          status: 'En cours de Validation',
          userProfilePicture: user.profilePicture,
        });
      })
      .catch(err => console.error(err));
  }, []);

  console.log(ad);

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

  const HandleChange = e => {
    const { name, value } = e.target;
    setAd({
      ...ad, //spread operator
      [name]: value,
    });
  };
  const [fieldsValues, setFieldsValues] = useState({
    ad_id: '',
    field_id: '',
    field_name: '',
    value: '',
  });
  const [file, setFile] = useState([]);
  const handleFieldsChange = (fieldId, fieldType, e) => {
    let value;
    if (fieldType === "radio") {
      value = e;
    } else if (fieldType === "select") {
      value = e.target.value;
    } else {
      value = e.target.value;
    }
    setFieldsValues(prevFieldsValues => ({
      ...prevFieldsValues,
      [fieldId]: { valeure: value },
    }));
  };
  const onFileChange = event => {
    setAd({
      ...ad, //spread operator
      adPictures: event.target.files,
    });
    setFile(event.target.files);
  };
  function showToastAndRedirect() {
    try {
      history.push('/');
    } catch (error) {
      console.error(error);
    }
  }
  const add = async (fieldsValues) => {
    const formData = new FormData();
    const promises = [];
    formData.append('userId', ad.userId);
    formData.append('firstName', ad.firstName);
    formData.append('lastName', ad.lastName);
    formData.append('phone', ad.phone);
    formData.append('name', ad.name);
    formData.append('secteur', selectedSecteur);
    formData.append('city', selectedCity);
    formData.append('region', selectedRegion);
    formData.append('categoryName', selectedCategory);
    formData.append('categoryLabel', selectedCategoryLabel);
    formData.append('subcategoryName', selectedSubcategory);
    formData.append('subcategoryLabel', selectedSubcategoryLabel);
    formData.append('price', ad.price);
    formData.append('description', ad.description);
    formData.append('userProfilePicture', ad.userProfilePicture);
    formData.append('status', 'En cours de Validation');

    const dataURL = [...ad.adPictures];
    async function appendDataURL() {
      for (const img of dataURL) {
        const blobToDataURL = blob =>
          new Promise(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });

        const data = await blobToDataURL(img);
        formData.append('adPictures', data);
      }
    }

    await appendDataURL();

    const configuration = {
      method: 'put',
      url: `${process.env.REACT_APP_API}/ads/${id}`,
      data: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    await axios(configuration)
    .then(result => {
      setLogin(true);

      const adToken = result.data;
      setAdId(adToken._id);
      const fieldValues = tableFields.map((field) => {
        return {
          ad_id: adToken._id,
          field_id: field._id,
          field_name: field.name,
          valeure: fieldsValues[field._id]?.valeure,
        };
      });
      console.log('fieldValues:', fieldValues);
      for (const fieldValue of fieldValues) {
        try {
          const response = axios.post(
            `${process.env.REACT_APP_API}/customFieldsValues/add/new`,
            fieldValue,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log(response.data);
          // show a success message to the user
          toast.success("Field value created successfully!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } catch (error) {
          console.log(error);
          // show an error message to the user
          toast.error("Error creating field value!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
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
    city: document.getElementById('city')?.value,
    price: 'Non défini',
    adPictures: '',
    status: 'Brouillon',
    userProfilePicture: user.profilePicture,

    // Other fields
  };

  console.log(id);

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

    await add(fieldsValues);
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
{t('Modifier votre annonce')}        </Text>
        <FormControl onSubmit={e => handleSubmit(e)}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
            mt={10}
          >
             {t('Ajoutez les images du produit (Max 6 images)')}{' '}
          </FormLabel>{' '}
          <Stack direction={['column', 'row']} spacing={6} mb="20px">
            <Center w="full">
              <Input
                accept="image/*"
                variant="auth"
                name="adPictures"
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                pt="10px"
                mb="24px"
                fontWeight="500"
                size="lg"
                type="file"
                multiple
                onChange={onFileChange}
              />
            </Center>
          </Stack>
          <Flex h="100%" px={5} mb={2}></Flex>
          <Box height="90px">
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
               {t(`Nom de l 'annonce`)}<Text color={brandStars}>*</Text>{' '}
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
          </Box>{' '}
          <Box height="90px">
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
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
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
               {t(`Choisir une sous-categorie`)} <Text color={brandStars}> * </Text>{' '}
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
          {selectedCategory &&
  <>
    {tableFields?.map(field => (
      <Box height="90px">
        <FormLabel
          ms="4px"
          fontSize="sm"
          fontWeight="500"
          color={textColor}
          display="flex"
        >
          {field.name}
        </FormLabel>
        <FormControl isRequired={true}>
          {field.type === 'text' &&
            <InputGroup size="md">
              <Input
                fontSize="sm"
                placeholder="Enter text"
                mb="24px"
                size="lg"
                variant="auth"
                value={fieldsValues[field._id]?.valeure}
    onChange={value => handleFieldsChange(field._id, field.type, value)}
  name={field.name}
              />
            </InputGroup>
          }
          {field.type === 'textarea' &&
            <Textarea
              fontSize="sm"
              placeholder="Enter text"
              mb="24px"
              size="lg"
              variant="auth"
              name={field.name}
              value={fieldsValues[field._id]?.valeure}
    onChange={value => handleFieldsChange(field._id, field.type, value)}            />
          }
          {field.type === 'radio' &&
            <RadioGroup
                  name={field.name}
                  value={fieldsValues[field._id]?.valeure}
    onChange={value => handleFieldsChange(field._id, field.type, value)}
              mb="24px"
              size="lg"
            >
              <Stack direction="row">
                {field.options.map(option => (
                  <Radio value={option} key={option}>{option}</Radio>
                ))}
              </Stack>
            </RadioGroup>
          }
          {field.type === 'select' &&
            <Select
              placeholder="Select option"
              name={field.name}
              value={fieldsValues[field._id]?.valeure}
    onChange={value => handleFieldsChange(field._id, field.type, value)}         
         mb="24px"
              size="lg"
            >
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
          }
        </FormControl>
      </Box>
    ))}
  </>
}

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
         
          <Box height="90px">
            <FormLabel
              ms="4px"
              fontSize="sm"
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
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              display="flex"
            >
              {t(`Choisissez votre secteur`)} <Text color={brandStars}> * </Text>{' '}
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
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
          >
             {t(`Entrez la description de l 'annonce`)}<Text color={brandStars}>*</Text>{' '}
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
          <Alert status="error" mb={5} align="start">
            <AlertDescription>
            {t(`Pour créer une nouvelle annonce, veuillez noter que les contenus à caractère sexuel, promotionnels de produits illégaux ou dangereux, ou tout autre contenu considéré comme inapproprié ne seront pas acceptés. Nous nous réservons le droit de refuser ou de retirer toute annonce qui ne respecte pas nos règles de publication. Merci de votre compréhension.`)}
             
            </AlertDescription>
          </Alert>
          <Button
            fontSize="sm"
            variant="brand"
            fontWeight="500"
            w="100%"
            h="50"
            mb="24px"
            onClick={handleSubmit}
          >
             {t(`Ajouter`)}{' '}
          </Button>{' '}
        </FormControl>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="start"
          maxW="100%"
          mt="0px"
        ></Flex>{' '}
      </Flex>
    </Card>
  );
}

export default UpdateAd;
