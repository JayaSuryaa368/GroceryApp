import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import UserHomePage from './pages/UserHomePage'
import StoreHomepage from './pages/StoreHomepage'
import AdminHomepage from './pages/AdminHomepage'
import PrivateRoute from './components/PrivateRoute'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RegisterPage/>}></Route>
          <Route path="/login" element={<LoginPage/>}></Route>
          <Route element={<PrivateRoute allowedRoles={["user"]}/>}>
          <Route path="/userhomepage" element={<UserHomePage/>}></Route>
          </Route>
          <Route element={<PrivateRoute allowedRoles={["store"]}/>}>
          <Route path="/storehomepage" element={<StoreHomepage/>}></Route>
          </Route>
          <Route element={<PrivateRoute allowedRoles={["admin"]}/>}>
          <Route path="/adminhomepage" element={<AdminHomepage/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
