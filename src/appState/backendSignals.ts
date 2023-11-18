/**
 * The backend signals are used to communicate with the backend and reflect the current state of the backend.
 * To ease things a bit, I put all the firebase stuff in here as well.
 */
import { computed, effect, signal } from "@preact/signals-react";
import { initializeApp } from "firebase/app"
import { getAuth, User, signInAnonymously  } from "firebase/auth"
import { parse } from "papaparse"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB45yI75yXL7OkUQ8rgjiOOBE6OezCM6-w",
    authDomain: "integra-223bf.firebaseapp.com",
    projectId: "integra-223bf",
    storageBucket: "integra-223bf.appspot.com",
    messagingSenderId: "79318548135",
    appId: "1:79318548135:web:948810b4105db914a12582"
};

// the app object can be imported from outside
export const app = initializeApp(firebaseConfig)

// create a auth object
//const auth = getAuth(app)

// create a signal to distribute the user across the app
//export const user = signal<User | null>(auth.currentUser)


// finally, as last option check if the user is null and run anonymous login then

// right now not as an effect, but only once
// we could put this into an effect to use anonymous user accounts whenever the user logs out
// I am not sure why exactly we would want to do that though.
// if (!user.peek()) {
//     signInAnonymously(auth).then(userCredendial => user.value = userCredendial.user).catch(error => console.log(error))
// }


// BACKEND DATA

// all model data about a tree at a specific age
export interface TreeDataPoint {
    age: number,
    bhd: number,
    height: number,
    canopyHeight: number,
    canopyWidth: number,
    agb: number,
    carbon: number
}

// first some Baumarten
interface TreeSpecies {
    type: string,
    latin: string,
    short: string
}

interface TreeData extends TreeSpecies {
    data: TreeDataPoint[]
}

// export a signal of all treeSpecies
// for now, we do not export it, to control how data is injected here
const treeData = signal<TreeData[]>([])

// compute some derived signals
export const treeTypes = computed<string[]>(() => treeData.value.map(tree => tree.type))
export const treeSpecies = computed<TreeSpecies[]>(() => treeData.value.map(tree => {
    const { data, ...others } = tree
    return others
}))

/**
 * Load the data-point for a specific tree species at a specific age.
 * If the exact age is not a valid TreeDataPoint in the state, the age data point
 * that the tree has already passed is returned.
 * example: treeAge: 14 , dataPoints: [10, 25, 20] -> 10
 * 
 * @param type the type of the tree
 * @param age the age of the tree
 * @returns the data point
 */
export const loadClosestDataPoint = (type: string, age: number): Partial<TreeDataPoint> => {
    // search for the correct tree type
    const treeSpecies = treeData.peek().find(tree => tree.type === type)

    // check if the species exists
    if (!treeSpecies) return {}

    // find the closes data point
    let maxPossiblePoint = {}
    treeSpecies.data.forEach(dataPoint => {
        if (dataPoint.age <= age) {
            maxPossiblePoint = dataPoint
        }
    })

    return maxPossiblePoint
}



// DATA HANDLING
// this works with local data right now, but it is written in a way that we can 
// adapt to all possible data storage scenarios

const parseTreeData = (data: unknown[]): TreeData[] => {
    const parsedData: {[key: string]: TreeData} = {}
    // a little buffer to save species we already found
    const nameBuffer: string[] = []

    // check each row
    data.forEach((row: any) => {
        // check if we have seen the species before
        if (row.Baumart && !nameBuffer.includes(row.Baumart)) {
            nameBuffer.push(row.Baumart)
            parsedData[row.Baumart] = {
                type: row.Baumart,
                latin: row.LateinischerName,
                short: row['Kürzel'],
                data: []
            } as TreeData
        }

        // add the data point to the species
        if (row.Baumart) {
            parsedData[row.Baumart].data.push({
                age: row.Alter,
                bhd: row.BHD,
                height: row['Baumhöhe'],
                canopyHeight: row['Kronenansatzhöhe'],
                canopyWidth: row.Kronenbreite,
                agb: row.AGB,
                carbon: row.Kohlenstoffgehalt
            })
        }
    })

    // return the data a a list
    // TODO this is the place where we could support different internal data formats
    return Object.values(parsedData)
}
// load the model_data.csv file on application startup
// right now, the data is located in the public folder, but the parse function can load from anywhere
// if we happen to gain so much control over the modelling step, that we can decide on the result format, 
// we could directly export the data as parse injects it into the signals
parse('/model_data.csv', {
    download: true,
    // this does cause an error right now ?!
//    worker: true,                   // use a webworker, so that the app can continue loading
    header: true,                   // first line are header
    dynamicTyping: true,            // most data are numbers
    complete: (results) => {        // alternative: step: (row) => {} if stuff gets bigger one day
        // parse the data into the treeData signal
        const data = parseTreeData(results.data)
        console.log(data)

        // inject the data into the signal
        treeData.value = data
    }
})