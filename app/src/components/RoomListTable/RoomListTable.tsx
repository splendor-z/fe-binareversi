import React from "react";
import "./roomListTable.css";
import { useNavigate } from "react-router-dom"; // ← ここを変更

export type gameTableInfo = {
  id: string;
  created_at: string;
  playerA: string | null;
  playerB: string;
};

type Props = {
  games: gameTableInfo[];
};

const RoomListTable: React.FC<Props> = ({ games }) => {
  const navigate = useNavigate(); 

  // 指定したidのゲーム画面に遷移する
  //ここでソケット通信を行い,roomListPageの内容を更新する
  const handleEnterGame = (id: string) => {
    console.log(id);
    navigate(`/game/${id}`);
  };

  return (
    <div className="game-table-container">
      <table className="game-table">
        <thead className="game-table-thead">
          <tr className="game-table-tr">
            <th className="game-table-th-start">作成時間</th>
            <th className="game-table-th-playerA">プレイヤーA</th>
            <th className="game-table-th-playerB">プレイヤーB</th>
          </tr>
        </thead>
      </table>

      <div className="game-table-body-wrapper">
        <table className="game-table">
          <tbody>
            {games.map((datum) => (
              <tr key={datum.id} className="game-table-tr">
                <td className="game-table-td game-table-td-start">
                  {datum.created_at}
                </td>
                <td className="game-table-td game-table-td-playerA">
                  {datum.playerA === null ? (
                    <button onClick={() => handleEnterGame(datum.id)}>参加</button>
                  ) : (
                    datum.playerA
                  )}
                </td>
                <td className="game-table-td game-table-td-playerB">
                  {datum.playerB}
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