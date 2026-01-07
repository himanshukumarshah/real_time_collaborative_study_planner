import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Toaster } from 'react-hot-toast'
import './index.css'
import router from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router} />
        <Toaster
          toastOptions={{
            limit: 3, // Only show the 3 most recent notifications
          }} 
        />
      </SocketProvider>
    </AuthProvider>
  </StrictMode>
)
