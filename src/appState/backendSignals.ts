/**
 * The backend signals are used to communicate with the backend and reflect the current state of the backend.
 * To ease things a bit, I put all the firebase stuff in here as well.
 */
import { batch, computed, effect, signal } from "@preact/signals-react";
import { createClient } from "@supabase/supabase-js";

// connect to supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);


// BACKEND DATA

// all model data about a tree at a specific age
export interface TreeDataPoint {
  age: number;
  harvestAge?: number;
  bhd?: number;
  height: number;
  canopyHeight: number;
  canopyHeightPrune?: number;
  canopyWidth?: number;
  agb?: number;
  carbon?: number;
  nectar?: number;
  pollen?: number;
  blossoms?: number;
  blossomsPrune?: number;
  nectarPrune?: number;
  pollenPrune?: number;

  // DEV: the backend should be changed, until we do not need these anymore
  image?: string;
  filename?: string;
}

// first some Baumarten
// interface TreeSpecies {
//   type: string;
//   latin: string;
//   short: string;
// }

interface TreeSpecies {
  id: number,
  type: 'Baum' | 'Strauch',
  shape: string,
  latin_name: string,
  german_name?: string,
}

interface TreeData extends TreeSpecies {
  data: TreeDataPoint[];
}

// export a signal of all treeSpecies
// for now, we do not export it, to control how data is injected here
const treeData = signal<TreeData[]>([]);

// compute some derived signals
export const treeTypes = computed<string[]>(() =>
  treeData.value.map((tree) => tree.type)
);
export const treeSpecies = computed<TreeSpecies[]>(() =>
  treeData.value.map((tree) => {
    const { data, ...others } = tree;
    return others;
  })
);

interface IconImageStore {
  [iconId: string]: {
    icon: ImageBitmap;
    filename: string;
  };
}

interface IconImage {
  filename: string;
  icon: ImageBitmap;
}

// synchronously load the default image, so it will always be there
const DEFAULT_IMG = await fetch("/icons/default-tree.png")
  .then((r) => r.blob())
  .then((blob) => createImageBitmap(blob));

// create the tree icon store -this one is used to map the iconIdentifier to the filename and the pre-loaded image Blob
// we need both to identify files that are associated to multiple iconIdentifiers, which are the combination of
// the tree type and the age identified by the DataPoint(!)
export const treeIconStore = signal<IconImageStore>({
  default: { icon: DEFAULT_IMG, filename: "default-tree.png" },
});

export const iconImages = signal<IconImage[]>([
  { filename: "default-tree.png", icon: DEFAULT_IMG }
]);
export const treeIconsLoaded = signal<boolean>(false);

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
export const loadClosestDataPoint = (
  type: string,
  age: number
): Partial<TreeDataPoint> => {
  // search for the correct tree type
  const treeSpecies = treeData.peek().find((tree) => tree.latin_name === type);

  // check if the species exists
  if (!treeSpecies) return {};

  // find the closes data point
  let maxPossiblePoint = {};
  treeSpecies.data.forEach((dataPoint) => {
    if (dataPoint.age <= age) {
      maxPossiblePoint = dataPoint;
    }
  });

  return maxPossiblePoint;
};

// helper function to translate age to age class
export const ageToSize = (age: number): string => {
  if (age <= 5) return "Size1";
  if (age <= 20) return "Size2";
  if (age <= 50) return "Size3";
  return "Size4";
}

