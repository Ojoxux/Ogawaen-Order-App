import React from 'react';
import { Box, Button, Text, Flex } from '@chakra-ui/react';
import { CartItem } from '../types';

interface CartPreviewProps {
  items: CartItem[];
  onViewCart: () => void;
}

const CartPreview: React.FC<CartPreviewProps> = ({ items, onViewCart }) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      boxShadow="0 -2px 10px rgba(0, 0, 0, 0.1)"
      p={4}
      borderTopWidth={1}
      borderColor="teaGreen.200"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontWeight="bold" color="teaGreen.700">
          {totalItems} 点の商品: ¥{totalPrice}
        </Text>
        <Button colorScheme="teaGreen" onClick={onViewCart}>
          カートを見る
        </Button>
      </Flex>
    </Box>
  );
};

export default CartPreview;
