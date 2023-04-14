// Chakra imports
import { Text, useColorModeValue, Flex, Box } from '@chakra-ui/react';
// Assets
import Project1 from 'assets/img/profile/Project1.png';
import Project2 from 'assets/img/profile/Project2.png';
import Project3 from 'assets/img/profile/Project3.png';
import axios from 'axios';
// Custom components
import Card from 'components/card/Card.js';
import React, { useState, useEffect } from 'react';
import Project from 'views/admin/profile/components/Project';
import AdsCard from '../../../../components/sidebar/components/SidebarCard';
import Nft3 from 'assets/img/nfts/Nft3.png';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Projects(props) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'gray.400';
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset'
  );
  const [SelectedAd, setSelectedAd] = useState([]);

  const [ads, setAds] = useState([]);
  const userData = localStorage.getItem('user-token');
  const currentUser = JSON.parse(userData);
  const history = useHistory();
  const getAdById = async id => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/ads/ad/${id}`
      );
      setSelectedAd(response.data);

      history.push(`/ads/${id}`);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUserAds = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/ads/all/${currentUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setAds(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserAds();
  }, []);
  const deleteAd = async id => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/ads/ad/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Card mb={{ base: '0px', '2xl': '20px' }}>
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mt="10px"
        mb="4px"
      >
        Vos annonces{' '}
      </Text>{' '}
      <Text color={textColorSecondary} fontSize="md" me="26px" mb="40px">
        Ici vous pouvez gérer vos annonces publiées, en brouillons ou en cours
        de validation{' '}
      </Text>{' '}
      {ads && ads.length > 0 ? (
        ads.map(ad => {
          const handleClick = () => {
            getAdById(ad._id);
          };
          const handleUpdate = () => {
            history.push(`/ad/updateAd/${ad._id}`);
          };
          const handleDelete = () => {
            Swal.fire({
              title: 'Êtes-vous sûr(e) ?',
              text: "Vous ne pourrez pas revenir en arrière !",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Oui, supprimer !',
              cancelButtonText: 'Annuler',
            }).then(result => {
              if (result.isConfirmed) {
                deleteAd(ad._id);
                Swal.fire('Supprimée !', 'Votre annonce a été supprimé.', 'success');
                history.go(0);
              }
            });
         
          };
          return (
            <Flex key={ad._id}>
              <Project
                boxShadow={cardShadow}
                mb="20px"
                image={
                  ad.adPictures[0] && Object.keys(ad.adPictures[0]).length
                    ? ad.adPictures[0]
                    : Nft3
                }
                ranking={ad.categoryLabel}
                link={handleClick}
                linkUpdate={handleUpdate}
                linkDelete={handleDelete}
                title={ad.name}
                status={ad.status}
              />{' '}
            </Flex>
          );
        })
      ) : (
        <Box>
          {' '}
          <Text fontWeight={300} fontFamily="body" mb={15}>
            {' '}
            Aucune annonce n 'a été trouvée pour le moment. <br></br> Ajoutez
            une annonce via le boutoon "Annonce gratuite"
          </Text>{' '}
          <AdsCard />{' '}
        </Box>
      )}{' '}
    </Card>
  );
}
