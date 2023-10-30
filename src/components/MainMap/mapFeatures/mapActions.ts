import { PayloadAction } from "@reduxjs/toolkit";
import { MapState } from "./mapSlice";

export const updateViewportAction = ((state: MapState, action: PayloadAction<Partial<MapState>>) => {
    return {
        ...state,
        ...action.payload
    }
})
