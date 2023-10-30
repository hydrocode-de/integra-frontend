import { useAppSelector } from "../../../hooks";

export const useCenter = () => useAppSelector(state => {
    return {
        lat: state.map.latitude, 
        lng: state.map.longitude
    }
})

export const useZoom = () => useAppSelector(state => state.map.zoom)

export const usePitch = () => useAppSelector(state => state.map.pitch)