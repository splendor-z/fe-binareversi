import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

const StartPage: React.FC = () => {
  const [username, setUsername] = useState('');

  const handleStart = () => {
    console.log('ユーザー名:', username);
    // 今後: バックエンドに送信、ID付与など
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        gap={2}
      >
        <Typography variant="h5">ユーザー名を入力してください</Typography>
        <TextField
          label="ユーザー名"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleStart}
          disabled={!username.trim()}
        >
          スタート
        </Button>
      </Box>
    </Container>
  );
};

export default StartPage;
