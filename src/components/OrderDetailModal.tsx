import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
} from '@chakra-ui/react';
import { Order } from '../types';

interface OrderDetailModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, isOpen, onClose }) => {
  const total = order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>注文詳細 - テーブル {order.tableNumber}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Text>ステータス: {order.status}</Text>
            <Text>注文時間: {order.timestamp.toDate().toLocaleString()}</Text>
            <VStack align="stretch">
              {order.items.map((item, index) => (
                <HStack key={index} justify="space-between">
                  <Text>{item.product.name}</Text>
                  <Text>
                    {item.quantity} x ¥{item.product.price} = ¥{item.quantity * item.product.price}
                  </Text>
                </HStack>
              ))}
            </VStack>
            <HStack justify="space-between">
              <Text fontWeight="bold">合計</Text>
              <Text fontWeight="bold">¥{total}</Text>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            閉じる
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderDetailModal;
