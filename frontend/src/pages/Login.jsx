import React from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/axios";
import { setCredentials } from "../store/authSlice";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

// Yup validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 chars")
    .required("Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      // Login request
      const res = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      dispatch(setCredentials(res.data));

      // Check if user has an active subscription
      const subRes = await api.get("/subscriptions/my-subscription");
      if (!subRes.data || !subRes.data.plan) {
        nav("/plans");
      } else {
        nav("/dashboard");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ maxWidth: 380, mx: "auto" }}>
        <Typography variant="h4" textAlign="center" sx={{ mb: 3 }}>
          LOGIN
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#6B46C1",
              "&:hover": { backgroundColor: "#553C9A" },
              display: "block",
              mx: "auto",
            }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}
