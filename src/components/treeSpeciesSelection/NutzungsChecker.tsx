import { Box, Tooltip, Typography } from "@mui/material";
import { Check, CircleOutlined, Close } from "@mui/icons-material";
import { ReactElement } from "react";

const NutzungsChecker = ({
  label,
  icon,
  status,
  tooltipTitle,
  tooltipContent,
}: {
  label: string;
  icon: ReactElement;
  status: boolean;
  tooltipTitle?: string;
  tooltipContent?: string;
}) => {
  return (
    <Tooltip
      title={
        <>
          <Typography color="inherit">{tooltipTitle}</Typography>
          {tooltipContent}
        </>
      }
      placement="top"
    >
      <Box sx={{ display: "flex", p: 1, m: 1, borderRadius: 2, bgcolor: "white" }}>
        {icon}
        <Typography pl={1} flex={1} variant="subtitle1">
          {label}
        </Typography>
        {status ? <Check /> : <Close />}
      </Box>
    </Tooltip>
  );
};

export default NutzungsChecker;
