import { Box } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", bgcolor: "background.paper" }}>
      <u style={{ margin: 0, padding: 0, paddingRight: 48, fontSize: 16 }}>Impressum</u>
      <u style={{ margin: 0, padding: 0, fontSize: 16 }}>Datenschutz</u>
    </Box>
  );
};

export default Footer;
