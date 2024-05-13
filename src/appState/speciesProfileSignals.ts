import { batch, computed, signal } from "@preact/signals-react";
// import cloneDeep from "lodash.clonedeep";
import { createClient } from "@supabase/supabase-js";
import cloneDeep from "lodash.clonedeep";

// connect to supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface SpeciesProfile {
  id: number;
  species_id: number;
  profile: string;
  precipitation_min: number;
  precipitation_max: number;
  soil_moisture_min: number;
  soil_moisture_max: number;
  low_waterlogging_tolerance: boolean;
  low_drought_tolerance: boolean;
  ph_min: number;
  ph_max: number;
  nutrient_demand_min: number;
  nutrient_demand_max: number;
  late_frost_resistance_min: number;
  late_frost_resistance_max: number;
  wood_production: boolean;
  short_rotation: boolean;
  fruits_nuts: boolean;
  flowering_month_min: number;
  flowering_month_max: number;
  blossom_number: number;
  pollen_supply: number;
  nectar_supply: number;
  max_n_of_insect_species: number;
  information_links: string[];
}

const rawSpeciesProfile = signal<SpeciesProfile[] | null>(null);

// console.log("fetching species profile");
supabase
  .from("species_profile")
  .select("*")
  .then(({ data, error }) => {
    if (error) {
      console.error("error fetching species profile", error);
    } else {
      rawSpeciesProfile.value = data;
    }
  });

export const speciesProfile = computed(() => {
  //   const profiles = rawSpeciesProfile.value;
  return rawSpeciesProfile.value;
});
