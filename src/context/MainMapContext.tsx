import { Map } from "mapbox-gl";
import { createContext } from "react";

// initialize the two contexts
const MainMapContext = createContext<Map>(null!);
const MainMapDispatchContext = createContext(() => {});

// create a enum for possible dispatch actions
enum MainMapActionTypes {
    FLYTO = 'flyto',
    SET_CENTER = 'setcenter'

}

type MainMapAction = {
    type: MainMapActionTypes,
    payload?: any
}

// create a reducer to change the map dynamically
const mapReducer = ((map: Map, action: MainMapAction) => {
    switch (action.type) {
        case MainMapActionTypes.FLYTO: {
            return map.flyTo(action.payload)
        }
    }
})

// create a MainMapProvider Component
const MainMapProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    // use the reducer to change the map

    return <>
        { children }
    </>
}

export default MainMapProvider