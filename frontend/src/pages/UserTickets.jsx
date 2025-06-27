import React, { useState, useEffect } from "react";
import { Modal, Box, Button, TextField, Typography, Card, CardContent, Grid } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SummaryApi from "../common/index";

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(SummaryApi.getUserTickets.url, {
          method: SummaryApi.getUserTickets.method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        console.log("Fetched tickets data:", data);

        if (response.ok) {
          if (Array.isArray(data.tickets)) {
            setTickets(data.tickets);
          } else {
            toast.error("Unexpected data format received.");
          }
        } else {
          toast.error(`Error: ${data.message}`);
        }
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    };

    const interval = setInterval(() => {
      fetchTickets();
     }, 1000); 
    return () => clearInterval(interval);
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(SummaryApi.createTicket.url, {
        method: SummaryApi.createTicket.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, description }),
      });

      const data = await response.json();

      console.log("Created ticket response data:", data);

      if (response.ok) {
        toast.success("Ticket created successfully!");
        setSubject("");
        setDescription("");
        handleClose();

        if (Array.isArray(data.tickets)) {
          setTickets((prevTickets) => [...prevTickets, ...data.tickets]);
        } else if (data && typeof data === "object") {
          setTickets((prevTickets) => [...prevTickets, data]);
        } else {
          toast.error("Unexpected data format received.");
        }
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="mt-20 lg:mt-28 flex flex-col justify-center items-center">
      <ToastContainer />
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ fontWeight: 600, color: "#01348B" }}
      >
        My Tickets
      </Typography>
      <Button variant="contained" onClick={handleOpen}>
        Create a Ticket
      </Button>

      {tickets.length === 0 ? (
        <Typography
          variant="body1"
          color="textSecondary"
          style={{ marginTop: "20px" }}
        >
          No tickets created.
        </Typography>
      ) : (
        <Grid container spacing={2} style={{ marginTop: "20px",margin:"auto" }}>
          {tickets.map((ticket, index) => (
            <Grid item xs={11} sm={2} md={12} key={index} sx={{marginX:{
                lg:"80px"
            }}}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="div">
                    {ticket.subject}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {ticket.description}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    Status: {ticket.status}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Created At: {new Date(ticket.createdAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
           <p className="mt-10 mx-6 lg:mx-28 text-blue-950" >NOTE: You will be contacted soon in your registered mail.</p>
        </Grid>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-ticket-modal-title"
        aria-describedby="create-ticket-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="create-ticket-modal-title"
            variant="h6"
            component="h2"
          >
            Create a Ticket
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Subject"
              variant="outlined"
              margin="normal"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default UserTickets;
