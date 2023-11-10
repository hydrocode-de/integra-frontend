// import { createSelector } from "@reduxjs/toolkit";
import { useAppSelector } from "../../../hooks";
import { RootState } from "../../../store";

// const treeLineSelector = (state: RootState) => state.treeLines

export const useTreeLines = () => useAppSelector((state: RootState) => state.treeLines.treeLines)
export const useTreeLocations = () => useAppSelector((state: RootState) => state.treeLines.treeLocations)
export const useDrawBuffer = () => useAppSelector((state: RootState) => state.treeLines.drawBuffer)
export const useDrawState = () => useAppSelector((state: RootState) => state.treeLines.draw)

// export const useTreeLines = () => useAppSelector(createSelector(treeLineSelector, treeLines => treeLines.treeLines))
// export const useTreeLocations = () => useAppSelector(createSelector(treeLineSelector, treeLines => treeLines.treeLocations))
// export const useDrawBuffer = () => useAppSelector(createSelector(treeLineSelector, treeLines => treeLines.drawBuffer))
