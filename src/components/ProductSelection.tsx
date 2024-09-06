import React, { useState, useEffect } from 'react';
import { SimpleGrid, Box, Image, Text, Button, VStack, Heading } from '@chakra-ui/react';
import { getProducts } from '../services/firebase';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface ProductSelectionProps {
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductSelection: React.FC<ProductSelectionProps> = ({ onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        console.log('Fetched products:', fetchedProducts); // デバッグログ
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('商品の取得に失敗しました');
      }
    };
    fetchProducts();
  }, []);

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  if (products.length === 0) {
    return <Text color="teaGreen.600">商品が見つかりません</Text>;
  }

  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h2" size="lg" color="teaGreen.700" textAlign="center">
        お品書き
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {products.map((product) => (
          <Box
            key={product.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            borderColor="teaGreen.200"
            boxShadow="sm"
            transition="all 0.3s"
            _hover={{ boxShadow: 'md', borderColor: 'teaGreen.300' }}
          >
            <Image src={product.image} alt={product.name} />
            <VStack p={4} align="start" bg="teaGreen.50">
              <Text fontWeight="semibold" color="teaGreen.800">
                {product.name}
              </Text>
              <Text color="teaGreen.600">¥{product.price}</Text>
              <Button
                colorScheme="teaGreen"
                size="sm"
                onClick={() => onAddToCart(product, 1)}
                w="100%"
              >
                カートに追加
              </Button>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default ProductSelection;
