import React, { useEffect, useState } from "react";
import api from "../api/axios";

import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  LinearProgress,
  Box,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UpgradeIcon from "@mui/icons-material/Upgrade";

export default function Dashboard() {
  const [sub, setSub] = useState(null);
  const [plans, setPlans] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // Fetch user's subscription
    api
      .get("/subscriptions/my-subscription")
      .then((res) => setSub(res.data.subscription))
      .catch(() => {});

    // Fetch all plans
    api
      .get("/plans")
      .then((res) => setPlans(res.data))
      .catch(() => {});
  }, []);

  const start = sub ? new Date(sub.start_date) : null;
  const end = sub ? new Date(sub.end_date) : null;
  const now = new Date();
  const total = sub ? end - start : 1;
  const used = sub ? now - start : 0;
  const percent = Math.min(100, Math.max(0, (used / total) * 100));

  const handleUpgrade = async (planId) => {
    try {
      await api.post(`/subscriptions/subscribe/${planId}`);
      setMsg("Upgraded successfully!");
      setModalOpen(false);
      const res = await api.get("/subscriptions/my-subscription");
      setSub(res.data.subscription);
    } catch (err) {
      console.error(err);
      setMsg("Upgrade failed!");
    }
  };

  if (!sub)
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h5" sx={{ color: "text.secondary" }}>
          No active subscription
        </Typography>
      </Container>
    );

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          border: "1px solid #fff",
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{
                bgcolor: "#fff",
                width: 50,
                height: 50,
                fontSize: 24,
                fontWeight: "bold",
                color: "#6B46C1",
              }}
            >
              {sub.plan.name.charAt(0)}
            </Avatar>
          }
          title={sub.plan.name}
          subheader="Your Active Plan"
          sx={{
            background: "linear-gradient(90deg, #6B46C1, #805AD5)",
            color: "white",
            "& .MuiCardHeader-subheader": { color: "#E9D8FD" },
          }}
        />
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <MonetizationOnIcon color="primary" />
            <Typography variant="h6">Price: ${sub.plan.price}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarMonthIcon color="action" />
            <Typography>Start: {start.toLocaleString()}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <CalendarMonthIcon color="action" />
            <Typography>End: {end.toLocaleString()}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <CheckCircleIcon color="success" />
            <Typography>Status: {sub.status}</Typography>
          </Box>

          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            Subscription Validity: {percent.toFixed(0)}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{ height: 10, borderRadius: 5, mb: 3 }}
          />

          <Button
            variant="contained"
            fullWidth
            startIcon={<UpgradeIcon />}
            sx={{
              backgroundColor: "#6B46C1",
              "&:hover": { backgroundColor: "#553C9A" },
              mt: 2,
              py: 1.5,
              borderRadius: "12px",
            }}
            onClick={() => setModalOpen(true)}
          >
            Upgrade Plan
          </Button>
        </CardContent>
      </Card>
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select a Plan to Upgrade</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {plans.map((p) => {
              const isCurrent = sub.plan._id === p._id;
              const isRecommended = p.name === "Pro" || p.name === "Business";

              return (
                <Grid item xs={12} sm={6} md={4} key={p._id}>
                  <Card
                    sx={{
                      borderRadius: "15px",
                      border: isCurrent
                        ? "3px solid #38A169"
                        : "1px solid #ddd",
                      position: "relative",
                    }}
                  >
                    {isRecommended && (
                      <Chip
                        label="Recommended"
                        color="secondary"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          fontWeight: 600,
                        }}
                      />
                    )}
                    {isCurrent && (
                      <Chip
                        label="Current Plan"
                        color="success"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          fontWeight: 600,
                        }}
                      />
                    )}
                    <CardContent sx={{ mt: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {p.name} - ${p.price}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Duration: {p.duration} days
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {p.features.map((f, i) => (
                          <Typography key={i} variant="body2">
                            • {f}
                          </Typography>
                        ))}
                      </Box>
                      <Button
                        variant="contained"
                        fullWidth
                        disabled={isCurrent}
                        sx={{
                          mt: 2,
                          backgroundColor: isCurrent ? "#A0AEC0" : "#6B46C1",
                          "&:hover": {
                            backgroundColor: isCurrent ? "#A0AEC0" : "#553C9A",
                          },
                        }}
                        onClick={() => handleUpgrade(p._id)}
                      >
                        {isCurrent ? "Selected" : "Upgrade"}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setModalOpen(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!msg}
        autoHideDuration={3000}
        onClose={() => setMsg("")}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <Alert
          onClose={() => setMsg("")}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
