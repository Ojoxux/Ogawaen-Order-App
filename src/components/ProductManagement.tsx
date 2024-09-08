import React, { useState, useEffect, useRef } from 'react';
import {
  VStack,
  Heading,
  Button,
  Input,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  Box,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from '../services/firebase';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const MotionVStack = motion(VStack);
const MotionBox = motion(Box);

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, image: '' });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const fetchedProducts = await getProducts();
    setProducts(fetchedProducts);
  };

  const handleAddProduct = async () => {
    try {
      await addProduct(newProduct);
      setNewProduct({ name: '', price: 0, image: '' });
      setIsAddModalOpen(false);
      fetchProducts();
      toast({ title: '商品を追加しました', status: 'success' });
    } catch (error) {
      toast({ title: '商品の追加に失敗しました', status: 'error' });
    }
  };

  const handleUpdateProduct = async () => {
    if (editingProduct) {
      try {
        await updateProduct(editingProduct.id, editingProduct);
        setEditingProduct(null);
        setIsEditModalOpen(false);
        fetchProducts();
        toast({ title: '商品を更新しました', status: 'success' });
      } catch (error) {
        toast({ title: '商品の更新に失敗しました', status: 'error' });
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      fetchProducts();
      toast({ title: '商品を削除しました', status: 'success' });
    } catch (error) {
      toast({ title: '商品の削除に失敗しました', status: 'error' });
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    isEditing: boolean
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const imageUrl = await uploadImage(file);
        if (isEditing && editingProduct) {
          setEditingProduct({ ...editingProduct, image: imageUrl });
        } else {
          setNewProduct({ ...newProduct, image: imageUrl });
        }
        toast({ title: '画像をアップロードしました', status: 'success' });
      } catch (error) {
        console.error('画像アップロードエラー:', error);
        toast({
          title: '画像のアップロードに失敗しました',
          description: error instanceof Error ? error.message : '不明なエラーが発生しました',
          status: 'error',
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const renderImageUpload = (isEditing: boolean) => (
    <FormControl>
      <FormLabel>商品画像</FormLabel>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, isEditing)}
        hidden
        ref={fileInputRef}
      />
      <Button onClick={() => fileInputRef.current?.click()} isLoading={isUploading}>
        画像をアップロード
      </Button>
      {isEditing && editingProduct?.image && (
        <Box mt={2}>
          <Image src={editingProduct.image} alt="商品画像" maxH="100px" />
        </Box>
      )}
      {!isEditing && newProduct.image && (
        <Box mt={2}>
          <Image src={newProduct.image} alt="商品画像" maxH="100px" />
        </Box>
      )}
    </FormControl>
  );

  return (
    <MotionVStack
      spacing={5}
      align="stretch"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Heading size="md">商品管理</Heading>
      <Button leftIcon={<AddIcon />} onClick={() => setIsAddModalOpen(true)}>
        新規商品を追加
      </Button>

      {/* 商品一覧 */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>商品名</Th>
            <Th>価格</Th>
            <Th>操作</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product.id}>
              <Td>{product.name}</Td>
              <Td>{product.price}</Td>
              <Td>
                <IconButton
                  aria-label="Edit product"
                  icon={<EditIcon />}
                  onClick={() => {
                    setEditingProduct(product);
                    setIsEditModalOpen(true);
                  }}
                  mr={2}
                />
                <IconButton
                  aria-label="Delete product"
                  icon={<DeleteIcon />}
                  onClick={() => handleDeleteProduct(product.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* 新規商品追加モーダル */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <ModalOverlay />
        <MotionBox
          as={ModalContent}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ModalHeader>新規商品を追加</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <FormControl>
                <FormLabel>商品名</FormLabel>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>価格</FormLabel>
                <NumberInput
                  value={newProduct.price}
                  onChange={(_, value) => setNewProduct({ ...newProduct, price: value })}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              {renderImageUpload(false)}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddProduct}>
              追加
            </Button>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              キャンセル
            </Button>
          </ModalFooter>
        </MotionBox>
      </Modal>

      {/* 商品編集モーダル */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <MotionBox
          as={ModalContent}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ModalHeader>商品を編集</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingProduct && (
              <VStack spacing={3}>
                <FormControl>
                  <FormLabel>商品名</FormLabel>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>価格</FormLabel>
                  <NumberInput
                    value={editingProduct.price}
                    onChange={(_, value) => setEditingProduct({ ...editingProduct, price: value })}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                {renderImageUpload(true)}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateProduct}>
              更新
            </Button>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              キャンセル
            </Button>
          </ModalFooter>
        </MotionBox>
      </Modal>
    </MotionVStack>
  );
};

export default ProductManagement;
