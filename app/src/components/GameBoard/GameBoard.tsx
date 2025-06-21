import React from 'react';
import { Box } from '@mui/material';
import './gameBoard.css';

type BoardProps = {
  onCellClick: (x: number, y: number) => void;
  boardData: number[][];
};

const GameBoard: React.FC<BoardProps> = ({ onCellClick, boardData }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gridTemplateRows: 'repeat(8, 1fr)',
        width: 650,
        height: 650,
        border: '4px solid black',
      }}
    >
      {boardData.flatMap((row, y) =>
        row.map((cell, x) => (
          <Box
            key={`${x}-${y}`}
            onClick={() => {
              if (cell === 9) onCellClick(x, y);
            }}
            sx={{
              border: '2px solid black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#2e7d32',
              cursor: cell === 9 ? 'pointer' : 'default',
              '&:hover': cell === 9 ? { backgroundColor: '#4caf50' } : {},
            }}
          >
            {cell === 0 && (
              <Box
                sx={{
                  width: 65,
                  height: 65,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                }}
              />
            )}
            {cell === 1 && (
              <Box
                sx={{
                  width: 65,
                  height: 65,
                  borderRadius: '50%',
                  backgroundColor: 'black',
                }}
              />
            )}
          </Box>
        ))
      )}
    </Box>
  );
};

export default GameBoard;
