import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Snackbar,
  Alert,
  Chip,
  Box,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star"; // ⭐
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [msg, setMsg] = useState("");

  const auth = useSelector((s) => s.auth);
  const nav = useNavigate();

  useEffect(() => {
    api.get("/plans").then((res) => setPlans(res.data));

    api
      .get("/subscriptions/my-subscription")
      .then((res) => setActiveSub(res.data.subscription))
      .catch(() => {});
  }, []);

  const subscribe = async (id) => {
    if (!auth.user) {
      setMsg("Please login or register first!");
      setTimeout(() => nav("/login"), 1500);
      return;
    }

    try {
      await api.post(`/subscriptions/subscribe/${id}`);
      setMsg("Subscribed successfully!");
      setTimeout(() => nav("/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      setMsg("Subscription failed!");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={6}>
        {plans.map((p) => {
          const isCurrent =
            activeSub && activeSub.plan && activeSub.plan._id === p._id;

          const isRecommended = p.name === "Pro" || p.name === "Business";

          return (
            <Grid item xs={12} sm={6} md={4} key={p._id}>
              <Card
                sx={{
                  height: "100%", // all cards same height
                  borderRadius: "15px",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: isCurrent ? "3px solid #38A169" : "1px solid #ddd",
                  boxShadow: isCurrent
                    ? "0 0 12px #38A169"
                    : "0px 2px 10px rgba(0,0,0,0.05)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 0 15px #e08ce6",
                  },
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
                      right: 10,
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
                      left: 10,
                      fontWeight: 600,
                      mb: 4,
                    }}
                  />
                )}

                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    mt: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {p.name} - ${p.price}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Duration: {p.duration} days
                  </Typography>

                  <Box sx={{ mt: 2, flexGrow: 1 }}>
                    {p.features.map((f, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 0.5,
                        }}
                      >
                        <StarIcon
                          sx={{ fontSize: 16, color: "#FFD700", mr: 1 }}
                        />
                        <Typography variant="body2">{f}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    disabled={isCurrent}
                    onClick={() => subscribe(p._id)}
                    sx={{
                      mt: 2,
                      backgroundColor: isCurrent ? "#A0AEC0" : "#6B46C1",
                      "&:hover": {
                        backgroundColor: isCurrent ? "#A0AEC0" : "#553C9A",
                      },
                    }}
                  >
                    {isCurrent ? "Selected" : "Subscribe"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Snackbar
        open={!!msg}
        autoHideDuration={3000}
        onClose={() => setMsg("")}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <Alert
          onClose={() => setMsg("")}
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
