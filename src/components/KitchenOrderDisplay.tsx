import React, { useState, useEffect } from 'react';
import {
  VStack,
  Heading,
  List,
  ListItem,
  HStack,
  Text,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { subscribeToOrders, updateOrderStatus } from '../services/firebase';
import { Order } from '../types';
import OrderDetailModal from './OrderDetailModal';

const KitchenOrderDisplay: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const unsubscribe = subscribeToOrders((newOrders) => {
      setOrders(newOrders);
    });
    return () => unsubscribe();
  }, []);

  const handleCompleteOrder = async (orderId: string | undefined) => {
    if (orderId) {
      await updateOrderStatus(orderId, 'completed');
    }
  };

  const handlePayOrder = async (orderId: string | undefined) => {
    if (orderId) {
      await updateOrderStatus(orderId, 'paid');
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    onOpen();
  };

  return (
    <VStack spacing={4} align="stretch">
      <Heading>キッチン注文一覧</Heading>
      <List spacing={3}>
        {orders.map((order) => (
          <ListItem key={order.id} p={4} borderWidth="1px" borderRadius="md">
            <VStack align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="bold">テーブル {order.tableNumber}</Text>
                <HStack>
                  <Button size="sm" colorScheme="green" onClick={() => handleViewDetails(order)}>
                    詳細
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => handleCompleteOrder(order.id)}
                  >
                    完了
                  </Button>
                  <Button size="sm" colorScheme="purple" onClick={() => handlePayOrder(order.id)}>
                    会計
                  </Button>
                </HStack>
              </HStack>
              <Text>ステータス: {order.status}</Text>
              <Text>注文時間: {order.timestamp.toDate().toLocaleString()}</Text>
            </VStack>
          </ListItem>
        ))}
      </List>
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} isOpen={isOpen} onClose={onClose} />
      )}
    </VStack>
  );
};

export default KitchenOrderDisplay;
