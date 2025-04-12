/* eslint-disable react/jsx-pascal-case */
import React from 'react'
import {Login} from './Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Dashboard from './DashBoard'
import Update from './components/Update'
import LandingPage from './LandingPage'
import {Teamleader} from './Teamleader'
import Team_m from './Team_m'
import Employee from './Employee'
import Update_user from './components/Update_user'
import MemberSkills from './MemberSkills'

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/login/dashboard' element={<Dashboard/>}></Route>
            <Route path='/update/:id' element={<Update/>}></Route>
            <Route path='/update_user/:id' element={<Update_user/>}></Route>
            
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/login/DashBoard/Teamleader/:id' element={<Teamleader/>}></Route>
            <Route path='/login/DashBoard/Teamleader/Team_m' element={<Team_m/>}></Route>
            <Route path='/login/DashBoard/Employee/:id' element={<Employee/>}></Route>
            <Route path='/login/DashBoard/MemberSkills' element={<MemberSkills/>}></Route>
            <Route path='/' element={<LandingPage/>}></Route>
            
        </Routes>
    </BrowserRouter>
  )
}

export default App
