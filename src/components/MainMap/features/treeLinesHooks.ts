import { useAppSelector } from "../../../hooks";
import { RootState } from "../../../store";

const useTreeLines = () => useAppSelector((state: RootState) => state.treeLines.treeLines)
const useTreeLocations = () => useAppSelector((state: RootState) => state.treeLines.treeLocations)