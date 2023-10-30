import { configureStore } from "@reduxjs/toolkit"

// import the reducers
import treeLinesReducer from "./components/MainMap/treeLineFeatures/treeLinesSlice"
import mapSliceReducer from "./components/MainMap/mapFeatures/mapSlice"


// create the application wide State store
export const store = configureStore({
    reducer: {
        treeLines: treeLinesReducer,
        map: mapSliceReducer
    }
})


// dedine the types for App State and Dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
