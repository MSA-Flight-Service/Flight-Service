import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home1";
import SelectSeat from "./pages/SelectSeat";
import SeatInfoFormPage from "./pages/SeatInfoFormPage"
import SeatConfirmationPage from "./pages/SeatConfirmationPage";


function App() {
  return (
    <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/select/:key" element={<SelectSeat/>}/>
              <Route path="/form/:key" element={<SeatInfoFormPage />} />
              <Route path="/confirm/:key" element={<SeatConfirmationPage />} />
          </Routes>
    </BrowserRouter>
  );
}

export default App;
