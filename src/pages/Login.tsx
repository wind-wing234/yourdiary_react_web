import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  alpha,
  Box
} from '@mui/material';
import Grid from "@mui/material/Grid2";
import { useNavigate } from 'react-router';
import { login, AuthError } from '../api/auth.ts';
import { useAuth } from '../context/AuthContext.tsx';
import backgroundImageUrl from '../assets/blue-5136251.jpg';
import BackgroundImageLayout from '../components/BackgroundImageLayout.tsx';
import BackgroundDynamicCircle from '../components/BackgroundDynamicCircle.tsx';

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 如果已认证，直接重定向到日记页面
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/diary');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      // 保存认证信息到context，并传递rememberMe状态
      authLogin(response.token, response.userid, rememberMe);
      // 登录成功后跳转
      navigate('/diary');
    } catch (err) {
      if (err instanceof AuthError) {
        // 处理不同类型的认证错误
        setError(err.message);
      } else {
        // 处理其他类型错误（网络错误等）
        setError('登录失败，未知原因:' + err);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundImageLayout backgroundImage={backgroundImageUrl} justifyContent="flex-end">
      {/* <BackgroundDynamicCircle justifyContent='flex-end'> */}
      <Container maxWidth="xs" sx={{ marginRight: '10%' }}>
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.6),
            borderRadius: 2
          }}
        >
          {/* variant控制显示样式 component 表示实际的html元素（展示其语义上的地位） */}
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            color='textSecondary'>
            Your Diary
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="电子邮箱"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密码"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="记住密码"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 3, py: 1.5 }}
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </Button>

            <Grid container justifyContent="flex-end">
              <Typography variant="body2" color="text.secondary">
                <a 
                  href="https://nideriji.cn/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'inherit' , textDecoration: 'none'}}
                >
                  没有账号？点击使用手机端APP创建
                </a>
              </Typography>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </BackgroundImageLayout>
    // </BackgroundDynamicCircle>
  );
};

export default Login;
