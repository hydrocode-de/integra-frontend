import { Box } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", bgcolor: "background.paper" }}>
      <u style={{ margin: 0, padding: 0, marginRight: '1rem', fontSize: 16, cursor: 'pointer' }}>Impressum</u>
      <u style={{ margin: 0, padding: 0, fontSize: 16, cursor: 'pointer' }}>Datenschutz</u>
    </Box>
  );
};

export default Footer;
