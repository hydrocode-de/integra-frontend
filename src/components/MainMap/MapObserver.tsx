import { useSubscription } from "observable-hooks";
import { useMap } from "react-map-gl";
import { flytoSubject$ } from "./MapObservableStore";

const MapObserver: React.FC = () => {
    // get a reference to the map
    const map = useMap()

    // subscribe to the differenct map observables
    useSubscription(flytoSubject$, {
        next: opts => map.current?.flyTo(opts)
    })

    // this component does not render anything
    return null
}

export default MapObserver;