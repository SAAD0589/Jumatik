import {
  Flex,
  Table,
  Checkbox,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Badge,
  useColorModeValue,
  Box,
  Button
} from '@chakra-ui/react';
import React, { useMemo, useState, useEffect } from 'react';
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import axios from 'axios';

// Custom components
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
export default function CheckTable(props) {
  const { columnsData } = props;

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/ads/admin/allAds`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        const adData = response.data;
        const newData = adData.map(item => {
          return {
            id: item._id,
            nom: item.name,
            status: item.status,
            date: new Date(item.createdAt).toLocaleString(),
            annonceur: item.firstName + ' ' + item.lastName,
          };
        });
        setTableData(newData);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  const columns = useMemo(() => columnsData, [columnsData]);

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState, 
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex },
  } = tableInstance;
  initialState.pageSize = 6;
const history = useHistory();
const brand = useColorModeValue('brand.500', 'pink.200');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const getAdById = async id => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/ads/ad/${id}`
      );

      history.push(`/ads/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Flex px="25px" justify="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Annonces
        </Text>
        
      </Flex>
      <Table p='50px' {...getTableProps()} variant="simple" color="gray.500" mb="24px">
        <Thead>
          {headerGroups?.map((headerGroup, index) => (
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
          {page?.map((row, index) => {
         
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells?.map((cell, index) => {
                  const handleClick = () => {
                    getAdById(cell.value); // Get the ad by its id when the component is clicked
                  };
                  let data = '';
                  if (cell.column.Header === 'ID') {
                    data = (
                      <Flex align="center">
                      <Flex cursor='pointer' onClick={handleClick}><Text color={brand} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text></Flex>
                        
                      </Flex>
                    );}
                 else if (cell.column.Header === 'NOM') {
                    data = (
                      <Flex align="center">
                      <Flex ><Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text></Flex>
                        
                      </Flex>
                    );
                  } else if (cell.column.Header === 'ANNONCEUR') {
                    data = (
                      <Flex align="center">
                        <Text
                          me="10px"
                          color={textColor}
                          fontSize="sm"
                          fontWeight="700"
                        >
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === 'STATUS') {
                    let colorScheme;

                    switch (cell.value) {
                      case 'Validée':
                        colorScheme = 'green';
                        break;
                      case 'Brouillon':
                        colorScheme = 'grey';
                        break;
                      case 'Annulée':
                        colorScheme = 'red';
                        break;
                      default:
                        colorScheme = 'blue';
                    }
                    data = (
                      <Badge me="16px" ms="auto" colorScheme={colorScheme}>
                        {cell.value}
                      </Badge>
                    );
                  } else if (cell.column.Header === 'DATE') {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {cell.value}
                      </Text>
                    );
                  }
                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: '14px' }}
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
      <Flex px="25px" justify="space-between" align="center" >
        <Button variant='brand'  p='auto' onClick={() => previousPage()} disabled={!canPreviousPage}>
        Précédent
        </Button>
        <Text >
          Page{' '}
          <strong>
            {pageIndex + 1} de  {pageOptions.length}
          </strong>{' '}
        </Text>
        <Button variant='brand'  onClick={() => nextPage()} disabled={!canNextPage}>
          Suivant
        </Button>
      </Flex>
    </Card>
  );
}
