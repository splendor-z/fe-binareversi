import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppSelector";
import { setPlayer } from "../../features/player/playerSlice";
import type { Player } from "../../features/player/playerSlice";
import Header from "../../components/Header/Header";
import "./startPage.css";

const StartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const register = async (username: string) => {
    if (!username) return false;
    try {
      const res = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username }),
      });

      if (!res.ok) {
        throw new Error("登録失敗");
      }

      const data = await res.json();
      console.log(data);
      const loginedPlayer: Player = {
        playerID: data.userID,
        name: data.name,
      };
      dispatch(setPlayer(loginedPlayer));
      return true;
    } catch (e) {
      alert("登録に失敗しました" + e);
      return false;
    }
  };

  const handleStart = async () => {
    console.log("ユーザー名:", username);
    const success = await register(username);
    if (success) {
      // 登録成功時のみ画面遷移
      navigate(`/rooms`);
    }
  };

  return (
    <>
      <Header />
      <div className="start-container-div">
        <Container
          sx={{ height: "80vh", display: "flex", alignItems: "center" }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            gap={2}
          >
            <Typography variant="h5">ユーザー名を入力してください</Typography>
            <TextField
              label="ユーザー名"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleStart}
              disabled={!username.trim()}
            >
              スタート
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default StartPage;
