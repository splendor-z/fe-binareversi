import React, { useEffect, useRef, useState } from "react";
import RoomListTable from "../../components/RoomListTable/RoomListTable";
import "./roomListPage.css";
import { useAppSelector } from "../../hooks/useAppSelector";
// import type { Player } from "../../features/player/playerSlice";
import { useNavigate } from "react-router-dom";

type Room = {
  id: string;
  player1: string;
  player2?: string;
  isFull: boolean;
};

const RoomListPage: React.FC = () => {
  const player = useAppSelector((state) => state.player); // ✅ ここでフックを呼ぶ（トップレベル）
  const [rooms, setRooms] = useState<Room[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    //ログイン情報がない時にトップページに遷移
    if (!player) {
      navigate("/");
    }

    const ws = new WebSocket("ws://localhost:8080/ws/lobby");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket 接続開始");
    };

    ws.onerror = (error) => {
      console.error("WebSocket エラー:", error);
    };

    ws.onclose = (event) => {
      console.warn("WebSocket 接続クローズ", event.reason);
    };

    ws.onmessage = (e) => {
      console.log("WebSocket メッセージ受信:", e.data);
      try {
        const msg = JSON.parse(e.data);
        switch (msg.type) {
          case "room_list":
            setRooms(msg.rooms);
            break;
          case "room_created":
            setRooms((prev) => [...prev, msg.room]);
            console.log(msg.room)

            if (msg.room.player1 === player.name) { // 暫定処理のためにnameにしているがそのうちidにすること
              navigate(`/game/${msg.room.id}`);
            }
            break;
          case "room_updated":
            setRooms((prev) =>
              prev.map((room) => (room.id === msg.room.id ? msg.room : room))
            );
            break;
          default:
            console.warn("未対応のメッセージ:", msg.type);
        }
      } catch (err) {
        console.error("メッセージのパースに失敗:", e.data);
      }
    };

    return () => {
      ws.close();
    };
  }, [player]);

  const createRoom = () => {
    if (!player) return;
    wsRef.current?.send(
      JSON.stringify({ type: "create_room", playerID: player.playerID })
    );
  };

  const joinRoom = (roomID: string) => {
    if (!player) return;
    wsRef.current?.send(
      JSON.stringify({
        type: "join_room",
        roomID: roomID,
        playerID: player.playerID,
      })
    );
  };

  return (
    <div>
      <h1>ルーム一覧</h1>
      <p>ようこそ、{player.name} さん</p>
      <button onClick={createRoom}>＋ ルーム作成</button>
      <RoomListTable
        rooms={rooms}
        onJoinRoom={joinRoom}
        currentPlayerID={player.playerID}
      />
    </div>
  );
};

export default RoomListPage;
