import {
  Flex,
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
  Button,
  Checkbox,
  CheckboxGroup,
  TableContainer,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Textarea,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons';
import React, { useMemo, useState, useEffect } from 'react';
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Custom components
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import axios from 'axios';

// Assets
import { DeleteIcon, EditIcon, MdOutlineError } from '@chakra-ui/icons';
export default function ColumnsTable(props) {
  const { columnsData } = props;
  const [tableData, setTableData] = useState([]);
  const [field, setField] = useState([]);
  const [name, setName] = useState();
  const [type, setType] = useState();
  const [options, setOptions] = useState();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedSubcategoryLabel, setSelectedSubcategoryLabel] = useState('');
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
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

  const deleteField = async id => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/customFields/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success(`Champ suprime avec sucées`, {
        position: 'top-center',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();

    // Fetch data every 10 seconds
    const intervalId = setInterval(fetchData, 2000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/customFields/get/all`
      );

      const adData = response.data;
      console.log(adData);

      const newData = adData.map((item, index) => ({
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        type: item.type,
        options: item.options,
        date: new Date(item.createdAt).toLocaleDateString(),
        action: item._id,
      }));
      console.log(newData);
      setTableData(newData);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCustomField = async id => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/customFields/get/${id}`
      );

      const customField = response.data;
      console.log(customField);
      setField(customField);
      console.log(field);

    } catch (error) {
      console.log(error);
    }
  };
  const update = async (id) => {
  

    const configuration = {
      method: 'put',
      url: `${process.env.REACT_APP_API}/customFields/update/${id}`,
      data: {
        name: name,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        type: type,
        options: options?.split(","),
        action: id,
      },
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
  const handleSubmit =  async (id)  => {
    if (!name?.trim()) {
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
    if (!type?.trim()) {
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

    await update(id);
    setName('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setType('');
    setOptions('');


  };

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
    },
    useGlobalFilter,
    useSortBy,
    
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    initialState
  } = tableInstance;
  initialState.pageSize = rows.length; 

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Flex px="25px" justify="space-between" mb="10px" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Liste des champs spéciaux
        </Text>
       
      </Flex>
      <TableContainer overflowX="auto" maxWidth="full">

      <Table  variant="simple" color="gray.500" mb="24px" {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe="10px"
                  key={index}
                  borderColor={borderColor}
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                  >
                    {column.render('Header')}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data = '';
                  if (cell.column.Header === 'NOM') {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {cell.value}
                      </Text>
                    );
                  } else if (cell.column.Header === 'CATEGORIE') {
                    data = (
                      <Flex align="center">
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } 
                  else if (cell.column.Header === 'SUBCATEGORIE') {
                    data = (
                      <Flex align="center">
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  }else if (cell.column.Header === 'TYPE') {
                    data = (
                      <Flex align="center">
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === 'DATE') {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {cell.value}
                      </Text>
                    );
                  } else if (cell.column.Header === 'ACTION') {
                    data = (
                      <Flex align="center">
                        <IconButton
                          colorScheme="blue"
                          aria-label="Update"
                          icon={<EditIcon />}
                          onClick={() => {
                            fetchCustomField(cell.value);
                            onOpen();
                          }}
                        />
                        <IconButton
                          ml="2"
                          colorScheme="red"
                          aria-label="Delete"
                          icon={<DeleteIcon />}
                          onClick={() => deleteField(cell.value)}
                        />{' '}
                        <Modal
                          initialFocusRef={initialRef}
                          finalFocusRef={finalRef}
                          isOpen={isOpen}
                          onClose={onClose}
                        >
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>
                              Modification du champ "{field.name}"
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                            <FormControl onSubmit={() => handleSubmit(cell.value)}>
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
                                        e.target.options[e.target.selectedIndex]
                                          .dataset.id;
                                      const selectedCategory = categories.find(
                                        category =>
                                          category._id === selectedCategoryId
                                      );
                                      setSelectedCategory(
                                        selectedCategory.name
                                      );
                                      setSelectedCategoryId(selectedCategoryId);
                                      setSelectedCategoryLabel(
                                        selectedCategory.label
                                      );
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
                                    <option value="textarea">
                                      Zone de texte
                                    </option>
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
                                        Options de champ personnalisées
                                        (séparées par des virgules et sans
                                        espaces)
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
                                        onChange={e =>
                                          setOptions(e.target.value)
                                        }
                                      />
                                    </Box>
                                  </>
                                ) : null}{' '}
                          <Flex  mt={5}>  <Button  colorScheme="blue" mr={3} onClick={() => {
                            handleSubmit(cell.value);
                            onClose();
                          }}>
                                Enregistrer
                              </Button>
                              <Button  onClick={() => {
                            onClose();
                          }} >Annuler</Button></Flex>
                              
                              </FormControl>
                            </ModalBody>

                           
                          </ModalContent>
                        </Modal>
                      </Flex>
                    );
                  }
                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: '14px' }}
                      maxH="30px !important"
                      py="8px"
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                      borderColor="transparent"
                    >
                      {data}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      </TableContainer>
    </Card>
  );
}
