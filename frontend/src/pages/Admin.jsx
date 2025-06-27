import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { toast } from "react-toastify";
import SummaryApi from '../common/index';
const Admin = () => {
  const user = useSelector(state => state?.user?.user);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(SummaryApi.SendNotification.url, {
        method: SummaryApi.SendNotification.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Notification sent!');
        setMessage('');
        handleClose();
      } else {
        toast.error(result.message || 'Error sending notification');
      }
    } catch (error) {
      console.error('Failed to send notification', error);
      toast.error('Error sending notification');
    }
  };

  return (
    <>
      <div className='min-h-[80vh] md:hidden flex items-center justify-center mt-20 lg:mt-24'>
        Please use a bigger screen for the admin panel
      </div>
      <div className='min-h-[calc(100vh-120px)] md:flex hidden mt-20 lg:mt-24'>
        <aside className='bg-[#FFFFFF] min-h-full w-60 fixed customShadow'>
          <div className='h-32 flex justify-center items-center flex-col'>
            <div className='text-5xl cursor-pointer relative flex justify-center mt-20'>
              {
                user?.profilePicture ? (
                  <img src={user?.profilePicture} className='w-20 h-20 rounded-full p-2 m-4' alt={user?.name} />
                ) : (
                  <AccountCircle />
                )
              }
            </div>
            <p className='capitalize text-lg font-semibold'>{user?.name}</p>
            <p className='text-sm'>{user?.role}</p>
          </div>

          {/***navigation */}
          <div>
            <nav className='grid p-4 mt-16'>
              <Link to={"all-users"} className='px-2 py-1 hover:bg-slate-100 my-2'>All Users</Link>
              <Link to={"all-products"} className='px-2 py-1 hover:bg-slate-100 my-2'>All Products</Link>
              <Link to={"all-orders"} className='px-2 py-1 hover:bg-slate-100 my-2'>All Orders</Link>
              <Link to={"all-tickets"} className='px-2 py-1 hover:bg-slate-100 my-2'>All Tickets</Link>
              <Button color='primary' variant='contained' sx={{margin:"25px 10px"}} onClick={handleClickOpen}>Send Notification</Button>
              
            </nav>
          </div>
        </aside>
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Notification Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Send
            </Button>
          </DialogActions>
        </Dialog>
        <main className='w-full h-full p-2 m-4 ml-64'>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Admin;
