import { Box, Slider, Tooltip, Typography, styled } from "@mui/material";

const StandortSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#0a84ff" : "#007bff",
  height: 4,
  padding: "15px 0",
  "& .MuiSlider-thumb": {
    height: 10,
    width: 10,
    backgroundColor: "#fff",
    boxShadow: "0 0 2px 0px rgba(0, 0, 0, 0.1)",
    // "&:focus, &:hover, &.Mui-active": {
    //   boxShadow: "0px 0px 3px 1px rgba(0, 0, 0, 0.1)",
    //   // Reset on touch devices, it doesn't add specificity
    // },
    "&:before": {
      boxShadow: "0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)",
    },
  },
  "& .MuiSlider-valueLabel": {
    fontSize: 10,
    fontWeight: "normal",
    top: 4,
    backgroundColor: "unset",
    color: theme.palette.text.primary,
    "&::before": {
      display: "none",
    },
    "& *": {
      background: "transparent",
      color: theme.palette.mode === "dark" ? "#fff" : "#000",
    },
  },
  "& .MuiSlider-track": {
    border: "none",
    height: 5,
  },
  "& .MuiSlider-rail": {
    opacity: 0.5,
    boxShadow: "inset 0px 0px 4px -2px #000",
    backgroundColor: "#d0d0d0",
  },
  "& .MuiSlider-markLabel": {
    fontSize: 10,
  },
}));

const StandortValueRange = ({
  marks,
  min,
  max,
  minValue,
  maxValue,
  label,
}: {
  marks: { value: number; label: string }[];
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  label: string;
}) => {
  return (
    <Tooltip
      title={
        <>
          <Typography color="inherit">Niederschlagsbedarf</Typography>
          Feldahorn (Acer campestre) benötigt 300-500 mm Niederschlag pro Jahr.
        </>
      }
      placement="top"
    >
      <Box
        sx={{
          ":hover": {
            bgcolor: "grey.200",
          },
          px: 1,
          pb: 1,
          borderRadius: 2,
          m: 0,
        }}
      >
        <Typography m={0} pb={0.5} variant="caption">
          {label}
        </Typography>
        <StandortSlider
          min={min}
          max={max}
          sx={{ m: 0 }}
          valueLabelDisplay="on"
          value={[minValue, maxValue]}
          // disabled
          marks={marks}
        />
      </Box>
    </Tooltip>
  );
};

export default StandortValueRange;
