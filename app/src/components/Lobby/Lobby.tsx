import { useEffect, useRef, useState } from "react";
import RegisterForm from "../RegisterForm/RegisterForm";

type Room = {
  id: string;
  player1: string;
  player2?: string;
  isFull: boolean;
};

const Lobby = () => {
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws/lobby");
    wsRef.current = ws;

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "room_list") {
        setRooms(msg.rooms); // ← ここが追加点
      } else if (msg.type === "room_created") {
        setRooms((prev) => [...prev, msg.room]);
      } else if (msg.type === "room_updated") {
        setRooms((prev) =>
          prev.map((r) => (r.id === msg.room.id ? msg.room : r))
        );
      }
    };

    return () => ws.close();
  }, []);

  const createRoom = () => {
    const roomID = `room-${Date.now()}`;
    wsRef.current?.send(
      JSON.stringify({ type: "create_room", roomID, player: userName })
    );
  };

  const joinRoom = (roomID: string) => {
    wsRef.current?.send(
      JSON.stringify({ type: "join_room", roomID, player: userName })
    );
  };

  if (!userID) {
    return (
      <RegisterForm
        onRegister={(id, name) => {
          setUserID(id);
          setUserName(name);
        }}
      />
    );
  }

  return (
    <div>
      <h2>ロビーテスト（{userName}）</h2>
      <button onClick={createRoom}>ルーム作成</button>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.id} - {room.player1} vs {room.player2 || "募集中"}
            {!room.isFull && (
              <button onClick={() => joinRoom(room.id)}>参加</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lobby;
