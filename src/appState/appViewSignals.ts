// These signals will be used to activate or deactivate certain views in the app.

import { signal } from "@preact/signals-react";

export type AppView = 'none' | 'biomass' | 'shade' | 'blossoms' | 'insects'
// as soon as we can change the 'tabs', go for none initially
export const appView = signal<AppView>('shade')

// add a model to save the current tree palette
export const treePalette = signal<string[]>([
    'Acer pseudoplatanus',
    'Prunus avium',
])

export type ActivePage = 'map' | 'summary'

export const activePage = signal<ActivePage>('map')

