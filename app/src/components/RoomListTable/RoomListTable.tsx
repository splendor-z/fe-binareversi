import React from "react";
import "./roomListTable.css";
import { useNavigate } from "react-router-dom";

type Room = {
  id: string;
  player1: string;
  player2?: string;
  isFull: boolean;
};

type roomListTableProps = {
  rooms: Room[];
  onJoinRoom: (roomID: string, joinUserName: string) => void;
};

const RoomListTable: React.FC<roomListTableProps> = ({ rooms, onJoinRoom }) => {
  const navigate = useNavigate();

  const handleEnterGame = (id: string) => {
    const tmpJoinUser = "testJoinUser";
    console.log(`Joining room: ${id}`);
    onJoinRoom(id, tmpJoinUser);
    navigate(`/game/${id}`);
  };

  return (
    <div className="game-table-container">
      <table className="game-table">
        <thead className="game-table-thead">
          <tr className="game-table-tr">
            <th className="game-table-th-start">ルームID</th>
            <th className="game-table-th-playerA">プレイヤーA</th>
            <th className="game-table-th-playerB">プレイヤーB</th>
          </tr>
        </thead>
      </table>

      <div className="game-table-body-wrapper">
        <table className="game-table">
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="game-table-tr">
                <td className="game-table-td game-table-td-start">{room.id}</td>
                <td className="game-table-td game-table-td-playerA">
                  {room.player1}
                </td>
                <td className="game-table-td game-table-td-playerB">
                  {room.player2 ? (
                    room.player2
                  ) : (
                    <button onClick={() => handleEnterGame(room.id)}>
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
