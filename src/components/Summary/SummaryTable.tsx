import { Paper, TableContainer, } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSignalEffect } from "@preact/signals-react";
import { useState } from "react";
import { treeLocationFeatures } from "../../appState/geoJsonSignals";
import { agriculturalArea } from "../../appState/treeLineSignals";
import { area } from "@turf/turf";
import { germanSpecies } from "../../appState/backendSignals";

const columns: GridColDef[] = [
  { field: 'art', headerName: 'Art', minWidth: 350, flex: 1},
  { field: 'count', headerName: 'Anzahl', minWidth: 150},
  { field: 'countPerHa', headerName: 'Anzahl pro ha', minWidth: 150},
  { field: 'agb', headerName: 'Biomasse', minWidth: 150},
  { field: 'nectar', headerName: 'Nektarangebot', minWidth: 150},

]

interface Row {
  art: string,
  count: number,
  countPerHa: number,
  agb: number,
  nectar: number
}

const SummaryTable = () => {
  // create a state to hold the current data
  const [rows, setRows] = useState<Row[]>([])

  // update the rows when the treeLocationFeatures change
  useSignalEffect(() => {
    const treeSpecies: {[type: string]: Row} = {}
    treeLocationFeatures.value.forEach(tree => {
      // it this species is first seen, add it
      if (!(tree.properties.treeType in treeSpecies)) {
        treeSpecies[tree.properties.treeType] = {
          art: tree.properties.treeType,
          count: 1,
          countPerHa: 1,
          agb: tree.properties.agb || 0,
          nectar: tree.properties.nectar || 0
        }
      } else {
        // otherwise, just update the count
        treeSpecies[tree.properties.treeType].count += 1
        treeSpecies[tree.properties.treeType].countPerHa = treeSpecies[tree.properties.treeType].countPerHa
        treeSpecies[tree.properties.treeType].agb += tree.properties.agb || 0
        treeSpecies[tree.properties.treeType].nectar += tree.properties.nectar || 0
      }
    })

    // map the values into rows and do some last dataset-wide calculations
    setRows(Object.values(treeSpecies).map(row => {
      return {
        ...row,
        art: germanSpecies.peek()[row.art] || row.art,
        nectar: Math.round(row.nectar),
        agb: Math.round(row.agb),
        countPerHa: Math.round(row.countPerHa / (area(agriculturalArea.value) / 1000)) / 10
      }
    }))
  })

  return (
    <TableContainer sx={{ my: 2, bgcolor: "grey.100", width: '100%' }} component={Paper}>
      <DataGrid 
        columns={columns}
        rows={rows.map((r, i) => ({id: i, ...r}))}
        disableRowSelectionOnClick
        disableColumnSelector
        disableColumnMenu
      />
    </TableContainer>
  );
};

export default SummaryTable;
