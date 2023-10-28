"use client"; //this is a client side component

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showAddWallet: false,
  connected: false,
  wallet: null,
  wcpDetails: null, // for if you are a waste collection point
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleShowAddWallet: (state, action) => {
      return { ...state, showAddWallet: action.payload };
    },
    toggleConnected: (state) => {
      return { ...state, connected: !state.connected };
    },
    updateConnected: (state, action) => {
      return { ...state, connected: action.payload };
    },
    addWallet: (state, action) => {
      return { ...state, wallet: action.payload };
    },
    updateWCPdetails: (state, action) => {
      return { ...state, wcpDetails: action.payload };
    },
  },
});

export const {
  toggleShowAddWallet,
  updateConnected,
  addWallet,
  toggleConnected,
  updateWCPdetails,
} = appSlice.actions;
export default appSlice.reducer;
