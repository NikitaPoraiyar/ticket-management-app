import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/login.jsx';
import SignupPage from './pages/signup.jsx';
import AdminPage from './pages/AdminPage.jsx';


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/admin' element={<AdminPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
