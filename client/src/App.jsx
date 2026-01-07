import React from 'react'
import { createBrowserRouter } from 'react-router'
import Dashboard from './pages/Dashboard.jsx'
import LoginPage from './pages/Login.jsx'
import RegisterPage from './pages/Register.jsx'
import HomePage from './pages/LandingPage.jsx'
import ProfilePage from './pages/profile.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import StudyRoom from './pages/StudyRoom.jsx'
import RoomList from './pages/RoomList.jsx'
import CreateRoom from './pages/CreateRoom.jsx'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/auth/login', element: <LoginPage /> },
  { path: '/auth/register', element: <RegisterPage /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: "room/:id", element: <StudyRoom /> },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    )
  },
  { path: '/rooms', element: <RoomList /> },
  { path: '/create', element: <CreateRoom /> }
]);

export default router;