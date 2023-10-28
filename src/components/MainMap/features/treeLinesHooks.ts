import { useAppSelector } from "../../../hooks";
import { RootState } from "../../../store";

export const useTreeLines = () => useAppSelector((state: RootState) => state.treeLines.treeLines)
export const useTreeLocations = () => useAppSelector((state: RootState) => state.treeLines.treeLocations)