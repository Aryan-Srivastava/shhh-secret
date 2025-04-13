import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  useColorMode,
  HStack,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon, CopyIcon } from "@chakra-ui/icons";
import { getSecret } from "../utils/api";

const ViewSecret = () => {
  const { secretId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [secret, setSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  const key = location.hash.slice(1);

  const handleReveal = async () => {
    if (!secretId || !key) {
      setError("Invalid secret link");
      return;
    }

    setIsLoading(true);
    try {
      const decryptedSecret = await getSecret(secretId, key);
      setSecret(decryptedSecret);
      setIsRevealed(true);
    } catch (error) {
      console.error("Error revealing secret:", error);
      setError("Secret not found or already viewed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      toast({
        title: "Copied!",
        description: "Secret copied to clipboard",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleDestroy = () => {
    setSecret(null);
    setIsRevealed(false);
    navigate("/");
  };

  useEffect(() => {
    if (!secretId || !key) {
      setError("Invalid secret link");
    }
  }, [secretId, key]);

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="xl">Knock knock</Heading>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
          />
        </HStack>

        <Box
          p={6}
          borderRadius="lg"
          bg={colorMode === "light" ? "light.card" : "dark.card"}
          boxShadow="xl"
        >
          <VStack spacing={6} align="stretch">
            {error ? (
              <>
                <Text fontSize="xl" color="red.500">
                  {error}
                </Text>
                <Button onClick={() => navigate("/")}>
                  Create a new secret
                </Button>
              </>
            ) : (
              <>
                <Text fontSize="xl">
                  {isRevealed
                    ? "Here's your secret:"
                    : "You received a secret."}
                </Text>

                {isRevealed ? (
                  <>
                    <Box
                      p={4}
                      bg={colorMode === "light" ? "gray.50" : "gray.700"}
                      borderRadius="md"
                    >
                      <Text>{secret}</Text>
                    </Box>
                    <HStack>
                      <Button
                        leftIcon={<CopyIcon />}
                        onClick={handleCopy}
                        flex="1"
                      >
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        colorScheme="red"
                        onClick={handleDestroy}
                        flex="1"
                      >
                        Destroy
                      </Button>
                    </HStack>
                  </>
                ) : (
                  <Button
                    variant="gradient"
                    size="lg"
                    onClick={handleReveal}
                    isLoading={isLoading}
                  >
                    Reveal Secret
                  </Button>
                )}

                <Text fontSize="sm" color="gray.500">
                  Remember: Once revealed, this secret will be destroyed
                  forever.
                </Text>
              </>
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default ViewSecret;
