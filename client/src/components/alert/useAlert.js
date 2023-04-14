import { useToast } from '@chakra-ui/react';

const useAlert = () => {
  const toast = useToast();

  const success = (title, description) => {
    toast({
      title,
      description,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const error = (title, description) => {
    toast({
      title,
      description,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  const warning = (title, description) => {
    toast({
      title,
      description,
      status: 'warning',
      duration: 5000,
      isClosable: true,
    });
  };

  const info = (title, description) => {
    toast({
      title,
      description,
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  };

  return { success, error, warning, info };
};

export default useAlert;