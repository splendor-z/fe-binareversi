import React from 'react';
import { Box } from '@mui/material';
import Disc3D from './Disc3D';

type BoardProps = {
  onCellClick: (x: number, y: number) => void;
  boardData: number[][];
  flippedCells?: number[][];
};

const GameBoard: React.FC<BoardProps> = ({ onCellClick, boardData, flippedCells }) => {
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
        row.map((cell, x) => {
          const flipped = flippedCells?.[y]?.[x] === 1;

          return (
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
              {(cell === 0 || cell === 1) && (
                <Disc3D isBlack={cell === 1} flipped={flipped} />
              )}
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default GameBoard;
