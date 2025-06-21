import React, { useEffect, useRef, useState } from "react";
import RoomListTable from "../../components/RoomListTable/RoomListTable";
import "./roomListPage.css";
import { v4 as uuidv4 } from "uuid";

type Room = {
  id: string;
  player1: string;
  player2?: string;
  isFull: boolean;
};

const RoomListPage: React.FC = () => {
  const tmpPlayerID = "637fdd05-a930-4ec2-aa14-963fffa9ddb2"; //あとで削除
  const [rooms, setRooms] = useState<Room[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log("🔗 WebSocket 接続を開始します");
    const ws = new WebSocket("ws://localhost:8080/ws/lobby");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket 接続が確立されました");
    };

    ws.onerror = (error) => {
      console.error("WebSocket エラー:", error);
    };

    ws.onclose = (event) => {
      console.warn("WebSocket 接続が閉じられました:", event.reason);
    };

    ws.onmessage = (e) => {
      console.log("WebSocket メッセージ受信:", e.data);
      try {
        const msg = JSON.parse(e.data);
        switch (msg.type) {
          case "room_list":
            console.log("ルーム一覧を更新:", msg.rooms);
            setRooms(msg.rooms);
            break;
          case "room_created":
            console.log("ルーム作成:", msg.room);
            setRooms((prev) => [...prev, msg.room]);
            break;
          case "room_updated":
            console.log("ルーム更新:", msg.room);
            setRooms((prev) =>
              prev.map((room) => (room.id === msg.room.id ? msg.room : room))
            );
            break;
          default:
            console.warn("未対応のメッセージタイプ:", msg.type);
        }
      } catch (err) {
        console.error("メッセージのパースに失敗:", e.data);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    console.log("現在のルーム一覧:", rooms);
  }, [rooms]);

  const createRoom = () => {
    wsRef.current?.send(
      JSON.stringify({ type: "create_room", playerID: tmpPlayerID })
    );
  };

  const joinRoom = (roomID: string, userID: string) => {
    wsRef.current?.send(
      JSON.stringify({ type: "join_room", roomID: roomID, playerID: userID })
    );
  };
  return (
    <div>
      <h1>ルーム一覧</h1>
      <button onClick={createRoom}>＋ ルーム作成</button>
      <RoomListTable
        rooms={rooms}
        onJoinRoom={joinRoom}
        currentPlayerID={tmpPlayerID}
      />
    </div>
  );
};

export default RoomListPage;
