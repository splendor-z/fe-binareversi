import React from "react";
import { Box } from "@mui/material";
import Disc3D from "./Disc3D";

type BoardProps = {
  onCellClick: (x: number, y: number) => void;
  boardData: number[][];
  flippedCells?: number[][]; // flipedcellsはひっくっり返されたコマの二次元配列ではなく、意味合いとしては一手前の盤面が正しいので英語が間違っている。
  isOperating: boolean;
};

const GameBoard: React.FC<BoardProps> = ({
  onCellClick,
  boardData,
  flippedCells,
  isOperating, // ← 忘れずに受け取る
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 1fr)",
        gridTemplateRows: "repeat(8, 1fr)",
        width: 480,
        height: 480,
        border: "4px solid black",
      }}
    >
      {Array.from({ length: 8 }, (_, x) =>
        Array.from({ length: 8 }, (_, y) => {
          const cell = boardData[x][y];
          const flipped = flippedCells?.[x]?.[y] === 1;

          return (
            <Box
              key={`${x}-${y}`}
              onClick={() => {
                if (cell === 9) onCellClick(x, y);
              }}
              sx={{
                border: "2px solid black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#2e7d32",
                cursor: cell === 9 ? "pointer" : "default",
                "&:hover": cell === 9 ? { backgroundColor: "#4caf50" } : {},
                position: "relative", // ← 重ねるために必要
              }}
            >
              {(cell === 0 || cell === 1) && (
                <>
                  <Disc3D isBlack={cell === 1} flipped={flipped} />
                  {isOperating && (
                    <Box
                      sx={{
                        position: "absolute",
                        color: cell === 1 ? "white" : "black",
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                      }}
                    >
                      {cell}
                    </Box>
                  )}
                </>
              )}
            </Box>
          );
        })
      ).flat()}
    </Box>
  );
};

export default GameBoard;
