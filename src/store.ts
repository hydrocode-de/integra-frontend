import { configureStore } from "@reduxjs/toolkit"
import treeLinesReducer from "./components/MainMap/features/treeLinesSlice"


// create the application wide State store
export const store = configureStore({
    reducer: {
        treeLines: treeLinesReducer
    }
})


// dedine the types for App State and Dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
