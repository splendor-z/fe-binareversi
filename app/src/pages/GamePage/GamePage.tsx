import React, { useState } from 'react';
import { Typography, Container } from '@mui/material';
import GameBoard from '../../components/GameBoard/GameBoard';

const sampleData = [
  [7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7],
  [7,0,9,0,0,0,0,0],
  [7,9,1,9,0,0,0,0],
  [7,0,9,0,0,0,0,0],
  [7,0,0,0,0,0,1,0],
  [7,0,0,1,0,1,0,0],
  [7,7,7,7,0,0,0,0],
];

const GamePage: React.FC = () => {
  const [board, setBoard] = useState(sampleData);
  const handleCellClick = (x: number, y: number) => {
    console.log(`クリックされた座標: (${x}, ${y})`);
  };

  

  return (
    <Container sx={{ textAlign: 'center', marginTop: 5 }}>
      <Typography variant="h4" gutterBottom>
      </Typography>
      <GameBoard boardData={board} onCellClick={handleCellClick} />
    </Container>
  );
};

export default GamePage;
