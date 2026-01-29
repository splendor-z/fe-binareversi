import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Player {
  playerID: string;
  name: string;
}

const initialState = null as Player | null;

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayer: (_state, action: PayloadAction<Player>): Player | null => {
      console.log("ログイン済みプレイヤー", action.payload);
      return action.payload;
    },
    clearPlayer: () => {
      console.log("clearPlayer called");
      return null;
    },
  },
});

export const { setPlayer, clearPlayer } = playerSlice.actions;

export default playerSlice.reducer;
