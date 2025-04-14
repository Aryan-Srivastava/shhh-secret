import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import theme from "./theme";
import CreateSecret from "./pages/CreateSecret";
import ViewSecret from "./pages/ViewSecret";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<CreateSecret />} />
          <Route path="/shhh/:secretId" element={<ViewSecret />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