// hard-code the url
const ICON_URL = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/icons/`

// load all form images
// we load the form names from the db and load the image
// each tree shape has in total four ages times four seasons
supabase.from("unique_tree_shapes").select('*')
.then(r => {
  // console.log(r.data)

  // save the promises for the data icons
  const loadPromises: Promise<{filename: string, image: ImageBitmap}>[] = [];

  (r.data as {shape: string}[]).forEach(({ shape }) => {
    (['Size1', 'Size2', 'Size3', 'Size4'].forEach(size => {
      (['Flowering', 'Summer', 'Autumn', 'Winter'].forEach(season => {
        const file_name = `${shape}_${size}_${season}.png`
        // console.log(file_name)

        // load the image
        loadPromises.push(new Promise(async (resolve) => {
          // await the fetch
          const image = await fetch(`${ICON_URL}${file_name}`).then(r => r.blob())
            .then(blob => createImageBitmap(blob, {resizeWidth: 250, resizeHeight: 250}))
            .catch(() => {
              console.log(`Image icon ${file_name} not found.`)
              return DEFAULT_IMG
            })

          resolve({filename: file_name, image})
        }))
      }))
    }))
  })

  // wait until all images are loaded
  Promise.all(loadPromises).then(fileMaps => {
    batch(() => {
      iconImages.value = fileMaps.map(obj => ({filename: obj.filename, icon: obj.image}))
      treeIconsLoaded.value = true;
    })
    console.log('All tree icons are loaded')
  })
})

// DEV: console.log the content of the full view
supabase.from("full_dataset_json").select('*')
.then(r => {
  // console.log(r.data)
  
  return r.data as TreeData[]
})
.then(data => {
  
  treeData.value = data
})


/**
 * SHADING DATA
 */

// define the raw tree shade data point
interface RawShadeHull {
  species_id: number;
  age: number;
  month: number;
  pruned: boolean;
  coordinates: number[][];
}

interface RawTreeShade {
  id: number;
  latin_name: string;
  age: number;
  shade_data: RawShadeHull[];
}

// create a database of shading data
// this is a private store and there will be a read only signal for building actual shading polygons from it
// this is meant to be a buffer for shading data, that is updated, whenever a new tree species was loaded
// to the map
const rawTreeShadeData = signal<RawTreeShade[]>([]);
effect(() => {
  // listen for changes in the existing tree species
})
export const treeShadeData = computed<RawTreeShade[]>(() => rawTreeShadeData.value);




// DEPRECATED - old code
// DATA HANDLING
// this works with local data right now, but it is written in a way that we can
// adapt to all possible data storage scenarios

// const parseTreeData = (data: unknown[]): TreeData[] => {
//   const parsedData: { [key: string]: TreeData } = {};
//   // a little buffer to save species we already found
//   const nameBuffer: string[] = [];

//   // check each row
//   data.forEach((row: any) => {
//     // check if we have seen the species before
//     if (row.Baumart && !nameBuffer.includes(row.Baumart)) {
//       nameBuffer.push(row.Baumart);
//       parsedData[row.Baumart] = {
//         type: row.Baumart,
//         latin: row.LateinischerName,
//         short: row["Kürzel"],
//         data: [],
//       } as TreeData;
//     }

//     // add the data point to the species
//     if (row.Baumart) {
//       parsedData[row.Baumart].data.push({
//         age: row.Alter,
//         bhd: row.BHD,
//         height: row["Baumhöhe"],
//         canopyHeight: row["Kronenansatzhöhe"],
//         canopyWidth: row.Kronenbreite,
//         agb: row.AGB,
//         carbon: row.Kohlenstoffgehalt,
//         image: row.image || "default-tree.png",
//         filename: row.image || "default-tree.png",
//       });
//     }
//   });

//   // return the data a a list
//   // TODO this is the place where we could support different internal data formats
//   return Object.values(parsedData);
// };
// // load the model_data.csv file on application startup
// // right now, the data is located in the public folder, but the parse function can load from anywhere
// // if we happen to gain so much control over the modelling step, that we can decide on the result format,
// // we could directly export the data as parse injects it into the signals
// parse("/model_data.csv", {
//   download: true,
//   // this does cause an error right now ?!
//   //    worker: true,                   // use a webworker, so that the app can continue loading
//   header: true, // first line are header
//   dynamicTyping: true, // most data are numbers
//   complete: async (results) => {
//     // alternative: step: (row) => {} if stuff gets bigger one day
//     // parse the data into the treeData signal
//     const data = parseTreeData(results.data);

//     // copy the current store with all pre-defined images (as of now only default)
//     const store = cloneDeep(treeIconStore.peek());

//     // map out only the images and metadata we need
//     const allImages =  data.flatMap(tree => tree.data.map(d => {
//       return {type: tree.type, age: d.age, image: d.image}
//     }))

//     // get a set of filenames
//     const filenames = [...new Set(allImages.map(d => d.image))]

//     // load these images async
//     const loadPromises: Promise<{filename: string, image: ImageBitmap}>[] = filenames.map((filename) => {
//       return new Promise(async (resolve) => {
//         // await the fetch
//         const image = await fetch(`/icons/${filename}`).then(r => r.blob()).then(blob => createImageBitmap(blob))

//         resolve({filename, image})
//       })
//     })

//     // wait util all images are loaded
//     Promise.all(loadPromises).then(fileMaps => {
//       // turn the filemaps into a Map
//       const fileMap = new Map(fileMaps.map(f => [f.filename, f.image]))
//       // console.log(fileMap)

//       // map each image filename to the image blob to the store
//       data.forEach(tree => tree.data.forEach(dataPoint => {
//         const image =  fileMap.get(dataPoint.image) || DEFAULT_IMG
//         store[`${tree.type}-${dataPoint.age}`] = {icon: image, filename: dataPoint.image}
//       }))

//       // update the data with the image identifier
//       const updatedData = data.map((tree => {
//         return {
//           ...tree,
//           data: tree.data.map(dataPoint => {
//             return {
//               ...dataPoint,

//               // overwrite the filename with the treeIcon Idenfifier for mapbox
//               image: `${tree.type}-${dataPoint.age}`
//             }
//           })
//         }
//       }))

//       // update the treeData and the Icon store in one batch
//       batch(() => {
//         treeIconStore.value = cloneDeep(store);
//         treeData.value = updatedData;
//         treeIconsLoaded.value = true;

//         // console.log(treeIconStore.peek())
//       });
//     })
//   },
// });
