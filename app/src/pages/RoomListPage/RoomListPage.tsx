import React, { useEffect, useRef, useState } from "react";
import RoomListTable from "../../components/RoomListTable/RoomListTable";
import "./roomListPage.css";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Header from "../../components/Header/Header";

type Room = {
  id: string;
  player1: string;
  player2?: string;
  isFull: boolean;
  createdAt: string; // ← この行を追加
};
type Player = {
  playerID: string;
  // 他のプロパティがあればここに追加
};

const RoomListPage: React.FC = () => {
  const player = useAppSelector(
    (state: { player: Player | null }) => state.player
  );
  const [rooms, setRooms] = useState<Room[]>([]);

  const [tmpRooms, setTmpRooms] = useState<{
    vacant: Room[];
    full: Room[];
  }>({
    vacant: [],
    full: [],
  });
  const wsRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!player) {
      navigate("/");
      return;
    }

    const ws = new WebSocket("ws://localhost:8080/ws/lobby");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket 接続開始");
      wsRef.current?.send(
        JSON.stringify({ type: "room_init", playerID: player.playerID })
      );
    };

    ws.onerror = (error) => {
      console.error("WebSocket エラー:", error);
    };

    ws.onclose = (event) => {
      console.warn("WebSocket 接続クローズ", event.reason);
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        switch (msg.type) {
          case "room_list":
            console.log("room list", msg.rooms);
            setRooms(msg.rooms);
            break;
          case "room_created":
            setRooms((prev) => [...prev, msg.room]);
            console.log(msg.room);

            if (msg.room.player1 === player.name) {
              // 暫定処理のためにnameにしているがそのうちidにすること
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

  useEffect(() => {
    const sortedVacant = [...rooms]
      .filter((room) => !room.isFull)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    const sortedFull = [...rooms]
      .filter((room) => room.isFull)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    setTmpRooms({
      vacant: sortedVacant,
      full: sortedFull,
    });
  }, [rooms]);

  useEffect(() => {
    console.log("🔴 full 配列が更新されました:", tmpRooms.full);
  }, [tmpRooms.full]);

  useEffect(() => {
    console.log("🟢 vacant 配列が更新されました:", tmpRooms.vacant);
  }, [tmpRooms.vacant]);

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

  if (!player) return null; // 👈 ここで null ガードを追加

  return (
    <>
      <Header />
      <div>
        <div className="create-button-div">
          <Button variant="contained" color="primary" onClick={createRoom}>
            ルーム作成
          </Button>
        </div>

        <RoomListTable
          rooms={[...tmpRooms.vacant, ...tmpRooms.full]} // ← ここを変更！
          onJoinRoom={joinRoom}
          currentPlayerID={player.playerID}
        />
      </div>
    </>
  );
};

export default RoomListPage;
