import React from 'react';
import { Typography, Container } from '@mui/material';
import GameBoard from '../../components/GameBoard/GameBoard';

const GamePage: React.FC = () => {
  const handleCellClick = (x: number, y: number) => {
    console.log(`クリックされた座標: (${x}, ${y})`);
  };

  return (
    <Container sx={{ textAlign: 'center', marginTop: 5 }}>
      <Typography variant="h4" gutterBottom>
      </Typography>
      <GameBoard onCellClick={handleCellClick} />
    </Container>
  );
};

export default GamePage;
