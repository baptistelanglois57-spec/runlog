import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import AddRun from "./pages/AddRun";
import History from "./pages/History";
import Statistics from "./pages/Statistics";
import EditRun from "./pages/EditRun";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/add" element={<AddRun />} />
  <Route path="/edit/:id" element={<EditRun />} />
  <Route path="/history" element={<History />} />
  <Route path="/statistics" element={<Statistics />} />
</Routes>
      </Layout>
    </BrowserRouter>
  );
}

