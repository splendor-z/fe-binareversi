import type { Player } from "../../features/player/playerSlice";
import { useAppSelector } from "../../hooks/useAppSelector";
import "./playerInfo.css";

const PlayerInfo: React.FC = () => {
  const player = useAppSelector(
    (state: { player: Player | null }) => state.player
  );

  //ログインしていない時は何も表示しない
  if (!player) return <></>;

  return (
    <div className="player-info">
      <div className="info-row">
        <span className="info-key">ID:</span>
        <span className="info-value truncate">
          {player?.playerID
            ? `${player.playerID.slice(0, 4)}..${player.playerID.slice(-4)}`
            : ""}
        </span>
      </div>
      <div className="info-row">
        <span className="info-key">プレイヤー名:</span>
        <span className="info-value truncate">{player?.name ?? ""}</span>
      </div>
    </div>
  );
};

export default PlayerInfo;
