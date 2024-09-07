import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { getEmployees, deleteEmployee } from '../services/auth';
import { Employee } from '../types';

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchEmployees = async () => {
      const employees = await getEmployees();
      setEmployees(employees);
    };
    fetchEmployees();
  }, []);

  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (selectedEmployee) {
      await deleteEmployee(selectedEmployee.id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== selectedEmployee.id));
      toast({
        title: '従業員削除',
        description: `${selectedEmployee.username} を削除しました`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    }
  };

  return (
    <Box>
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
    </Box>
  );
};

export default EmployeeManagement;
