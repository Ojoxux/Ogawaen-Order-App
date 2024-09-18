import React, { useState, useEffect } from 'react';
import {
  SimpleGrid,
  Box,
  Image,
  Text,
  Button,
  VStack,
  Heading,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { getProducts } from '../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { CartItem } from '../types';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  tag: string;
  description: string;
  allergens: string;
  isRecommended: boolean;
}

interface ProductSelectionProps {
  onAddToCart: (product: Product, quantity: number) => void;
  cartItems: CartItem[];
}

const ProductSelection: React.FC<ProductSelectionProps> = ({ onAddToCart, cartItems }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  //const [imagesLoaded, setImagesLoaded] = useState(0);

  const handleImageLoad = (productId: string) => {
    console.log(`Image loaded: ${productId}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        const productsWithTag = fetchedProducts.map((product) => ({
          ...product,
          tag: product.tag || 'defaultTag',
          description: product.description || '説明がありません',
          allergens: product.allergens || 'アレルギー情報がありません',
          isRecommended: product.isRecommended || false,
        }));
        setProducts(productsWithTag);
        preloadImages(productsWithTag);
      } catch (err) {
        setError('商品を取得する際にエラーが発生しました');
        setLoading(false);
      }
    };

    const unsubscribeCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const categoryNames = snapshot.docs.map((doc) => doc.data().name);
      setCategories(categoryNames);
    });

    fetchProducts();

    return () => {
      unsubscribeCategories();
    };
  }, []);

  const preloadImages = (products: Product[]) => {
    let loadedCount = 0;
    products.forEach((product) => {
      const img = new window.Image();
      img.src = product.image;
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount === products.length) {
          setLoading(false);
        }
      };
    });
  };

  const filteredProducts = selectedTag
    ? products.filter((product) => product.tag === selectedTag)
    : products;

  const handleBoxClick = (product: Product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const getCartItemQuantity = (productId: string) => {
    const item = cartItems.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" color="teaGreen.500" />
      </Center>
    );
  }

  return (
    <VStack spacing={6} align="stretch" p={4}>
      <Heading as="h2" size="lg" color="teaGreen.700" textAlign="center" mb={4}>
        お品書き
      </Heading>
      <HStack spacing={4} justify="center" wrap={{ base: 'nowrap', md: 'wrap' }} mb={6}>
        {['全て', ...categories].map((tag) => (
          <Button
            size="lg"
            key={tag}
            borderRadius="full"
            variant={selectedTag === tag ? 'solid' : 'outline'}
            colorScheme="teaGreen"
            cursor="pointer"
            onClick={() => setSelectedTag(tag === '全て' ? null : tag)}
            transition="all 0.3s"
            _hover={{ transform: 'scale(1.1)', bg: 'teaGreen.500', color: 'white' }}
            _active={{ transform: 'scale(0.95)' }}
            fontSize={{ base: 'sm', md: 'md' }}
          >
            {tag}
          </Button>
        ))}
      </HStack>
      {loading ? (
        <Center height="50vh">
          <Spinner size="xl" color="teaGreen.500" />
        </Center>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {filteredProducts.map((product) => (
            <Box
              key={product.id}
              position="relative"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              borderColor="teaGreen.200"
              boxShadow="sm"
              transition="all 0.3s"
              _hover={{ boxShadow: 'md', borderColor: 'teaGreen.300', transform: 'scale(1.05)' }}
              onClick={() => handleBoxClick(product)}
            >
              <Image
                src={product.image}
                alt={product.name}
                onLoad={() => handleImageLoad(product.id)}
                onError={() => handleImageLoad(product.id)}
                fallback={<Spinner size="xl" color="teaGreen.500" />}
              />
              <VStack p={4} align="start" bg="white">
                {product.isRecommended && (
                  <Box
                    position="absolute"
                    top="10px"
                    left="10px"
                    bg="teaGreen.500"
                    color="white"
                    borderRadius="full"
                    width="50px"
                    height="50px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="xs"
                    fontWeight="bold"
                    boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
                  >
                    おすすめ
                  </Box>
                )}
                <Text fontWeight="semibold" color="teaGreen.800">
                  {product.name}
                </Text>
                <Text color="teaGreen.600">¥{product.price} (税込)</Text>
                <Button
                  colorScheme="teaGreen"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product, 1);
                  }}
                  w="100%"
                  bg="teaGreen.400"
                  _hover={{ bg: 'teaGreen.500' }}
                >
                  カートに追加
                </Button>
                {getCartItemQuantity(product.id) > 0 && (
                  <Box
                    position="absolute"
                    top="10px"
                    right="10px"
                    bg="teaGreen.500"
                    color="white"
                    borderRadius="full"
                    width="30px"
                    height="30px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="sm"
                    fontWeight="bold"
                    boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
                  >
                    {getCartItemQuantity(product.id)}
                  </Box>
                )}
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {selectedProduct && (
        <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
          <ModalOverlay />
          <ModalContent maxW={{ base: '90%', md: '500px' }}>
            <ModalHeader>{selectedProduct.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fallback={<Spinner size="xl" color="teaGreen.500" />}
                />
                <Text fontWeight="semibold" color="teaGreen.800">
                  {selectedProduct.name}
                </Text>
                <Text color="teaGreen.600">¥{selectedProduct.price} (税込)</Text>
                <Text color="gray.500" fontSize="sm">
                  {selectedProduct.description}
                </Text>
                <Text color="gray.500" fontSize="sm">
                  アレルギー情報: {selectedProduct.allergens}
                </Text>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="teaGreen"
                onClick={() => {
                  onAddToCart(selectedProduct, 1);
                  onClose();
                }}
                w="100%"
                bg="teaGreen.400"
                _hover={{ bg: 'teaGreen.500' }}
              >
                カートに追加
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </VStack>
  );
};

export default ProductSelection;
