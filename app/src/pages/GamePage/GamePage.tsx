import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Typography, Container, Paper } from "@mui/material";
import { useAppSelector } from "../../hooks/useAppSelector";
import GameBoard from "../../components/GameBoard/GameBoard";
import Header from "../../components/Header/Header";
import Dialog from "../../components/Dialog/Dialog";

const GamePage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const player = useAppSelector(
    (state: { player: { playerID: string } | null }) => state.player
  );
  const navigate = useNavigate();
  const wsRef = useRef<WebSocket | null>(null);

  const emptyBoard = Array.from({ length: 8 }, () => Array(8).fill(7));
  const [board, setBoard] = useState<number[][]>(emptyBoard);
  const [currentTurn, setCurrentTurn] = useState<number>(1);

  const [isGameOverModalOpen, setGameOverModalOpen] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

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
          setCurrentTurn(data.currentTurn);
        case "board_update":
          setBoard(data.board);
          setCurrentTurn(data.currentTurn);
          break;
        case "valid_moves":
          break;
        case "game_over":
          setWinner(data.winner);
          setGameOverModalOpen(true);
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

  const renderGameOverContent = () => {
    if (!player) return null;

    if (!winner) {
      return (
        <Typography variant="h2" align="center" color="textSecondary">
          ～ Draw ～
        </Typography>
      );
    }

    if (winner === player.playerID) {
      return (
        <Box sx={{ color: "gold", fontWeight: "bold" }}>
          <Typography variant="h2" align="center">
            You Win!
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box sx={{ color: "red", fontWeight: "bold" }}>
          <Typography variant="h2" align="center">
            You lose …
          </Typography>
        </Box>
      );
    }
  };

  return (
    <>
      <Header />
      <div>
        <Container sx={{ textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 4,
            }}
          >
            <GameBoard boardData={board} onCellClick={handleCellClick} />
            <Box sx={{ marginTop: 10 }}>
              <Box sx={{ display: "flex" }}>
                <Button
                  variant="outlined"
                  onClick={handleExit}
                  sx={{
                    marginBottom: 2,
                    marginRight: 5,
                    borderRadius: "8px",
                    width: "150px",
                    height: "100px",
                    fontSize: "3rem",
                    border: "3px solid black",
                    color: "black",
                  }}
                >
                  パス
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleExit}
                  sx={{
                    marginBottom: 2,
                    marginRight: 5,
                    borderRadius: "8px",
                    width: "150px",
                    height: "100px",
                    fontSize: "3rem",
                    border: "3px solid red",
                    color: "red",
                  }}
                >
                  退出
                </Button>
              </Box>
              <Box sx={{ dispaly: "flex" }}>
                <Button
                  variant="outlined"
                  sx={{
                    marginTop: 5,
                    marginBottom: 2,
                    marginRight: 5,
                    borderRadius: "8px",
                    width: "150px",
                    height: "100px",
                    fontSize: "3rem",
                    border: "3px solid black",
                    color: "black",
                  }}
                >
                  演算
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    marginTop: 5,
                    marginBottom: 2,
                    marginRight: 5,
                    borderRadius: "8px",
                    width: "160px",
                    height: "100px",
                    fontSize: "23px",
                    border: "3px solid red",
                    color: "red",
                  }}
                >
                  キャンセル
                </Button>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 4,
              marginLeft: 33,
            }}
          >
            <Button
              variant="outlined"
              sx={{
                marginTop: 2.3,
                borderRadius: "8px",
                width: "80px",
                height: "70px",
                fontSize: "45px",
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
                marginTop: 2.3,
                borderRadius: "8px",
                width: "80px",
                height: "70px",
                fontSize: "60px",
                border: "3px solid black",
                color: "black",
              }}
            >
              ×
            </Button>
            <Paper
              sx={{
                marginTop: 2,
                borderRadius: "8px",
                width: "200px",
                height: "70px",
                fontSize: "23px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid",
                borderColor: "black",
              }}
            >
              {`${currentTurn}`}ターン
            </Paper>
          </Box>
        
          <Dialog
            isOpen={isGameOverModalOpen}
            title={renderGameOverContent()}
            onClose={() => setGameOverModalOpen(false)}
          />
        </Container>
      </div>
    </>
  );
};

export default GamePage;
