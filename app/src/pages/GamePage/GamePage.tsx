import React, { useState, useEffect, useRef } from 'react';
import { Typography, Container } from '@mui/material';
import GameBoard from '../../components/GameBoard/GameBoard';

const sampleData1 = [
  [7,7,7,7,7,7,7,7],
  [9,9,9,9,9,9,9,9],
  [7,7,7,7,7,7,7,7],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1],
  [0,1,0,1,0,1,0,1],
];

const sampleData2 = [
  [7,7,7,7,7,7,7,7],
  [9,9,9,9,9,9,9,9],
  [7,7,7,7,7,7,7,7],
  [1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,1,0,1,0,1,0,1],
];

const sampleData3 = [
  [9,9,9,9,9,9,9,9],
  [7,7,7,7,7,7,7,7],
  [1,1,1,1,1,1,1,1],
  [7,7,7,7,7,7,7,7],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1],
  [0,1,0,1,0,1,0,1],
];

const allSamples = [sampleData1, sampleData2, sampleData3];

const GamePage: React.FC = () => {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [board, setBoard] = useState(allSamples[0]);
  const [flippedCells, setFlippedCells] = useState<number[][]>(
    Array(8).fill(null).map(() => Array(8).fill(0))
  );

  const prevBoardRef = useRef(board);

  useEffect(() => {
    const prev = prevBoardRef.current;
    const newFlipped = board.map((row, y) =>
      row.map((cell, x) => {
        const prevCell = prev[y][x];
        return (prevCell !== cell) && (cell === 0 || cell === 1) && (prevCell === 0 || prevCell === 1) ? 1 : 0;
      })
    );
    setFlippedCells(newFlipped);
    prevBoardRef.current = board;
  }, [board]);

  const handleCellClick = (x: number, y: number) => {
    if (board[y][x] === 9) {
      const next = (sampleIndex + 1) % allSamples.length;
      setSampleIndex(next);
      setBoard(allSamples[next]);
    }
  };

  return (
    <Container sx={{ textAlign: 'center', marginTop: 5 }}>
      <Typography variant="h4" gutterBottom>
      </Typography>
      <GameBoard boardData={board} onCellClick={handleCellClick} flippedCells={flippedCells} />
    </Container>
  );
};

export default GamePage;
