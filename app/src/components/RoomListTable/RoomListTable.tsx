import React from "react";
import "./roomListTable.css";
import { useNavigate } from "react-router-dom";

type Room = {
  id: string;
  player1: string;
  player2?: string;
  isFull: boolean;
};

type RoomListTableProps = {
  rooms: Room[];
  currentPlayerID: string;
  onJoinRoom: (roomID: string, joinUserID: string) => void;
};

const RoomListTable: React.FC<RoomListTableProps> = ({
  rooms,
  currentPlayerID,
  onJoinRoom,
}) => {
  const navigate = useNavigate();

  const handleEnterGame = (id: string, playerID: string) => {
    console.log(`Joining room: ${id}`);
    onJoinRoom(id, playerID);
    navigate(`/game/${id}`);
  };

  return (
    <div className="game-table-container">
      <div className="game-table-wrapper">
        <table className="game-table">
          <thead className="game-table-thead">
            <tr className="game-table-tr">
              <th className="game-table-th-start"></th>
              <th className="game-table-th-isfull">状態</th>
              <th className="game-table-th-playerA">プレイヤーA</th>
              <th className="game-table-th-playerB">プレイヤーB</th>
            </tr>
          </thead>
          <tbody className="game-table-tbody">
            {rooms.map((room, index) => (
                <tr
                key={room.id}
                className={`game-table-tr ${room.isFull ? " game-table-tr-full" : ""}`}
                >
                <td className="game-table-td game-table-td-start">
                  {index + 1}
                </td>
                <td className="game-table-td game-table-td-isfull">
                  {room.isFull ? "満席" : "空席"}
                </td>
                <td className="game-table-td game-table-td-playerA">
                  {room.player1}
                </td>
                <td className="game-table-td game-table-td-playerB">
                  {room.player2 ? (
                  room.player2
                  ) : (
                  <button
                    onClick={() => handleEnterGame(room.id, currentPlayerID)}
                  >
                    参加
                  </button>
                  )}
                </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomListTable;
