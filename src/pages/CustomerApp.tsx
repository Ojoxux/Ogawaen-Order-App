import React, { useState } from 'react';
import { Box, Container, VStack, HStack, Text, Circle } from '@chakra-ui/react';
import TableNumberConfirmation from '../components/TableNumberConfirmation';
import ProductSelection from '../components/ProductSelection';
import Cart from '../components/Cart';
import OrderConfirmation from '../components/OrderConfirmation';
import CartPreview from '../components/CartPreview';
import { createOrder } from '../services/firebase';
import { Product, CartItem } from '../types';

const CustomerApp: React.FC = () => {
  const [step, setStep] = useState(0);
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleTableNumberConfirm = (number: string) => {
    setTableNumber(number);
    setStep(1);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const handlePlaceOrder = async () => {
    if (tableNumber) {
      await createOrder({ tableNumber, items: cartItems, status: 'pending' });
      setStep(3);
    }
  };

  const handleViewCart = () => {
    setStep(2);
  };

  const handleBackToMenu = () => {
    setStep(1);
  };

  return (
    <Box pb={20} bg="teaGreen.50">
      <Container maxW="container.md">
        <VStack spacing={8}>
          <HStack justify="center" w="100%" my={4}>
            {['テーブル番号', '商品選択', '注文確認'].map((label, index) => (
              <React.Fragment key={label}>
                {index > 0 && <Text color="teaGreen.500">-</Text>}
                <HStack>
                  <Circle
                    size="30px"
                    bg={step >= index ? 'teaGreen.500' : 'teaGreen.100'}
                    color={step >= index ? 'white' : 'teaGreen.500'}
                  >
                    {index + 1}
                  </Circle>
                  <Text
                    color={step >= index ? 'teaGreen.700' : 'teaGreen.400'}
                    fontWeight={step >= index ? 'bold' : 'normal'}
                  >
                    {label}
                  </Text>
                </HStack>
              </React.Fragment>
            ))}
          </HStack>

          <Box
            bg="white"
            borderRadius="lg"
            p={6}
            boxShadow="md"
            borderWidth={1}
            borderColor="teaGreen.200"
            w="100%"
          >
            {step === 0 && <TableNumberConfirmation onConfirm={handleTableNumberConfirm} />}
            {step === 1 && <ProductSelection onAddToCart={handleAddToCart} />}
            {step === 2 && (
              <Cart
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onPlaceOrder={handlePlaceOrder}
                onBackToMenu={handleBackToMenu}
              />
            )}
            {step === 3 && <OrderConfirmation />}
          </Box>
        </VStack>
        {step > 0 && step < 3 && <CartPreview items={cartItems} onViewCart={handleViewCart} />}
      </Container>
    </Box>
  );
};

export default CustomerApp;
