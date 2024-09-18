import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, VStack, Heading, HStack } from '@chakra-ui/react';

interface TableNumberConfirmationProps {
  onConfirm: (tableNumber: string) => void;
}

const TableNumberConfirmation: React.FC<TableNumberConfirmationProps> = ({ onConfirm }) => {
  const [tableNumber, setTableNumber] = useState('');
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (tableNumber) {
      onConfirm(tableNumber);
    }
  };

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  return (
    <VStack spacing={4} align="stretch">
      <Heading as="h2" size="lg">
        テーブル番号を確認してください
      </Heading>
      <Input
        placeholder="テーブル番号"
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
      />
      <HStack justifyContent="space-between">
        <Button colorScheme="green" onClick={handleConfirm} isDisabled={!tableNumber}>
          確認
        </Button>
        <Button variant="outline" onClick={handleAdminLogin}>
          管理者としてログイン
        </Button>
      </HStack>
    </VStack>
  );
};

export default TableNumberConfirmation;
