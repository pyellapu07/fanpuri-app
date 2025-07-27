import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Artists from './pages/Artists';
import FanHub from './pages/FanHub';
import LimitedDrops from './pages/LimitedDrops';
import SubmitWork from './pages/SubmitWork';
import ArtistProfile from './pages/ArtistProfile';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Cart from './pages/Cart';
import { CartProvider } from './contexts/CartContext';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Dark blue
    },
    secondary: {
      main: '#2c3e50', // Dark blue-gray
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/fanhub" element={<FanHub />} />
              <Route path="/limited-drops" element={<LimitedDrops />} />
              <Route path="/submit" element={<SubmitWork />} />
              <Route path="/artist/:id" element={<ArtistProfile />} />
              <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
