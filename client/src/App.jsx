import { Routes, Route } from 'react-router-dom'

import { AuthContextProvider } from './contexts/authContext'

import CatalogAuction from "./components/auctions/Catalog"
import CreateAuction from "./components/auctions/Create"
import DetailsAuction from "./components/auctions/Details"
import EditAuction from "./components/auctions/Edit"
import Header from "./components/header/Header"
import Home from "./components/home/Home"
import Login from "./components/login/Login"
import Register from "./components/register/Register"
import Logout from './components/logout/Logout'
import Profile from './components/profile/Profile'
import PrivateRoute from './components/guards/PrivateRoute'
import PublicRoute from './components/guards/PublicRoute'
import PrivateRouteEditAuction from './components/guards/PrivateRouteEditAuction'
import SearchAuctions from './components/auctions/Search'

function App() {

  return (
    <AuthContextProvider>
      <Header />

      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/auctions/:auctionId/details' element={<DetailsAuction />} />
        <Route path='/auctions/catalog' element={<CatalogAuction />} />
        <Route path='/auctions/closed' element={<CatalogAuction />} />
        <Route path='/auctions/search' element={<SearchAuctions />} />

        <Route element={<PublicRoute />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path='/auctions/create' element={<CreateAuction />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/logout' element={<Logout />} />
        </Route>

        <Route element={<PrivateRouteEditAuction />}>
          <Route path='/auctions/:auctionId/edit' element={<EditAuction />} />
        </Route>

      </Routes>

    </AuthContextProvider>
  )
}

export default App
