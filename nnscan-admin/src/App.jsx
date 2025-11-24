import { BrowserRouter, Route, Router, Routes } from 'react-router'
import './App.css'
import Login from './pages/login/Login'
import Home from './pages/dashboard/Home'
import ValidatorControl from './pages/dashboard/ValidatorControl'
import Sidebar from './pages/directives/Sidebar'
import TokenControls from './pages/dashboard/TokenControls'
import ProtectedRoute from './components/ProtectedRoute'
import ListingValidator from './pages/dashboard/ListingValidator'
import Minting from './pages/dashboard/Minting'
import Layout from './Layout'
import NftDetail from './pages/dashboard/NFTdetail'
import ValidatorDetails from './pages/dashboard/ValidatorDetails'
import ChainData from './pages/dashboard/ChainData'

function App() {

  return (
    <> 
   
  <BrowserRouter basename="/nn-ad/">
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Protected Routes */}
      
       <Route element={<Layout />}>
     <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/validator-control"
        element={
          <ProtectedRoute>
            <ValidatorControl />
          </ProtectedRoute>
        }
      />

      <Route
        path="/token-controls"
        element={
          <ProtectedRoute>
            <TokenControls />
          </ProtectedRoute>
        }
      />
      <Route
        path="/minting"
        element={
          <ProtectedRoute>
            <Minting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chain-data"
        element={
          <ProtectedRoute>
            <ChainData />
          </ProtectedRoute>
        }
      />
    
        <Route path="/minting/:id/" element={<NftDetail />} />
     <Route path="/validator-details/:operator_address" element={<ValidatorDetails />} />
      <Route path="/listing-validator" element={<ListingValidator />} />
      </Route>
     
    </Routes>
  </BrowserRouter>
    
    </>
  )
}

export default App
