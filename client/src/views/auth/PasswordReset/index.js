import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Card from 'components/card/Card.js';
import { useParams, useHistory } from "react-router-dom";

const PasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { token } = useParams();
  const [tok, setTok] = useState(token);
  
  
const history = useHistory();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/auth/reset-password/${token}`,
        { password }
      );
      if (response.status === 200) {
        history.push('/auth/sign-in')
        toast({
          title: "Mot de passe réinitialisé",
          description:
            "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error?.response?.data?.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <VStack spacing="8" mt="8">
        <form onSubmit={handleSubmit}>
          <FormControl id="password">
            <FormLabel>Nouveau mot de passe</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <FormControl id="confirmPassword">
            <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>

          <Button
            mt="4"
            colorScheme="pink"
            isLoading={isLoading}
            type="submit"
            isDisabled={!password || password !== confirmPassword}
          >
            Réinitialiser le mot de passe
          </Button>
        </form>
      </VStack>
    </Card>
  );
};

export default PasswordReset;
