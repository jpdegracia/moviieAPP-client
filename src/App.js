import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { UserProvider } from './UserContext';
import AppNavBar from './components/AppNavBar';
import AddMovie from './pages/AddMovie';
import Movies from './pages/Movies';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';



function App() {

  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  function unsetUser(){
    localStorage.clear();
  };


  useEffect(() => {
  if (localStorage.getItem('token')) {
    fetch(`https://movieapp-api-lms1.onrender.com/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log("data from app.js", data);

      if (data && data.user) { // Ensure data and user exist
        const { user: userData } = data;

        console.log(userData);

        if (userData && userData._id) {  // Check if userData exists and has _id
          setUser({
            id: userData._id,
            isAdmin: userData.isAdmin
          });
        } else {
          setUser({
            id: null,
            isAdmin: null
          });
        }
      } else {
        setUser({ id: null, isAdmin: null }); // Handle cases where data.user is missing
      }
    })
    .catch(error => {
      console.error("Error fetching user details:", error);
      setUser({ id: null, isAdmin: null }); // Handle fetch errors
    });
  }
}, []);

  useEffect(() => {
    console.log(user);
    console.log(localStorage);
  }, [user])

  return (
    <>
    
      <UserProvider value={{ user, setUser, unsetUser }}>
        <Router>
          <AppNavBar />
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/addMovie" element={<AddMovie />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Container>
        </Router>
      </UserProvider>
    </>

  )
}

export default App