import { Box } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ height: '32px', boxSizing: 'border-box', boxShadow: 2, display: "flex", p: 0.5, justifyContent: "center", bgcolor: "background.paper" }}>
      <u style={{ margin: 0, padding: 0, paddingRight: 48, fontSize: 16 }}>Impressum</u>
      <u style={{ margin: 0, padding: 0, fontSize: 16 }}>Datenschutz</u>
    </Box>
  );
};

export default Footer;
