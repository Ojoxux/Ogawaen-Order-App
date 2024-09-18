import React from 'react';
import { Box, VStack, HStack, Text, Button, Divider, IconButton, Heading } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onPlaceOrder: () => void;
  onBackToMenu: () => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onBackToMenu,
}) => {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Heading as="h2" size="lg" color="teaGreen.700">
          カート
        </Heading>
        {items.map((item) => (
          <HStack key={item.product.id} justify="space-between">
            <Text>{item.product.name}</Text>
            <HStack>
              <Button
                size="sm"
                onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                isDisabled={item.quantity <= 1}
              >
                -
              </Button>
              <Text>{item.quantity}</Text>
              <Button
                size="sm"
                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
              >
                +
              </Button>
              <IconButton
                aria-label="Remove item"
                icon={<FaTrash />}
                size="sm"
                onClick={() => onRemoveItem(item.product.id)}
              />
            </HStack>
          </HStack>
        ))}
        <Divider borderColor="teaGreen.200" />
        <HStack justify="space-between">
          <Text fontWeight="bold" color="teaGreen.800">
            合計:
          </Text>
          <Text fontWeight="bold" color="teaGreen.700">
            ¥{total}
          </Text>
        </HStack>
        <Button
          colorScheme="teaGreen"
          onClick={onPlaceOrder}
          isDisabled={items.length === 0}
          size="lg"
        >
          注文する
        </Button>
        <Button variant="outline" onClick={onBackToMenu} size="lg">
          メニューに戻る
        </Button>
      </VStack>
    </Box>
  );
};

export default Cart;
