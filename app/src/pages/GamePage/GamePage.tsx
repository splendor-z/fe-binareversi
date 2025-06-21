import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { useAppSelector } from "../../hooks/useAppSelector";
import GameBoard from "../../components/GameBoard/GameBoard";
import Header from "../../components/Header/Header";

const GamePage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const player = useAppSelector(
    (state: { player: { playerID: string } | null }) => state.player
  );
  const navigate = useNavigate();
  const wsRef = useRef<WebSocket | null>(null);

  const emptyBoard = Array.from({ length: 8 }, () => Array(8).fill(7));
  const [board, setBoard] = useState<number[][]>(emptyBoard);

  const isVertical = useMediaQuery("(max-aspect-ratio: 3/2)");

  if (!player) return null;

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

  const renderOperators = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        marginTop: 2,
      }}
    >
      <Button
        variant="outlined"
        sx={{
          borderRadius: "8px",
          height: "8vh",
          aspectRatio: "1",
          fontSize: "3vh",
          border: "3px solid black",
          color: "black",
          fontWeight: "bold",
        }}
      >
        ＋
      </Button>
      <Button
        variant="outlined"
        sx={{
          borderRadius: "8px",
          height: "8vh",
          aspectRatio: "1",
          fontSize: "3.5vh",
          border: "3px solid black",
          color: "black",
        }}
      >
        ×
      </Button>
      <Paper
        sx={{
          borderRadius: "8px",
          height: "8vh",
          aspectRatio: "3",
          fontSize: "3vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid",
          borderColor: "black",
          padding: "0 16px",
        }}
      >
        ターン
      </Paper>
    </Box>
  );

  const buttonStyle = (color: string) => ({
    borderRadius: "8px",
    width: "12vw",
    aspectRatio: "3 / 2",
    fontSize: "1.5vw",
    border: `3px solid ${color}`,
    color,
  });

  const renderControls = (
    <Box
      sx={{
        display: isVertical ? "flex" : "grid",
        flexDirection: isVertical ? "column" : undefined,
        gridTemplateColumns: isVertical ? undefined : "repeat(2, 1fr)",
        gap: 2,
        justifyItems: "center",
        alignItems: "center",
      }}
    >
      <Button
        variant="outlined"
        onClick={() => wsRef.current?.send(JSON.stringify({ type: "pass" }))}
        sx={buttonStyle("black")}
      >
        パス
      </Button>
      <Button variant="outlined" onClick={handleExit} sx={buttonStyle("red")}>
        退出
      </Button>
      <Button variant="outlined" sx={buttonStyle("black")}>
        演算
      </Button>
      <Button variant="outlined" sx={buttonStyle("red")}>
        キャンセル
      </Button>
    </Box>
  );
  return (
    <>
      <Header />
      <div>
        <Container sx={{ textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: 10,
              pb: 4,
            }}
          >
            {/* 左側：GameBoardとOperatorsをまとめて縦に中央揃え */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <GameBoard boardData={board} onCellClick={handleCellClick} />
              {renderOperators}
            </Box>

            {/* 右側：GameBoardの下端に合わせてrenderControlsを下詰め */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <Box sx={{ flexGrow: 1 }} /> {/* 上方向スペーサー */}
              {renderControls}
            </Box>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default GamePage;
