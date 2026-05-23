import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import SubjectPage from "./pages/subject"

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element = {<Dashboard />} />
      <Route path="/subject/:subjectId" element ={<SubjectPage />} />
    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App