// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./boardSlice";

const store = configureStore({
  reducer: {
    board: boardReducer,
  },
  // middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger) // опціонально redux-logger
});

export default store;
