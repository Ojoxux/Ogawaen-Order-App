import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  useToast,
  useDisclosure,
  Box,
  Flex,
  Heading,
  IconButton,
  Text,
  VStack,
  Spacer,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Divider,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FiPackage, FiUsers, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import KitchenOrderDisplay from '../components/KitchenOrderDisplay';
import ProductManagement from '../components/ProductManagement';
import EmployeeManagement from '../components/EmployeeManagement';

const AdminDashboard: React.FC = () => {
  const { user, loading, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [toastShown, setToastShown] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('orders');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newPhotoURL, setNewPhotoURL] = useState(user?.photoURL ?? '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sidebarWidth = useBreakpointValue({ base: '100%', md: '250px' });

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

  const handleLogout = async () => {
    await logout();
    navigate('/admin-login');
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        // ここで画像をアップロードするロジックを追加します
        // 例: const imageUrl = await uploadImage(file);
        const imageUrl = URL.createObjectURL(file); // 仮のロジック
        setNewPhotoURL(imageUrl);
        setUser({ ...user, photoURL: imageUrl }); // ユーザーの写真を更新
        toast({
          title: '画像をアップロードしました',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: '画像のアップロードに失敗しました',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsUploading(false);
        onClose();
      }
    }
  };

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
    <Flex h="100vh" bg="gray.100">
      <Box
        w={sidebarWidth}
        bg="white"
        boxShadow="md"
        p={4}
        position="fixed" // サイドバーを固定
        h="100vh" // サイドバーの高さを全画面に設定
        overflowY="auto" // サイドバー内でスクロール可能にする
      >
        <VStack align="start" spacing={4} h="100%">
          <Heading size="md" color="green.800">
            尾川園管理者画面
          </Heading>
          <Divider />
          <Flex
            align="center"
            w="100%"
            onClick={() => setSelectedComponent('orders')}
            _hover={{ bg: 'green.50', transition: 'background-color 0.2s' }}
            p={2}
            borderRadius="md"
          >
            <IconButton
              aria-label="Orders"
              icon={<FiPackage />}
              variant="ghost"
              colorScheme="green"
              isRound
            />
            <Text ml={2} color="green.800">
              注文
            </Text>
          </Flex>
          <Flex
            align="center"
            w="100%"
            onClick={() => setSelectedComponent('products')}
            _hover={{ bg: 'green.50', transition: 'background-color 0.2s' }}
            p={2}
            borderRadius="md"
          >
            <IconButton
              aria-label="Products"
              icon={<FiUsers />}
              variant="ghost"
              colorScheme="green"
              isRound
            />
            <Text ml={2} color="green.800">
              商品管理
            </Text>
          </Flex>
          <Flex
            align="center"
            w="100%"
            onClick={() => setSelectedComponent('employees')}
            _hover={{ bg: 'green.50', transition: 'background-color 0.2s' }}
            p={2}
            borderRadius="md"
          >
            <IconButton
              aria-label="Employees"
              icon={<FiUsers />}
              variant="ghost"
              colorScheme="green"
              isRound
            />
            <Text ml={2} color="green.800">
              従業員
            </Text>
          </Flex>
          <Spacer />
          <Button
            leftIcon={<FiLogOut />}
            variant="solid"
            colorScheme="red"
            onClick={handleLogout}
            w="100%"
          >
            ログアウト
          </Button>
        </VStack>
      </Box>
      <Box flex="1" p={4} ml={{ base: 0, md: sidebarWidth }}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg" color="green.800">
            管理ダッシュボード
          </Heading>
          <Avatar
            name={user?.displayName ?? ''}
            src={user?.photoURL ?? ''}
            onClick={onOpen}
            cursor="pointer"
            border="2px solid"
            borderColor="green.800"
          />
        </Flex>
        <Box bg="white" p={4} borderRadius="md" boxShadow="md">
          {renderComponent()}
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>プロフィール設定</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                hidden
                ref={fileInputRef}
              />
              <Button onClick={() => fileInputRef.current?.click()} isLoading={isUploading}>
                画像をアップロード
              </Button>
              {newPhotoURL && (
                <Box mt={2}>
                  <Avatar src={newPhotoURL} size="xl" />
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={handleLogout}>
              ログアウト
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default AdminDashboard;
