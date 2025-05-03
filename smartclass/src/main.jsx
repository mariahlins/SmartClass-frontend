import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'

import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'

import HomeStudent from './pages/Student/Home/Home.jsx'
import ProfileStudent from './pages/Student/Profile/Profile.jsx'

import HomeManager from './pages/Manager/Home/Home.jsx'
import CoursesManager from './pages/Manager/Courses/Courses.jsx'
import ClassesManager from './pages/Manager/Classes/Classes.jsx'
import ProfileManager from './pages/Manager/Profile/Profile.jsx'
import UsersManager from './pages/Manager/Users/Users.jsx'

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },

  {path: "/home", element: <HomeStudent /> },
  {path: "/profile", element: <ProfileStudent /> },
  
  {path: "/home-manager", element: <HomeManager /> },
  {path: "/profile-manager", element: <ProfileManager /> },
  {path: "/courses", element: <CoursesManager /> },
  {path: "/classes-manager", element: <ClassesManager /> },
  {path: "/users", element: <UsersManager /> }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
