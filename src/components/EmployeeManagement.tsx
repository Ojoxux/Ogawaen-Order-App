import React, { useState, useEffect } from 'react';
import {
  VStack,
  Heading,
  Input,
  Button,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { registerEmployee, getEmployees, deleteEmployee, Employee } from '../services/auth';

const EmployeeManagement: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const fetchedEmployees = await getEmployees();
      setEmployees(fetchedEmployees);
    } catch (error) {
      toast({
        title: '従業員の取得に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerEmployee(email, password);
      toast({
        title: '従業員登録成功',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setEmail('');
      setPassword('');
      fetchEmployees();
    } catch (error) {
      toast({
        title: '従業員登録失敗',
        description: error instanceof Error ? error.message : '不明なエラーが発生しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (selectedEmployee) {
      try {
        await deleteEmployee(selectedEmployee.id);
        toast({
          title: '従業員削除成功',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchEmployees();
      } catch (error) {
        toast({
          title: '従業員削除失敗',
          description: '従業員の削除中にエラーが発生しました',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
    onClose();
  };

  return (
    <VStack spacing={8} align="stretch">
      <Heading size="md">従業員管理</Heading>

      <form onSubmit={handleRegister}>
        <VStack spacing={4}>
          <Input
            placeholder="ユーザー名"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" colorScheme="teaGreen">
            従業員を登録
          </Button>
        </VStack>
      </form>

      <Heading size="sm">従業員一覧</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ユーザー名</Th>
            <Th>役割</Th>
            <Th>操作</Th>
          </Tr>
        </Thead>
        <Tbody>
          {employees.map((employee) => (
            <Tr key={employee.id}>
              <Td>{employee.username}</Td>
              <Td>{employee.role}</Td>
              <Td>
                <Button colorScheme="red" size="sm" onClick={() => handleDeleteClick(employee)}>
                  削除
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>従業員削除の確認</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEmployee && `${selectedEmployee.username} を削除してもよろしいですか？`}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteConfirm}>
              削除
            </Button>
            <Button variant="ghost" onClick={onClose}>
              キャンセル
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default EmployeeManagement;
