
import './App.css'
import  {BrowserRouter, Route, Routes } from "react-router-dom"
import CreateBlog from './pages/CreateBlog'
import ShowBlog from './pages/ShowBlog'
import SingleBlog from './pages/SingleBlog'
import Registration from './pages/Registration'
import OTPVerificationPage from './pages/OTPVerificationPage'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import UserBlog from './pages/UserBlog'
import UpdateBlog from './pages/UpdateBlog'

function App() {
  

  return (
    <>
     <BrowserRouter>
    <Navbar/>
     <Routes>
      <Route path='/create-blog' element={<CreateBlog/>} />
      <Route path='/' element={<ShowBlog/>} />
      <Route path='/single-blog' element={<SingleBlog/>} />
      <Route path='/user-blog' element={<UserBlog/>} />
      <Route path="/edit-blog/:id" element={<UpdateBlog />} />
      <Route path='/reg' element={<Registration/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/otp-varification' element={<OTPVerificationPage/>} />
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
