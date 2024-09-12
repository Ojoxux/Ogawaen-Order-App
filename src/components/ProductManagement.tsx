import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  VStack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  NumberInput,
  NumberInputField,
  IconButton,
  Checkbox,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  uploadImage,
  deleteProduct,
  getProducts,
  addProduct,
  updateProduct,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../services/firebase';

const ProductManagement: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState<any>({
    name: '',
    price: 0,
    image: '',
    tag: '',
    description: '',
    allergens: '',
    isRecommended: false,
  });
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    };
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    };
    fetchProducts();
    fetchCategories();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const imageUrl = await uploadImage(file);
        if (editingProduct) {
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

  const handleAddProduct = async () => {
    try {
      await addProduct(newProduct);
      setNewProduct({
        name: '',
        price: 0,
        image: '',
        tag: '',
        description: '',
        allergens: '',
        isRecommended: false,
      });
      setIsAddModalOpen(false);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
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
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
        toast({ title: '商品を更新しました', status: 'success' });
      } catch (error) {
        toast({ title: '商品の更新に失敗しました', status: 'error' });
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
      toast({ title: '商品を削除しました', status: 'success' });
    } catch (error) {
      toast({ title: '商品の削除に失敗しました', status: 'error' });
    }
  };

  const handleAddCategory = async () => {
    try {
      await addCategory(newCategory);
      setNewCategory('');
      setIsCategoryModalOpen(false);
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
      toast({ title: 'カテゴリを追加しました', status: 'success' });
    } catch (error) {
      toast({ title: 'カテゴリの追加に失敗しました', status: 'error' });
    }
  };

  const handleUpdateCategory = async () => {
    if (editingCategory) {
      try {
        await updateCategory(editingCategory.id, editingCategory.name);
        setEditingCategory(null);
        setIsCategoryModalOpen(false);
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
        toast({ title: 'カテゴリを更新しました', status: 'success' });
      } catch (error) {
        toast({ title: 'カテゴリの更新に失敗しました', status: 'error' });
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
      toast({ title: 'カテゴリを削除しました', status: 'success' });
    } catch (error) {
      toast({ title: 'カテゴリの削除に失敗しました', status: 'error' });
    }
  };

  const renderImageUpload = (isEditing: boolean) => (
    <FormControl>
      <FormLabel>商品画像</FormLabel>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e)}
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

  const renderCategorySelect = (isEditing: boolean) => (
    <FormControl>
      <FormLabel>カテゴリ</FormLabel>
      <select
        value={isEditing ? editingProduct?.tag : newProduct.tag}
        onChange={(e) => {
          const selectedTag = e.target.value;
          console.log(`Selected category: ${selectedTag}`);
          if (isEditing) {
            setEditingProduct({ ...editingProduct, tag: selectedTag });
          } else {
            setNewProduct({ ...newProduct, tag: selectedTag });
          }
        }}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </FormControl>
  );

  return (
    <VStack spacing={4} align="stretch">
      <Heading size="md">商品管理</Heading>
      <Button leftIcon={<AddIcon />} onClick={() => setIsAddModalOpen(true)}>
        新規商品を追加
      </Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>商品名</Th>
            <Th>価格</Th>
            <Th>画像</Th>
            <Th>操作</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product.id}>
              <Td>{product.name}</Td>
              <Td>{product.price}</Td>
              <Td>
                <Image src={product.image} alt={product.name} maxH="100px" />
              </Td>
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

      <Heading size="md">カテゴリ管理</Heading>
      <Button leftIcon={<AddIcon />} onClick={() => setIsCategoryModalOpen(true)}>
        新規カテゴリを追加
      </Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>カテゴリ名</Th>
            <Th>操作</Th>
          </Tr>
        </Thead>
        <Tbody>
          {categories.map((category) => (
            <Tr key={category.id}>
              <Td>{category.name}</Td>
              <Td>
                <IconButton
                  aria-label="Edit category"
                  icon={<EditIcon />}
                  onClick={() => {
                    setEditingCategory(category);
                    setIsCategoryModalOpen(true);
                  }}
                  mr={2}
                />
                <IconButton
                  aria-label="Delete category"
                  icon={<DeleteIcon />}
                  onClick={() => handleDeleteCategory(category.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* 新規商品追加モーダル */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
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
              <FormControl>
                <FormLabel>説明</FormLabel>
                <Input
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>アレルギー情報</FormLabel>
                <Input
                  value={newProduct.allergens}
                  onChange={(e) => setNewProduct({ ...newProduct, allergens: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>おすすめ</FormLabel>
                <Checkbox
                  isChecked={newProduct.isRecommended}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, isRecommended: e.target.checked })
                  }
                >
                  おすすめ
                </Checkbox>
              </FormControl>
              {renderImageUpload(false)}
              {renderCategorySelect(false)}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teaGreen" mr={3} onClick={handleAddProduct}>
              追加
            </Button>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              キャンセル
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 商品編集モーダル */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
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
                <FormControl>
                  <FormLabel>説明</FormLabel>
                  <Input
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>アレルギー情報</FormLabel>
                  <Input
                    value={editingProduct.allergens}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, allergens: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>おすすめ</FormLabel>
                  <Checkbox
                    isChecked={editingProduct.isRecommended}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isRecommended: e.target.checked })
                    }
                  >
                    おすすめ
                  </Checkbox>
                </FormControl>
                {renderImageUpload(true)}
                {renderCategorySelect(true)}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teaGreen" mr={3} onClick={handleUpdateProduct}>
              更新
            </Button>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              キャンセル
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* カテゴリ追加・編集モーダル */}
      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingCategory ? 'カテゴリを編集' : '新規カテゴリを追加'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>カテゴリ名</FormLabel>
              <Input
                value={editingCategory ? editingCategory.name : newCategory}
                onChange={(e) => {
                  if (editingCategory) {
                    setEditingCategory({ ...editingCategory, name: e.target.value });
                  } else {
                    setNewCategory(e.target.value);
                  }
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teaGreen"
              mr={3}
              onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
            >
              {editingCategory ? '更新' : '追加'}
            </Button>
            <Button variant="ghost" onClick={() => setIsCategoryModalOpen(false)}>
              キャンセル
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ProductManagement;
