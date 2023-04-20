// Chakra imports
import {
    AvatarGroup,
    Avatar,
    Box,
    Button,
    Flex,
    Icon,
    Image,
    Link,
    Text,
    useColorModeValue,
  } from "@chakra-ui/react";
  // Custom components
  import Card from "components/card/Card.js";
import { t } from "helpers/TransWrapper";
  // Assets
  import React, { useState } from "react";
  import { IoHeart, IoHeartOutline } from "react-icons/io5";
  
  export default function Category(props) {
    const { image, label, count, download } = props;
    const [like, setLike] = useState(false);
    const textColor = useColorModeValue("navy.700", "white");
    const textColorBid = useColorModeValue("brand.500", "white");
    return (
      <Card p='20px'>
        <Flex direction={{ base: "column" }} justify='center'>
          <Box mb={{ base: "20px", "2xl": "20px" }} position='relative'>
            <Image
              src={image}
              w={{ base: "100%", "3xl": "100%" }}
              h={{ base: "100%", "3xl": "100%" }}
              borderRadius='20px'
            />
           
          </Box>
          <Flex flexDirection='column' justify='space-between' h='100%'>
            <Flex
              justify='space-between'
              direction={{
                base: "row",
                md: "column",
                lg: "row",
                xl: "column",
                "2xl": "row",
              }}
              mb='auto'>
              <Flex direction='column'>
                <Text
                  color={textColor}
                  fontSize={{
                    base: "xl",
                    md: "lg",
                    lg: "lg",
                    xl: "lg",
                    "2xl": "md",
                    "3xl": "lg",
                  }}
                  mb='5px'
                  fontWeight='bold'
                  me='14px'>
                  {label}
                </Text>
                <Text
                  color='secondaryGray.600'
                  fontSize={{
                    base: "sm",
                  }}
                  fontWeight='400'
                  me='14px'>
                  {count}  {t('annonces')}
                </Text>
              </Flex>
              
            </Flex>
            <Flex
              align='start'
              justify='space-between'
              direction={{
                base: "row",
                md: "column",
                lg: "row",
                xl: "column",
                "2xl": "row",
              }}
              mt='25px'>
              
              <Link
               
                mt={{
                  base: "0px",
                  md: "10px",
                  lg: "0px",
                  xl: "10px",
                  "2xl": "0px",
                }}>
                <Button
                onClick={download}
                  variant='darkBrand'
                  color='white'
                  fontSize='sm'
                  fontWeight='500'
                  borderRadius='70px'
                  px='24px'
                  py='5px'>
                  {t('Voir toutes les annonces')}
                </Button>
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    );
  }
  