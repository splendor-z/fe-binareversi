import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Typography, Container } from "@mui/material";
import { useAppSelector } from "../../hooks/useAppSelector";
import GameBoard from "../../components/GameBoard/GameBoard";

const GamePage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const player = useAppSelector(
    (state: { player: { playerID: string } | null }) => state.player
  );
  const navigate = useNavigate();
  const wsRef = useRef<WebSocket | null>(null);

  const emptyBoard = Array.from({ length: 8 }, () => Array(8).fill(7));
  const [board, setBoard] = useState<number[][]>(emptyBoard);

  if (!player) return null; // 早期リターン

  useEffect(() => {
    if (!roomId || wsRef.current) return;

    const ws = new WebSocket(
      `ws://localhost:8080/ws/game/${roomId}/${player.playerID}`
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
        case "board_update":
          setBoard(data.board);
          break;
        case "valid_moves":
          break;
        case "game_over":
          alert(`Game Over! Winner: ${data.winner}`);
          setTimeout(() => navigate("/rooms"), 3000);
          break;
        case "exited_room":
          navigate("/rooms");
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
  }, [roomId, player, navigate]);

  const handleExit = () => {
    wsRef.current?.send(JSON.stringify({ type: "exit_room" }));
  };

  const handleCellClick = (x: number, y: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "move", x, y }));
    }
  };

  return (
    <Container sx={{ textAlign: "center", marginTop: 5 }}>
      <div className="exit-button-div" style={{ marginBottom: 20 }}>
        <Button variant="contained" color="error" onClick={handleExit}>
          退出
        </Button>
      </div>
      <Typography variant="h4" gutterBottom>
        Reversi Game
      </Typography>
      <GameBoard boardData={board} onCellClick={handleCellClick} />
    </Container>
  );
};

export default GamePage;
