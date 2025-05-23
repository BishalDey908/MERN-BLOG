
import './App.css'
import  {BrowserRouter, Route, Routes } from "react-router-dom"
import CreateBlog from './pages/CreateBlog'
import ShowBlog from './pages/ShowBlog'
import SingleBlog from './pages/SingleBlog'

function App() {
  

  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path='/create-blog' element={<CreateBlog/>} />
      <Route path='/' element={<ShowBlog/>} />
      <Route path='/single-blog' element={<SingleBlog/>} />
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
