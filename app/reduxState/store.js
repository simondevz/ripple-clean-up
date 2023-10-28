"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import appReducer from "./slice";

const rootReducer = combineReducers({
  app: appReducer,
  //add all your reducers here
});

export const store = configureStore({
  reducer: rootReducer,
});
