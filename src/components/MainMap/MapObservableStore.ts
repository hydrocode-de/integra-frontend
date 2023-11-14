import { Subject } from 'rxjs'
import { FlyToOptions, LngLatBoundsLike } from 'mapbox-gl'

// flyTo action
export const flytoSubject$ = new Subject<FlyToOptions>()
export const flyTo  = (options: FlyToOptions) => flytoSubject$.next(options)

// fitBounds action
export const fitBoundsSubject$ = new Subject<LngLatBoundsLike>()
export const fitBounds = (options: LngLatBoundsLike) => fitBoundsSubject$.next(options)
