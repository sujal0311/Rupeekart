import React, { useState, useEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import SummaryApi from "../common/index";

function AllTickets() {
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const fetchAllTickets = async () => {
    try {
      const response = await fetch(SummaryApi.getAllTickets.url, {
        method: "GET",
        credentials: "include",
      });
      const dataResponse = await response.json();
      console.log(dataResponse);
      if (dataResponse.success) {
        setAllTickets(dataResponse.tickets);
      } else {
        console.log(dataResponse.message);
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;

    try {
      const response = await fetch(SummaryApi.updateTicketStatus.url, {
        method: SummaryApi.updateTicketStatus.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticketID: selectedTicket._id, status: "Closed" }),
      });

      const dataResponse = await response.json();

      if (dataResponse.success) {
        toast.success("Ticket status updated to Closed");
        fetchAllTickets();
        setOpenDetailsDialog(false);
      } else {
        toast.error(dataResponse.message);
      }
    } catch (error) {
      console.error("Failed to update ticket status:", error);
      toast.error("Failed to update ticket status");
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  return (
    <div>
      <div className="flex justify-center">
        <Typography variant="h4" component="h1" gutterBottom>
          All Tickets
        </Typography>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ticket Number</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allTickets.map((ticket) => (
                <TableRow key={ticket._id}>
                  <TableCell>{ticket.ticketNumber}</TableCell>
                  <TableCell>{ticket.userId.email}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                  <TableCell>
                    {moment(ticket.createdAt).format("LLLL")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setOpenDetailsDialog(true);
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Ticket Details Dialog */}
      <Dialog
        maxWidth="xs"
        fullWidth
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
      >
        <DialogTitle>Ticket Details</DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <>
              <Typography>
                <strong>Subject:</strong> {selectedTicket.subject}
              </Typography>
              <Typography>
                <strong>Description:</strong> {selectedTicket.description}
              </Typography>
              <Typography>
                <strong>Status:</strong> {selectedTicket.status}
              </Typography>
              <Typography>
                <strong>Created At:</strong>{" "}
                {moment(selectedTicket.createdAt).format("LLLL")}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
          {selectedTicket && selectedTicket.status !== "Closed" && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCloseTicket}
            >
              Close ticket
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AllTickets;
