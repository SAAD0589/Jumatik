//Chakra imports
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React from "react";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";
import CheckTable from "views/admin/default/components/CheckTable";
import SubcategoriesTable from "views/admin/default/components/SubcategoriesTable";
import SecteursTable from "views/admin/default/components/SecteursTable";
import TableUsers from "views/admin/default/components/TableUsers";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import SpecialFields from "views/admin/default/components/SpecialFields";
import TotalSpent from "views/admin/default/components/TotalSpent";
import SubcategoryConfig from "views/admin/default/components/SubcategoryConfig";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import {
  columnsDataCheck,
  columnsDataComplex,
  columnsDataUsers,
  columnsSubcategories,
  columnsSecteurs
} from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import AdsData from "views/admin/default/variables/AdsData";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";
import { useState } from 'react';

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 3, xl: 3 }} gap='20px' mb={5}>
          <MiniCalendar h='100%' minW='100%' selectRange={false} />
        <Box minH='100%' minW='100%' >  
          <Box mb={5}>  
           <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Earnings'
          value='$350.4'
        />
         </Box>
          <Box mb={5}>  
           <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Earnings'
          value='$350.4'
        />
         </Box>
          <Box mb={5}>  
           <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Earnings'
          value='$350.4'
        />
         </Box>
      
        </Box>
        <Box minH='100%' minW='100%' >  
          <Box mb={5}>  
           <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Earnings'
          value='$350.4'
        />
         </Box>
          <Box mb={5}>  
           <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Earnings'
          value='$350.4'
        />
         </Box>
          <Box mb={5}>  
           <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Earnings'
          value='$350.4'
        />
         </Box>
      
        </Box>
        </SimpleGrid>
     

      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap='20px' mb='20px'>
      <CheckTable columnsData={columnsDataCheck}  />
      <TableUsers columnsData={columnsDataUsers}  />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
      <SubcategoryConfig />
       
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
      <SubcategoriesTable columnsData={columnsSubcategories}  />
      <SecteursTable columnsData={columnsSecteurs}  />      
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 1  }} gap='20px' mb='20px'>
      <SpecialFields />        
      </SimpleGrid>
      

    </Box>
  );
}
