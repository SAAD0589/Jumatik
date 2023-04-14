import React, { useState,  } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Text
} from "@chakra-ui/react";
import axios from "axios";
import Card from 'components/card/Card.js';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/auth/forgot-password`,
        { email }
      );
      if (response.status === 200) {
        setIsSubmitted(true);
        toast({
          title: "E-mail envoyé",
          description:
            "Un e-mail avec des instructions pour réinitialiser votre mot de passe a été envoyé.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      setError(
        error?.response?.data?.message ??
          "Une erreur est survenue lors de la réinitialisation du mot de passe."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch" mt={6}>
      <Text as="h2" fontSize="2xl" fontWeight="semibold" textAlign="center">
        Réinitialiser le mot de passe
      </Text>
      {isSubmitted ? (
        <Text fontSize="lg" fontWeight="semibold" textAlign="center">
          Vérifiez votre e-mail pour réinitialiser votre mot de passe.
        </Text>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel htmlFor="email">Adresse e-mail</FormLabel>
            <Input
              variant='auth'
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          {error && (
            <Text color="red.500" fontSize="md" fontWeight="semibold">
              {error}
            </Text>
          )}
          <Button mt={5}
            type="submit"
            colorScheme="pink"
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          >
            Réinitialiser le mot de passe
          </Button>
        </form>
      )}
    </VStack>
  );

  };

export default ForgotPassword;
