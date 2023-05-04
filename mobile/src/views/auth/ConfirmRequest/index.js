import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import axios from 'axios';
import Card from 'components/card/Card.js';

const Confirmation = ({ match }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();
  
    const handleConfirmation = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${process.env.REACT_APP_API}/auth/confirm/${match.params.token}`);
        setIsLoading(false);
        history.push('/auth/login');
      } catch (error) {
        setIsLoading(false);
        setErrorMessage('Error confirming email');
      }
    };
  
    return (
        <Card height="100%" >  <Box textAlign="center" marginTop={5} h='100%'>
        <Heading as="h1" size="xl" marginBottom={5} >
        On a besoin de confirmer ton adresse e-mail        </Heading>
        <Box  marginX="auto">
          <Text fontSize={20} marginBottom={5}>
          Salut ! Petit message rapide pour t'informer qu'on vient de t'envoyer un mail de confirmation dans ta boîte de réception. Jette un coup d'œil pour qu'on puisse enfin commencer la fête ! Et si tu ne le vois pas, n'hésite pas à nous contacter - nos magiciens de la tech sont prêts à t'aider.          </Text>
         
        </Box>
      </Box></Card>
    
    );
  };
  
  export default Confirmation;

