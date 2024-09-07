import React, { useState } from 'react';
import { Button, Input, VStack, Heading, useToast, Box, Container } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmailAndPassword } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginWithEmailAndPassword(email, password);
      login(user);
      navigate('/admin-dashboard', { state: { loginSuccess: true } });
    } catch (error) {
      toast({
        title: 'ログイン失敗',
        description: 'メールアドレスまたはパスワードが正しくありません',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // 開発用のログインスキップ関数
  const handleSkipLogin = () => {
    const devUser = {
      uid: 'dev-user',
      email: 'dev@example.com',
      displayName: 'Dev User',
    };
    login(devUser as any); // 型を無視してキャスト
    navigate('/admin-dashboard', { state: { loginSuccess: true } });
  };

  return (
    <Container maxW="md" centerContent>
      <Box
        borderWidth={1}
        borderRadius="lg"
        p={8}
        mt={16}
        boxShadow="md"
        bg="white"
        width="100%"
        borderColor="teaGreen.200"
      >
        <form onSubmit={handleLogin}>
          <VStack spacing={6}>
            <Heading as="h2" size="lg" color="teaGreen.700">
              お茶屋さん管理システム
            </Heading>
            <Input
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              bg="teaGreen.50"
              borderColor="teaGreen.200"
              _hover={{ borderColor: 'teaGreen.300' }}
              _focus={{ borderColor: 'teaGreen.400', boxShadow: '0 0 0 1px #68D391' }}
            />
            <Input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              bg="teaGreen.50"
              borderColor="teaGreen.200"
              _hover={{ borderColor: 'teaGreen.300' }}
              _focus={{ borderColor: 'teaGreen.400', boxShadow: '0 0 0 1px #68D391' }}
            />
            <Button
              type="submit"
              colorScheme="teaGreen"
              width="100%"
              size="lg"
              _hover={{ bg: 'teaGreen.600' }}
            >
              ログイン
            </Button>
            {/* 開発用のログインスキップボタン */}
            <Button colorScheme="gray" width="100%" size="lg" onClick={handleSkipLogin}>
              ログインをスキップ
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};

export default AdminLogin;
