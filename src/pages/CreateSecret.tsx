import { useState } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Textarea,
  Button,
  Text,
  useColorMode,
  IconButton,
  HStack,
  useToast,
  Input,
  InputGroup,
  InputRightElement,
  SlideFade,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon, CopyIcon, LockIcon } from "@chakra-ui/icons";
import { createSecret } from "../utils/api";
// import { motion, keyframes } from "framer-motion";

// const MotionBox = motion(Box);

// const fadeIn = {
//   from: { opacity: 0, transform: "translateY(20px)" },
//   to: { opacity: 1, transform: "translateY(0)" },
// };

const CreateSecret = () => {
  const [secret, setSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  const handleSubmit = async () => {
    if (!secret.trim()) {
      toast({
        title: "Error",
        description: "Please enter a secret message",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const link = await createSecret(secret, "0");
      setGeneratedLink(link);
      setSecret("");
    } catch (error) {
      console.error("Error creating secret:", error);
      toast({
        title: "Error",
        description: "Failed to create secret link",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box
      width={"99vw"}
      alignContent={"center"}
      justifyContent={"center"}
      overflow={"hidden"}
    >
      <Box
        position="sticky"
        top={0}
        zIndex={100}
        bg={colorMode === "light" ? "white" : "gray.800"}
        boxShadow="sm"
        py={4}
      >
        <Container maxW="container.lg">
          <HStack justify="space-between">
            <Heading size="xl">Secret Link Generator</Heading>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
            />
          </HStack>
        </Container>
      </Box>

      <Container
        maxW="container.md"
        py={8}
        alignContent={"center"}
        centerContent
      >
        <VStack spacing={8} align="stretch" w="100%">
          <Box
            p={6}
            borderRadius="lg"
            bg={colorMode === "light" ? "light.card" : "dark.card"}
            boxShadow="xl"
            w="100%"
          >
            <VStack spacing={4} align="stretch">
              {!generatedLink ? (
                <>
                  <Text>Enter your secret message:</Text>
                  <Textarea
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="What is your secret?"
                    maxLength={150}
                    rows={4}
                  />
                  <Text fontSize="sm" color="gray.500">
                    {secret.length}/150 characters
                  </Text>

                  {/* <RadioGroup onChange={setExpiration} value={expiration}>
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="medium">Expiration time:</Text>
                    <HStack justifyContent="space-between" w="100%" gap={4}>
                      <Radio value="0">Destroy immediately after viewing</Radio>
                      <Radio value="600">10 minutes</Radio>
                      <Radio value="3600">1 hour</Radio>
                      <Radio value="86400">24 hours</Radio>
                      <Radio value="604800">7 days</Radio>
                    </HStack>
                  </VStack>
                </RadioGroup> */}

                  <Button
                    variant="gradient"
                    size="lg"
                    onClick={handleSubmit}
                    isLoading={isLoading}
                  >
                    Create secret link
                  </Button>
                </>
              ) : (
                <>
                  <Text>Your secret link is ready:</Text>
                  <InputGroup size="md">
                    <Input pr="4.5rem" value={generatedLink} readOnly />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleCopy}>
                        <CopyIcon />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <Text fontSize="sm" color="gray.500">
                    Share this link with your recipient. The secret will be
                    destroyed after viewing
                    {/* {expiration !== "0"
                    ? ` or after ${parseInt(expiration) / 3600} hour(s)`
                    : ""} */}
                    .
                  </Text>
                  <Button mt={4} onClick={() => setGeneratedLink("")}>
                    Create another secret
                  </Button>
                </>
              )}
            </VStack>
          </Box>

          <SlideFade in={true} offsetY="20px">
            <Box
              p={6}
              borderRadius="lg"
              bg={colorMode === "light" ? "light.card" : "dark.card"}
              boxShadow="xl"
            >
              <VStack spacing={4} align="stretch">
                <Heading size="md">How it works</Heading>
                <Text>1. Write your secret and generate a one-time link</Text>
                <Text>2. Share the link with your trusted recipient</Text>
                <Text>
                  3. After the secret has been viewed, it gets destroyed forever
                </Text>
              </VStack>
            </Box>
          </SlideFade>

          <SlideFade in={true} offsetY="20px">
            <Box
              p={6}
              borderRadius="lg"
              bg={colorMode === "light" ? "light.card" : "dark.card"}
              boxShadow="xl"
            >
              <VStack spacing={6} align="stretch">
                <Heading size="md">Security & Encryption</Heading>

                <Box>
                  <Heading size="sm" mb={2}>
                    How the encryption works:
                  </Heading>
                  <VStack spacing={4} align="start">
                    <HStack>
                      <LockIcon />
                      <Text>End-to-end encryption using AES-256</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      Your secret is encrypted in your browser before being sent
                      to our servers. The encryption key is never stored on our
                      servers - it's part of the link itself.
                    </Text>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="sm" mb={2}>
                    Link Structure Example:
                  </Heading>
                  <Box
                    p={4}
                    bg={colorMode === "light" ? "gray.50" : "gray.700"}
                    borderRadius="md"
                    fontSize="sm"
                    fontFamily="mono"
                  >
                    https://domain.com/shhh/
                    <Text as="span" color="blue.400">
                      secretId
                    </Text>
                    #
                    <Text as="span" color="grex`en.400">
                      encryptionKey
                    </Text>
                  </Box>
                  <VStack spacing={2} mt={4} align="start">
                    <Text fontSize="sm">
                      •{" "}
                      <Text as="span" color="blue.400">
                        secretId
                      </Text>
                      : Identifies your encrypted secret on the server
                    </Text>
                    <Text fontSize="sm">
                      •{" "}
                      <Text as="span" color="green.400">
                        encryptionKey
                      </Text>
                      : Used to decrypt the secret (never sent to server)
                    </Text>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="sm" mb={2}>
                    Security Features:
                  </Heading>
                  <VStack spacing={2} align="start">
                    <Text fontSize="sm">• One-time access links</Text>
                    <Text fontSize="sm">
                      • Automatic destruction after viewing
                    </Text>
                    <Text fontSize="sm">
                      • No encryption keys stored on servers
                    </Text>
                    <Text fontSize="sm">• Optional time-based expiration</Text>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </SlideFade>
        </VStack>
      </Container>
    </Box>
  );
};

export default CreateSecret;
