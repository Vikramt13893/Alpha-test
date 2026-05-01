import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext.jsx';
import Header from './components/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Categories from './pages/Categories.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Settings from './pages/Settings.jsx';
import MySpace from './pages/MySpace.jsx';
import Register from './pages/Register.jsx';
import UploadVideo from './pages/UploadVideo.jsx';
import Watch from './pages/Watch.jsx';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/watch/:videoId" element={<Watch />} />
          <Route
            path="/my-space"
            element={
              <ProtectedRoute>
                <MySpace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-space/upload"
            element={
              <ProtectedRoute>
                <UploadVideo />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}
