import { useEffect, useRef, useState } from "react";
import RegisterForm from "../RegisterForm/RegisterForm";
import { useParams } from "react-router-dom";

const Game = () => {
  const { roomId } = useParams();
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userID) return;

    const ws = new WebSocket(`ws://localhost:8080/ws/game/${roomId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", playerID: userID }));
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      setMessages((prev) => [...prev, JSON.stringify(msg)]);
    };

    return () => ws.close();
  }, [userID, roomId]);

  const sendMove = (x: number, y: number) => {
    wsRef.current?.send(JSON.stringify({ type: "move", x, y, playerID: userID }));
  };

  if (!userID) {
    return <RegisterForm onRegister={(id, name) => {
      setUserID(id);
      setUserName(name);
    }} />;
  }

  return (
    <div>
      <h2>ゲームテスト（{userName}） Room: {roomId}</h2>
      <button onClick={() => sendMove(1, 2)}>座標 (1, 2) に打つ</button>
      <button onClick={() => sendMove(3, 4)}>座標 (3, 4) に打つ</button>

      <h3>受信メッセージ:</h3>
      <ul>
        {messages.map((msg, i) => <li key={i}>{msg}</li>)}
      </ul>
    </div>
  );
};

export default Game;
