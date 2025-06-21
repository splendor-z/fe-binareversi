import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { Typography, Container } from "@mui/material";
import GameBoard from "../../components/GameBoard/GameBoard";

const emptyBoard = Array.from({ length: 8 }, () => Array(8).fill(7));

const GamePage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>(); // パスパラメータから取得
  const player = useAppSelector((state) => state.player);
  const playerID = player.playerID;
  const [board, setBoard] = useState<number[][]>(emptyBoard);
  const wsRef = useRef<WebSocket | null>(null);
  // const [flippedCells, setFlippedCells] = useState<number[][]>(
  //   Array(8)
  //     .fill(null)
  //     .map(() => Array(8).fill(0))
  // );
  // const prevBoardRef = useRef(board);

  // useEffect(() => {
  //   const prev = prevBoardRef.current;
  //   const newFlipped = board.map((row, y) =>
  //     row.map((cell, x) => {
  //       const prevCell = prev[y][x];
  //       return prevCell !== cell &&
  //         (cell === 0 || cell === 1) &&
  //         (prevCell === 0 || prevCell === 1)
  //         ? 1
  //         : 0;
  //     })
  //   );
  //   setFlippedCells(newFlipped);
  //   prevBoardRef.current = board;
  // }, [board]);

  useEffect(() => {
    if (!roomId || !playerID) return;

    const ws = new WebSocket(
      `ws://localhost:8080/ws/game/${roomId}/${playerID}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(JSON.stringify({ type: "join" }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);

      switch (data.type) {
        case "game_start":
          setBoard(data.board);
          break;
        case "board_update":
          setBoard(data.board);
          break;
        case "valid_moves":
          // 必要なら処理追加
          break;
        case "game_over":
          alert(`Game Over! Winner: ${data.winner}`);
          break;
        default:
          console.warn("Unknown message type", data);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [roomId, playerID]);

  const handleCellClick = (x: number, y: number) => {
    console.log(`クリックされた座標: (${x}, ${y})`);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "move",
          x,
          y,
        })
      );
    }
  };

  return (
    <Container sx={{ textAlign: "center", marginTop: 5 }}>
      <Typography variant="h4" gutterBottom>
        Reversi Game
      </Typography>
      {/* <GameBoard
        boardData={board}
        onCellClick={handleCellClick}
        flippedCells={flippedCells}
      /> */}
      <GameBoard
        boardData={board}
        onCellClick={handleCellClick}
      />
    </Container>
  );
};

export default GamePage;
