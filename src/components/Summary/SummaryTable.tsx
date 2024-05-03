import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const SummaryTable = () => {
  function createData(name: string, anzahl: number, astung: string, anordung: string, abstand: number) {
    return { name, anzahl, astung, anordung, abstand };
  }

  const rows = [
    createData("Salweide", 45, "nein", "Reihen", 24),
    createData("Winterlinde", 80, "ja", "Reihen", 37),
    createData("Roter Hardriegel", 20, "-", "Reihen", 2),
    createData("Hundsrose", 20, "-", "Reihen", 2),
    createData("Winterlinde", 20, "ja", "Einzeln", 2),
  ];

  return (
    <TableContainer sx={{ my: 4 }} component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Art</TableCell>
            <TableCell align="right">Anzahl pro ha</TableCell>
            <TableCell align="right">Ästung</TableCell>
            <TableCell align="right">Anordung</TableCell>
            <TableCell align="right">Abstände</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.anzahl}</TableCell>
              <TableCell align="right">{row.astung}</TableCell>
              <TableCell align="right">{row.anordung}</TableCell>
              <TableCell align="right">{row.abstand}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SummaryTable;
