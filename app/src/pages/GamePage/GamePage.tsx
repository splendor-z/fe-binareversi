import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  useMediaQuery,
  Radio,
  FormControlLabel,
} from "@mui/material";
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
          setBoard(data.board);
          setCurrentTurn(data.currentTurn);
          break;
        case "board_update":
          setBoard(data.board);
          setCurrentTurn(data.currentTurn);
          break;
        case "valid_moves":
          break;
        case "game_over":
          setWinner(data.winner);
          setGameOverModalOpen(true);
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

  const [isOperating, setIsOperating] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<"+" | "*">("+");
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const handleOperatorClick = (op: "+" | "*") => {
    setSelectedOperator(op);
  };

  const handleCancel = () => {
    setIsOperating(false);
  };

  const handleOperating = () => {
    if (selectedRow === null) {
      alert("演算対象の行を選択してください。");
      return;
    }

    wsRef.current?.send(
      JSON.stringify({
        type: "operation",
        operator: selectedOperator,
        row: selectedRow,
        value: currentTurn,
      })
    );
    setIsOperating(false);
  };

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
        onClick={() => handleOperatorClick("+")}
        hidden={!isOperating}
        sx={{
          display: isOperating ? "display" : "none",
          borderRadius: "8px",
          height: "8vh",
          aspectRatio: "1",
          fontSize: "3vh",
          border: "3px solid black",
          fontWeight: "bold",
          bgcolor: selectedOperator === "+" ? "black" : "white",
          color: selectedOperator === "+" ? "white" : "black",
        }}
      >
        ＋
      </Button>
      <Button
        variant="outlined"
        onClick={() => handleOperatorClick("*")}
        hidden={!isOperating}
        sx={{
          display: isOperating ? "display" : "none",
          borderRadius: "8px",
          height: "8vh",
          aspectRatio: "1",
          fontSize: "3.5vh",
          border: "3px solid black",
          fontWeight: "bold",
          bgcolor: selectedOperator === "*" ? "black" : "white",
          color: selectedOperator === "*" ? "white" : "black",
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
        {currentTurn}ターン
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
        disabled={isOperating}
        onClick={() => wsRef.current?.send(JSON.stringify({ type: "pass" }))}
        sx={buttonStyle("black")}
      >
        パス
      </Button>
      <Button
        variant="outlined"
        disabled={isOperating}
        onClick={handleExit}
        sx={buttonStyle("red")}
      >
        退出
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
          if (isOperating) {
            handleOperating();
          } else {
            setIsOperating(true);
          }
        }}
        sx={buttonStyle(isOperating ? "green" : "black")}
      >
        {isOperating ? "実行" : "演算"}
      </Button>
      <Box sx={{ display: isOperating ? "block" : "none" }}>
        <Button
          variant="outlined"
          sx={buttonStyle("red")}
          onClick={handleCancel}
        >
          キャンセル
        </Button>
      </Box>
    </Box>
  );

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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/* ラジオボタン：左側に配置 */}
                {isOperating && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: 480,
                      justifyContent: "space-between",
                      marginRight: 2,
                    }}
                  >
                    {Array.from({ length: 8 }, (_, i) => (
                      <Box
                        key={i}
                        sx={{
                          height: 60,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center", // ← "flex-start" → "center" に変更
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FormControlLabel
                            value={i}
                            control={
                              <Radio
                                checked={selectedRow === i}
                                onChange={() => setSelectedRow(i)}
                                sx={{
                                  color: "black",
                                  padding: 0,
                                  marginRight: 1.5,
                                  "&.Mui-checked": {
                                    color: "red",
                                  },
                                }}
                              />
                            }
                            label={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-start",
                                  minWidth: 28, // ← ある程度の幅を確保
                                  fontSize: "2rem", // ← 太く、大きく
                                  fontWeight: "bold", // ← 太字に
                                  marginLeft: 0.5, // ← ラジオボタンとの間隔
                                }}
                              >
                                {selectedRow === i ? "→" : ""}
                              </Box>
                            }
                            sx={{
                              marginLeft: 0.5,
                              marginRight: 0.5,
                              width: "100%",
                              justifyContent: "space-between",
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* ゲームボード */}
                <GameBoard boardData={board} onCellClick={handleCellClick} />
              </Box>
              {renderOperators}
              {isOperating && (
                <Box sx={{ mt: 2, textAlign: "left" }}>
                  <Typography variant="body2">
                    演算対象の行と演算子を選択し、
                  </Typography>
                  <Typography variant="body2">
                    実行を押下することで二進数演算を行えます。
                  </Typography>
                  <Typography variant="body2">
                    黒のコマを1、白のコマを0、と見たて、
                  </Typography>
                  <Typography variant="body2">
                    行から変換されるバイナリを経過ターン数と選択した演算子で処理します。
                  </Typography>
                </Box>
              )}
            </Box>

            {/* 右側：GameBoardの下端に合わせてrenderControlsを下詰め */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end", // ← flexGrowとセットで明示
                height: 480,
              }}
            >
              {renderControls}
            </Box>
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
