// RoomListPage.tsx
import React, { useState } from "react";
import RoomListTable, {
  type gameTableInfo,
} from "../../components/RoomListTable/RoomListTable";
import "./roomListPage.css";

const RoomListPage: React.FC = () => {
  const [games, setGames] = useState<gameTableInfo[]>([]);

  const addNewGame = (creator: string) => {
    const newGame: gameTableInfo = {
      id: crypto.randomUUID(),
      created_at: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      playerA: null,
      playerB: creator,
    };
    setGames((prev) => [...prev, newGame]);
  };

  const deleteGame = (id: string) => {
    setGames((prev) => prev.filter((game) => game.id !== id));
  };

  return (
    <div>
      <button onClick={() => addNewGame("新しいプレイヤーB")}>追加</button>
      <RoomListTable games={games} />
    </div>
  );
};

export default RoomListPage;
