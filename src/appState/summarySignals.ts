/**
 * Main signal for saving the state of the summary page
 */

import { computed, signal } from "@preact/signals-react";
import { activePage } from "./appViewSignals";
import { referenceAreaHectar } from "./referenceAreaSignals";
import { agriculturalArea } from "./treeLineSignals";
import { area } from "@turf/turf";
import { treeLocationFeatures } from "./geoJsonSignals";

interface StaticSummaryData {
    agriculturalUse?: string,
    forestryUse?: string,
    precipitationSum?: string,
    averageTemperature?: string,
    soilType?: string,
    soilNutrient?: string
}

const staticData = signal<StaticSummaryData>({})

interface SummaryData extends StaticSummaryData {
    referenceArea: number,
    agriculturalArea: number,
    agb: number,
    carbon: number,
}

export const changeStaticData = (label: keyof SummaryData, value: string) => {
    staticData.value = {
        ...staticData.peek(),
        [label]: value
    }
}


export const summaryData = computed<SummaryData | undefined>(() => {
    // if the main tab is not on the summary, return undefined
    if (activePage.value !== 'summary') return undefined

    // calculate above ground biomass
    const agb = treeLocationFeatures.value
        .filter(t => t.properties.age! > 0 && (!t.properties.harvestAge || t.properties.age! < t.properties.harvestAge))
        .reduce((prev, curr) => prev + (curr.properties.agb || 0), 0)

    // calculate carbon
    const carbon = treeLocationFeatures.value
        .filter(t => t.properties.age! > 0 && (!t.properties.harvestAge || t.properties.age! < t.properties.harvestAge))
        .reduce((prev, curr) => prev + (curr.properties.carbon || 0), 0)

    // in any other case, return the summary data
    return {
        referenceArea: referenceAreaHectar.peek(),
        agriculturalArea: area(agriculturalArea.value) / 10000,
        agb,
        carbon,
        ...staticData.value
    }
})

