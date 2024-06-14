/**
 * Main signal for saving the state of the summary page
 */

import { computed, signal } from "@preact/signals-react";
import { activePage } from "./appViewSignals";
import { referenceAreaHectar } from "./referenceAreaSignals";
import { agriculturalArea } from "./treeLineSignals";
import { area } from "@turf/turf";

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

    // in any other case, return the summary data
    return {
        referenceArea: referenceAreaHectar.peek(),
        agriculturalArea: area(agriculturalArea.value) / 10000,
        ...staticData.value
    }
})

