import React from 'react';
import { Box } from '@mui/material';

type Disc3DProps = {
  isBlack: boolean;
  flipped: boolean;
};

const Disc3D: React.FC<Disc3DProps> = ({ isBlack, flipped }) => {
  return (
    <Box
      sx={{
        width: 50,
        height: 50,
        perspective: 600,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: flipped ? 'rotateY(180deg)' : 'none',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backfaceVisibility: 'hidden',
            backgroundColor: isBlack ? 'black' : 'white',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            backgroundColor: isBlack ? 'white' : 'black',
          }}
        />
      </Box>
    </Box>
  );
};

export default Disc3D;
