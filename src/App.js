import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Profile from './pages/Profile';
import Offers from './pages/Offers';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Header from './components/Header';

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/Profile" element={<Profile />}></Route>
          <Route path="/Offers" element={<Offers />}></Route>
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route path="/sign-up" element={<SignUp />}></Route>
          <Route path="/ForgotPassword" element={<ForgotPassword />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
