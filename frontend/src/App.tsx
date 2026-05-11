import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import { useUserData } from './context/UserContext'
import Loading from './components/Loading'
import Register from './pages/Register'
import Album from './pages/Album'
import PlayList from './pages/PlayList'


const App = () => {
  const { isAuth, loading } = useUserData();
  return (
    <>
      {loading ? <Loading /> : <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/album/:id' element={<Album />}></Route>
          <Route path='/playlist' element={isAuth ? <PlayList /> : <Login />}></Route>
          <Route path='/login' element={isAuth ? <Home /> : <Login />}></Route>
          <Route path='/register' element={isAuth ? <Home /> : <Register />}></Route>
        </Routes>
      </BrowserRouter>}
    </>
  )
}

export default App
