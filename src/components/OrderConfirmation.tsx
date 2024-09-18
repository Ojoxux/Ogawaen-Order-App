import React from 'react';
import { VStack, Heading, Text, Button, Box } from '@chakra-ui/react';

const OrderConfirmation: React.FC<{ onNewOrder: () => void }> = ({ onNewOrder }) => {
  return (
    <VStack spacing={6} align="center" p={8} bg="white" borderRadius="lg" boxShadow="md">
      <Heading as="h2" size="xl" color="teaGreen.700">
        ご注文ありがとうございます
      </Heading>
      <VStack spacing={3} align="center">
        <Text fontSize="lg">お客様のご注文を受け付けました。</Text>
        <Text fontSize="lg">しばらくお待ちください。</Text>
      </VStack>
      <Box borderWidth={1} borderColor="teaGreen.200" p={4} borderRadius="md">
        <Text fontWeight="bold" mb={2}>
          注文状況
        </Text>
        <Text>準備中</Text>
      </Box>
      <Button colorScheme="teaGreen" size="lg" onClick={onNewOrder} mt={4}>
        新しい注文を始める
      </Button>
    </VStack>
  );
};

export default OrderConfirmation;
