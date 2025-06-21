import React from 'react';
import { Box, Grid } from '@mui/material';
import './gameBoard.css';


type BoardProps = {
  onCellClick: (x: number, y: number) => void;
};

const GameBoard: React.FC<BoardProps> = ({ onCellClick }) => {
  const board = Array.from({ length: 8 }, (_, y) =>
    Array.from({ length: 8 }, (_, x) => ({ x, y }))
  );

  return (
    <Box
      className="board-container"
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gridTemplateRows: 'repeat(8, 1fr)',
        width: 600,
        height: 600,
        border: '4px solid black',
      }}
    >
      {board.flat().map(({ x, y }) => (
        <Box
          key={`${x}-${y}`}
          className="cell"
          onClick={() => onCellClick(x, y)}
        />
      ))}
    </Box>
  );
};

export default GameBoard;
