import { Button } from "@mui/material";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const GamePage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  // 型定義を明示することでplayerIDプロパティの存在を保証
  interface Player {
    playerID: string;
  }
  const player = useAppSelector(
    (state: { player: Player | null }) => state.player
  );
  const navigate = useNavigate();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // player or roomId が無ければホームにリダイレクト
    if (!player || !roomId) {
      navigate("/");
      return;
    }

    const ws = new WebSocket(
      `ws://localhost:8080/ws/game/${roomId}/${player.playerID}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      wsRef.current?.send(JSON.stringify({ type: "join" }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);

      switch (data.type) {
        case "game_start":
        case "board_update":
          break;
        case "valid_moves":
          // 必要に応じて処理
          break;
        case "game_over":
          alert(`Game Over! Winner: ${data.winner}`);
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
  }, [roomId, player]);

  const handleExit = () => {
    wsRef.current?.send(JSON.stringify({ type: "exit_room" }));
  };

  return (
    <>
      <div className="exit-button-div">
        <Button variant="contained" color="error" onClick={handleExit}>
          退出
        </Button>
      </div>
    </>
  );
};

export default GamePage;
