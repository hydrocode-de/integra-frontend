import { useSubscription } from "observable-hooks";
import { useMap } from "react-map-gl";
import { fitBoundsSubject$, flytoSubject$ } from "./MapObservableStore";

const MapObserver: React.FC = () => {
    // get a reference to the map
    const map = useMap()

    /* subscribe to the differenct map observables */

    // flyTo events
    useSubscription(flytoSubject$, {
        next: opts => map.current?.flyTo(opts)
    })

    // fitBounds events
    useSubscription(fitBoundsSubject$, {
        next: opts => map.current?.fitBounds(opts)
    })

    // this component does not render anything
    return null
}

export default MapObserver;