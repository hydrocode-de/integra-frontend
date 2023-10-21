import { ChakraProvider, Box, theme } from "@chakra-ui/react"
import MainMap from "./components/MainMap"



export const App = () => (
  <ChakraProvider theme={theme}>
    <Box width="100vw" height="100vh" m="0" p="0">
      <MainMap />
    </Box>
  </ChakraProvider>
)
