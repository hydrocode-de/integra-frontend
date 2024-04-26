import { batch, signal } from "@preact/signals-react";

// These signals are used in the SideContent to populate the side cards with content
export const activeTreeDetailId = signal<string | undefined>(undefined)
export const activeTreeLineId = signal<string | undefined>(undefined)

export const setDetailId = (opts: {treeId?: string, lineId?: string}) => {
    batch(() => {
        activeTreeDetailId.value = opts.treeId
        activeTreeLineId.value = opts.lineId
    })
}