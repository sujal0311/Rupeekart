import React, { useState,useContext } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { useNavigate,useLocation } from 'react-router-dom';
import Context from '../context/index';
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
    [theme.breakpoints.up('lg')]: {
      width: '35ch',
    },
  },
}));

function Navbar() {
  const user = useSelector((state) => state?.user?.user);
  const navigate= useNavigate();
  const searchInput = useLocation()
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.getAll("q")
  const [search,setSearch] = useState(searchQuery)
  const context = useContext(Context)
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(SummaryApi.logoutUser.url, {
        method: SummaryApi.logoutUser.method,
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        navigate('/');
        window.location.reload();
        
        
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  };
  const handleSearch = (e)=>{
    const { value } = e.target
    setSearch(value)

    if(value){
      navigate(`/search?q=${value}`)
    }else{
      navigate("/search")
    }
  }
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {user ? (
        user.role === 'Admin' ? (
          <>
            <MenuItem component={Link} to="/admin">Admin</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        ) : (
          <>
            <MenuItem component={Link} to="/profile">Profile</MenuItem>
            <MenuItem component={Link} to="/my-orders">My Orders</MenuItem>
            <MenuItem component={Link} to="/tickets">My Tickets</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        )
      ) : (
        <MenuItem component={Link} to="/login">Login</MenuItem>
      )}
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {user ? (
        user.role === 'Admin' ? (
          <div>
            <MenuItem component={Link} to="/admin">
              Admin
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </div>
        ) : (
          <div>
            <MenuItem component={Link} to="/profile">
              Profile
            </MenuItem>
            <MenuItem component={Link} to="/my-orders">
              My Orders
            </MenuItem>
            <MenuItem component={Link} to="/tickets">
              My Tickets
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </div>
        )
      ) : (
        <MenuItem component={Link} to="/login">
          Login
        </MenuItem>
      )}
    </Menu>
  );

  const categories = [
    { text: 'Mobiles', link: '/product-category?category=mobiles' },
    { text: 'Televisions', link: '/product-category?category=televisions' },
    { text: 'Refrigerators', link: '/product-category?category=refrigerator' },
    { text: 'Earphones', link: '/product-category?category=earphones' },
    { text: 'Mouses', link: '/product-category?category=Mouse' },
    { text: 'Watches', link: '/product-category?category=watches' },
  ];

  return (
    <Box sx={{ flexGrow: 1,position:"fixed",zIndex:100,width:"100%"}}>
      <AppBar position="static">
        <Toolbar sx={{ width: '100%', backgroundColor: '#01348B' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display: { xs: 'block', lg: 'none' } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/" onClick={()=>{
            setSearch("")
          }}>
            <img
              src="https://github.com/sujal0311/temp/blob/main/OIG4.z91PgW.jpeg?raw=true"
              alt="Logo"
              className="xl:w-20 rounded m-1 hidden xl:block"
            />
          </Link>
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, ml: 4,mr:4 }}>
            {categories.map((category) => (
              <Typography
                key={category.text}
                variant="body1"
                component={Link}
                to={category.link}
                sx={{ mx: 2, cursor: 'pointer', textDecoration: 'none', color: 'inherit', '&:hover': { color: '#c0d8f2' } }}
              >
                {category.text}
              </Typography>
            ))}
          </Box>
          <Search >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} onChange={handleSearch} value={search}/>
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            
            {user ? (
              <>
              <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={context?.notificationCount} color="error" onClick={()=>{
              navigate('/notifications');
            }}>
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" aria-label="show 3 items in cart" color="inherit" onClick={()=>{
              navigate('/cart');
            }}>
              <Badge badgeContent={context?.cartProductCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton >
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <div className='w-8'><img src={user.profilePicture} alt="profile" className='rounded-full' /></div>
                </IconButton>
              </>
            ) : (
              <Button variant="contained" component={Link} to="/login" sx={{ ml: 2 }}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Link to="/">
              <img src="https://github.com/sujal0311/temp/blob/main/OIG4.z91PgW.jpeg?raw=true" alt="Logo" className="w-28 rounded" />
            </Link>
          </Box>
          <Divider />
          <List>
            {categories.map((category) => (
              <ListItem button key={category.text} component={Link} to={category.link}>
                <ListItemButton>
                  <ListItemText primary={category.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

export default Navbar;
