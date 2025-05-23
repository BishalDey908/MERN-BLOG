
import './App.css'
import  {BrowserRouter, Route, Routes } from "react-router-dom"
import CreateBlog from './pages/CreateBlog'

function App() {
  

  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path='/blog' element={<CreateBlog/>} />
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
