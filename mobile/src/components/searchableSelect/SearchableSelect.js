import { useState, useRef } from "react";
import {
  Select,
  Input,
  VStack,
  Box,
  Button,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

function SearchableSelect({ options, placeholder, onChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value) => {
    setSearchTerm("");
    onClose();
    onChange(value);
  };

  return (
    <VStack position="relative">
      <Box position="relative">
        <Select
          placeholder={placeholder}
          value=""
          onClick={() => {
            setSearchTerm("");
            onOpen();
            inputRef.current && inputRef.current.focus();
          }}
          onBlur={onClose}
          icon={<ChevronDownIcon />}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          pointerEvents="none"
          zIndex="2"
          bg={useColorModeValue("white", "gray.800")}
          opacity={isOpen ? "1" : "0"}
          transition="opacity 0.2s"
          borderRadius="md"
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex="3"
          pointerEvents="none"
          bgGradient={`linear(to-b, ${useColorModeValue(
            "white",
            "gray.800"
          )} 30%, transparent)`}
          opacity={isOpen ? "1" : "0"}
          transition="opacity 0.2s"
          borderRadius="md"
        />
      </Box>
      <Input
        ref={inputRef}
        placeholder="Chercher une option..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        opacity={isOpen ? "1" : "0"}
        pointerEvents={isOpen ? "auto" : "none"}
        zIndex="4"
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="md"
        boxShadow="sm"
        _focus={{
          boxShadow: `0 0 0 1px ${useColorModeValue(
            "blue.500",
            "blue.300"
          )}, 0 0 0 3px ${useColorModeValue(
            "blue.200",
            "blue.600"
          )} !important`,
        }}
        transition="opacity 0.2s"
        _placeholder={{
          opacity: "0.6",
        }}
        size="sm"
        mt="-1px"
      />
      {isOpen && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          zIndex="2"
         
          borderRadius="md"
          boxShadow="sm"
          overflow="auto"
          maxHeight = "auto"
          _focus={{
            boxShadow: `0 0 0 1px 
            )}, 0 0 0 3px 
            )} !important`,
          }}
          py="1"
          mt="-1px"
        >
          {filteredOptions.length === 0 && (
            <Box px="3" py="2" fontSize="sm">
              Aucun résultat
            </Box>
          )}
          {filteredOptions.map((option) => (
            <Button
              key={option.value}
              justifyContent="flex-start"
              width="100%"
              py="2"
              px="3"
              textAlign="left"
              isFullWidth
              variant="ghost"
              color={option.value === "" ? "gray.500" : undefined}
     
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </Box>
      )}
    </VStack>
  );
}

export default SearchableSelect;

