// These signals will be used to activate or deactivate certain views in the app.

import { computed, signal } from "@preact/signals-react";

export type AppView = 'none' | 'biomass' | 'shade' | 'blossoms' | 'insects'
// as soon as we can change the 'tabs', go for none initially
export const appView = signal<AppView>('shade')

// add a model to save the current tree palette
export const treePalette = signal<string[]>([
//    'Acer pseudoplatanus',
    'Prunus avium',
])

// try to add and remove from the tree palette with functions
export const addTreeToPalette = (treeType: string) => {
    treePalette.value = [
        ...treePalette.value.filter(t => treeType !== t),
        treeType
    ]
    console.log(treePalette.value)
}

export const removeTreeFromPalette = (treeType: string) => {
    treePalette.value = [...treePalette.value.filter(t => treeType !== t)]
    console.log(treePalette.value)
}

// tab settings
export type ActivePage = 'map' | 'summary' | 'glossary'
export const activePage = signal<ActivePage>('map')

// action card settings
export type ActiveActionCard = 'none' | 'map-tools' | 'tree-edit' | 'detail'
const activeActionCard = signal<ActiveActionCard>('tree-edit')
export const activeCard = computed<ActiveActionCard>(() => activeActionCard.value)

// put the handler into an extra card so that we can manage the behavior of the accordion at one place
export const handleCardToggle = (card: ActiveActionCard) => {
    // toogle the card
    activeActionCard.value = activeActionCard.value === card ? 'none' : card
}
