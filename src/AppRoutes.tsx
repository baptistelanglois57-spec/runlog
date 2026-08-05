import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import AddRun from "./pages/AddRun";
import History from "./pages/History";
import Statistics from "./pages/Statistics";
import EditRun from "./pages/EditRun";
import Records from "./pages/Records";
import Agenda from "./pages/Agenda";
import AddEvent from "./pages/AddEvent";
import Muscu from "./pages/Muscu";
import Tools from "./pages/Tools";
import Discipline from "./pages/Discipline";
import AthleteProfile from "./pages/AthleteProfile";
import Notes from "./pages/Notes";
import Forecast from "./pages/Forecast";

export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddRun />} />
        <Route path="/edit/:id" element={<EditRun />} />
        <Route path="/history" element={<History />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/records" element={<Records />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/muscu" element={<Muscu />} />
<Route
  path="/athlete-profile"
  element={<AthleteProfile />}
/>
        <Route
          path="/tools"
          element={<Tools />}
        />
        <Route
  path="/notes"
  element={<Notes />}
/>
<Route
  path="/forecast"
  element={<Forecast />}
/>
        <Route
          path="/discipline"
          element={<Discipline />}
        />

        
      </Routes>
    </Layout>
  );
}