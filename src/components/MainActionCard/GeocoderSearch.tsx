import MapboxGeocoder, { Result } from '@mapbox/mapbox-gl-geocoder'
import { useEffect, useState } from 'react'

// import geocoder css
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { fitBounds, flyTo } from '../MainMap/MapObservableStore'

// we initialize a geocoder instance outside the React context
const token = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN!

const GeocoderSearch: React.FC = () => {
    // we need to initialize the geocoder
    const [geocoder, setGeocoder] = useState<MapboxGeocoder>()

    // effec to initialize the geocoder once
    useEffect(() => {
        if (!geocoder) {
            setGeocoder(new MapboxGeocoder({
                accessToken: token,
                types: 'region,locality,place,address,neighborhood',
                autocomplete: true,
                minLength: 4
            }))
        }
    }, [])

    // effect to render the geocoder if it is not yet there
    useEffect(() => {
        if (geocoder && !geocoder._inputEl) {
            geocoder.addTo('#geocoder')
            geocoder.on('result', e => {
                // make sure the Geocoding returned a result
                const result = e.result as Result || undefined
                if (!result) return

                // check the type of result
                if (result.bbox) {
                    fitBounds((e.result as Result).bbox)
                } else if (result.center) {
                    flyTo({center: {lng: result.center![0], lat: result.center![1]}, zoom: 18})
                }
            })
        }
    }, [geocoder])

    return <>
        <div id="geocoder" />
    </>
}

export default GeocoderSearch