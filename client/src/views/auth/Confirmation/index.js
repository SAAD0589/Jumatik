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
          Confirmez votre email
        </Heading>
        <Box maxWidth={400} marginX="auto">
          <Text marginBottom={5}>
          Merci de votre inscription. Veuillez confirmer votre e-mail en cliquant sur le bouton ci-dessous.
          </Text>
          <Button colorScheme='blue' onClick={handleConfirmation} isLoading={isLoading} loadingText="Confirming...">
            Confirmer
          </Button>
          {errorMessage && <Text color="red">{errorMessage}</Text>}
        </Box>
      </Box></Card>
    
    );
  };
  
  export default Confirmation;

