
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContext, { AuthProvider } from './context/AuthContext';
import PrivateRoute from './middleware/Privateroute';
import Userroute from './middleware/Userroute';

import Login from './components/Login';
import Register from './components/Register';
import NavBar from './components/messageapp/NavBar';
import MessageBody from './components/messageapp/MessageBody';
import Messagedetail from './components/messageapp/Messagedetail';
import SearchUser from './components/messageapp/SearchUser';


function App() {
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes for Unauthenticated Users */}
          <Route path="/login" element={<Userroute><Login /></Userroute>} />
          <Route path="/register" element={<Userroute><Register /></Userroute>} />

          {/* Private Routes - Authenticated Users Only */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <AuthenticatedApp />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
function AuthenticatedApp() {
  return (
    <div>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path='/' element={<MessageBody />} />
          <Route path='/:id' element={<Messagedetail /> } />
          <Route path='/searchuser/:username' element={<SearchUser/> } />
        </Routes>
      
    </AuthProvider>
     
    </div>
  );
}

export default App;