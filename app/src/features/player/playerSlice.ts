import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Player {
  playerID: string;
  name: string;
}

const initialState: Player | null = null;

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayer: (_, action: PayloadAction<Player>) => {
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
