import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GamePage from "./pages/GamePage/GamePage";
import RoomListPage from "./pages/RoomListPage/RoomListPage";
import StartPage from "./pages/StartPage/StartPage";
import PrivatePage from "./pages/PrivatePage/PrivatePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />

        {/* ログインしていない時にリダイレクト */}
        {/* <Route
          path="/rooms"
          element={<PrivatePage Component={RoomListPage} />}
        /> */}
        <Route path="/rooms" element={<RoomListPage />} />
        {/* <Route
          path="/game/:roomId"
          element={<PrivatePage Component={GamePage} />}
        /> */}
        <Route path="/game/:roomId" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
