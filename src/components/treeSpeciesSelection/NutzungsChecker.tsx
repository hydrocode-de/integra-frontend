import { Box, Modal, Slider, Typography } from "@mui/material";
import { Check, CircleOutlined, Close, EuroRounded, MonetizationOn } from "@mui/icons-material";
import { ReactElement, ReactNode } from "react";

const NutzungsChecker = ({
  label,
  icon,
  status,
}: //   children,
{
  label: string;
  icon: ReactElement;
  status: "checked" | "unchecked" | "partial";
  //   children: ReactNode;
}) => {
  return (
    <Box sx={{ display: "flex", p: 1, m: 1, borderRadius: 2, bgcolor: "white" }}>
      {icon}
      <Typography pl={1} flex={1} variant="subtitle1">
        {label}
      </Typography>
      {status === "checked" ? <Check /> : status === "unchecked" ? <Close /> : <CircleOutlined />}
    </Box>
  );
};

export default NutzungsChecker;
