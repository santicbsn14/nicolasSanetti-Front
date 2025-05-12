
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import Home from './Components/Home/Home'
import Footer from './Components/Footer/Footer'

function App() {


  return (
    <>
    <BrowserRouter>
    <Navbar></Navbar>
    <Routes>
    <Route path='/' element={<Home/>}/>
    </Routes>
    <Footer/>
    </BrowserRouter>
    </>
  )
}

export default App
