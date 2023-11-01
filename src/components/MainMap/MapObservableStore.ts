import { Subject } from 'rxjs'
import { FlyToOptions } from 'mapbox-gl'

export const flytoSubject$ = new Subject<FlyToOptions>()
export const flyTo  = (options: FlyToOptions) => flytoSubject$.next(options)
