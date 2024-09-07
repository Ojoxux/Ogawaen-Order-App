import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast, Box, Flex, Heading, IconButton, Text, VStack, Avatar } from '@chakra-ui/react';
import { FiPackage, FiUsers } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import KitchenOrderDisplay from '../components/KitchenOrderDisplay';
import ProductManagement from '../components/ProductManagement';
import EmployeeManagement from '../components/EmployeeManagement';

const AdminDashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [toastShown, setToastShown] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('orders');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin-login');
    } else if (location.state?.loginSuccess && !toastShown) {
      toast({
        title: 'ログイン成功',
        description: '管理ダッシュボードにようこそ',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setToastShown(true);
      location.state.loginSuccess = false;
    }
  }, [user, loading, navigate, location, toast, toastShown]);

  if (loading || !user) {
    return null;
  }

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'orders':
        return <KitchenOrderDisplay />;
      case 'products':
        return <ProductManagement />;
      case 'employees':
        return <EmployeeManagement />;
      default:
        return <Text>注文コンポーネント</Text>;
    }
  };

  return (
    <Flex h="100vh">
      <Box w="250px" bg="green.800" color="white" p={4}>
        <VStack align="start" spacing={4}>
          <Heading size="md">お茶屋さん</Heading>
          <Flex align="center" w="100%">
            <IconButton
              aria-label="Orders"
              icon={<FiPackage />}
              variant="ghost"
              colorScheme="whiteAlpha"
              isRound
              onClick={() => setSelectedComponent('orders')}
            />
            <Text ml={2}>注文</Text>
          </Flex>
          <Flex align="center" w="100%">
            <IconButton
              aria-label="Products"
              icon={<FiUsers />}
              variant="ghost"
              colorScheme="whiteAlpha"
              isRound
              onClick={() => setSelectedComponent('products')}
            />
            <Text ml={2}>商品管理</Text>
          </Flex>
          <Flex align="center" w="100%">
            <IconButton
              aria-label="Employees"
              icon={<FiUsers />}
              variant="ghost"
              colorScheme="whiteAlpha"
              isRound
              onClick={() => setSelectedComponent('employees')}
            />
            <Text ml={2}>従業員</Text>
          </Flex>
        </VStack>
      </Box>
      <Box flex="1" p={4}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg">管理ダッシュボード</Heading>
          <Avatar name={user?.displayName ?? ''} src={user?.photoURL ?? ''} />
        </Flex>
        <Box>{renderComponent()}</Box>
      </Box>
    </Flex>
  );
};

export default AdminDashboard;
