import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { useThemeContext } from "../ThemeContext";

const statusColors = {
  active: "#4caf50",
  expired: "#f44336",
  pending: "#ff9800",
};

export default function AdminSubscriptions() {
  const { darkMode } = useThemeContext();
  const [subs, setSubs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    api
      .get("/subscriptions/admin")
      .then((res) => setSubs(res.data))
      .catch((err) => {
        console.error(err);
        alert("Forbidden or error");
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: 2, textAlign: "center", color: darkMode ? "#fff" : "#000" }}
      >
        Admin Dashboard - Subscriptions
      </Typography>

      <Paper
        elevation={3}
        sx={{
          backgroundColor: darkMode ? "#1E1E1E" : "#fff",
          color: darkMode ? "#fff" : "#000",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{
              backgroundColor: darkMode ? "#333" : "#6B46C1",
            }}
          >
            <TableRow>
              {["User", "Plan", "Start", "End", "Status"].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {subs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((s) => (
                <TableRow
                  key={s._id}
                  sx={{
                    "&:hover": {
                      backgroundColor: darkMode ? "#333" : "#f5f5f5",
                    },
                    transition: "0.3s",
                  }}
                >
                  <TableCell>
                    <Box>
                      <Typography fontWeight="bold">{s.user?.name}</Typography>
                      <Typography
                        variant="body2"
                        color={darkMode ? "grey.300" : "text.secondary"}
                      >
                        {s.user?.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{s.plan?.name}</TableCell>
                  <TableCell>
                    {new Date(s.start_date).toLocaleString()}
                  </TableCell>
                  <TableCell>{new Date(s.end_date).toLocaleString()}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        color: "white",
                        backgroundColor:
                          statusColors[s.status?.toLowerCase()] || "#999",
                        fontWeight: "bold",
                      }}
                    >
                      {s.status}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={subs.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            color: darkMode ? "#fff" : "#000",
            backgroundColor: darkMode ? "#1E1E1E" : "#fff",
          }}
        />
      </Paper>
    </Container>
  );
}
