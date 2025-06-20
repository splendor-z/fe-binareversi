import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GamePage from "./pages/GamePage/GamePage";
import RoomListPage from "./pages/RoomListPage/RoomListPage";
import StartPage from "./pages/StartPage/StartPage";
import Lobby from "./components/Lobby/Lobby";
import Game from "./components/Game/Game";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/rooms" element={<RoomListPage />} />
        <Route path="/game/:roomId" element={<GamePage />} />
        <Route path="/lobbytest" element={<Lobby />}></Route>
        <Route path="/gametest/:roomId" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
