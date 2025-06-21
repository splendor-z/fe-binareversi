import PlayerInfo from "../PlayerInfo/PlayerInfo";
import "./header.css";

const Header: React.FC = () => {
  return (
    <div className="header-main-div">
      <div className="flex-div">
        <div className="icon-div">
          <img src="/8.png" alt="logo" />
        </div>
        <p>BinaReversi</p>
      </div>
      <div className="user-info-container">
        <PlayerInfo />
      </div>
    </div>
  );
};

export default Header;
