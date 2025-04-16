import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'

import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'

import HomeStudent from './pages/Student/Home/Home.jsx'
import ProfileStudent from './pages/Student/Profile/Profile.jsx'
import ClassesStudent from './pages/Student/Class/ClassesStudent.jsx'

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },

  {path: "/home", element: <HomeStudent /> },
  {path: "/profile", element: <ProfileStudent /> },
  {path: "/classes", element: <ClassesStudent /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
