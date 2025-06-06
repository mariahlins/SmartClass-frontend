import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'

import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'

import HomeStudent from './pages/Student/Home/Home.jsx'
import ProfileStudent from './pages/Student/Profile/Profile.jsx'
import ActivityStudent from './pages/Student/Class/ActivityStudent.jsx'

import CoursesManager from './pages/Manager/Courses/Courses.jsx'
import ClassesManager from './pages/Manager/Classes/Classes.jsx'
import ProfileManager from './pages/Manager/Profile/Profile.jsx'
import UsersManager from './pages/Manager/Users/Users.jsx'

import CoursesTeacher from './pages/Teacher/Courses/Courses.jsx'
import ClassesTeacher from './pages/Teacher/Classes/Classes.jsx'
import ProfileTeacher from './pages/Teacher/Profile/Profile.jsx'
import ActivityTeacher from './pages/Teacher/Lessons/Activity.jsx'

import ClassDetails from './components/ClassDetails/ClassDetails.jsx'

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },

  { path: "/home", element: <HomeStudent /> },
  { path: "/profile", element: <ProfileStudent /> },
  { path: "/lessons", element: <ActivityStudent /> },

  { path: "/home-manager", element: <CoursesManager /> },
  { path: "/profile-manager", element: <ProfileManager /> },
  { path: "/classes-manager", element: <ClassesManager /> },
  { path: "/users", element: <UsersManager /> },

  { path: "/home-teacher", element: <ClassesTeacher /> },
  { path: "/courses-teacher", element: <CoursesTeacher /> },
  { path: "/profile-teacher", element: <ProfileTeacher /> },
  { path: "/lesson-teacher", element: <ActivityTeacher /> },

  { path: "/classes/:id", element: <ClassDetails /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
