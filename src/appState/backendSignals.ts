/**
 * The backend signals are used to communicate with the backend and reflect the current state of the backend.
 * To ease things a bit, I put all the firebase stuff in here as well.
 */
import { batch, computed, signal } from "@preact/signals-react";
import cloneDeep from "lodash.clonedeep";
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

  // flowering data
  flowering_1?: boolean;
  flowering_2?: boolean;
  flowering_3?: boolean;
  flowering_4?: boolean;
  flowering_5?: boolean;
  flowering_6?: boolean;
  flowering_7?: boolean;
  flowering_8?: boolean;
  flowering_9?: boolean;
  flowering_10?: boolean;
  flowering_11?: boolean;
  flowering_12?: boolean;

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
  icon_abbrev?: string,
  insects?: boolean[];
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

export const germanSpecies = computed<{[treeType: string]: string}>(() => {
  return Object.fromEntries(treeSpecies.value.map(species => ([species.latin_name, species.german_name || species.latin_name])))
})

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
  if (age <= 5) return "s";
  if (age <= 20) return "m";
  if (age <= 50) return "l";
  return "xl";
}

// hard-code the url
const ICON_URL = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/icons/`

// load all form images
// we load the form names from the db and load the image
// each tree shape has in total four ages times four seasons
supabase.from("species").select('icon_abbrev').filter('icon_abbrev', 'not.is', 'null')
.then(r => {
  // console.log(r.data)

  // save the promises for the data icons
  const loadPromises: Promise<{filename: string, image: ImageBitmap}>[] = [];

  (r.data as {icon_abbrev: string}[]).forEach(({ icon_abbrev }) => {
    (['s', 'm', 'l', 'xl'].forEach(size => {
      (['flowering', 'summer', 'autumn', 'winter'].forEach(season => {
        const file_name = `${size}_${season}_${icon_abbrev}.png`
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
 * Adding shades data
 */
interface RawShadeArray {
  species_id: number,
  age: number,
  month: number,
  pruned: boolean,
  coordinates: number[][]
}

export interface ShadeDatapoint {
  id: number,
  latin_name: string,
  age: number,
  shade_data: RawShadeArray[]
}

export interface ShadeData {
  [key: string]: ShadeDatapoint[]
}

// make the signal private to prevent direct manipulation
const rawShadeDatapoints = signal<ShadeData>({});

// load shade data whenever a new tree species was used on the map
export const loadShadeData = (species: string) => {
  supabase.from("shades_json").select('*').eq('latin_name', species)
  .then(response => response.data as ShadeDatapoint[])
  
  // buffer the loaded data
  .then(points => {
    rawShadeDatapoints.value = cloneDeep({
      ...rawShadeDatapoints.value,
      [species]: points
    })
  })
}

// read-only signal of shade data
export const shadeDatapoints = computed<ShadeData>(() => rawShadeDatapoints.value)


