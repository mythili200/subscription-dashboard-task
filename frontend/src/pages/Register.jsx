import React from "react";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { setCredentials } from "../store/authSlice";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Yup validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Register() {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/register", data);
      dispatch(setCredentials(res.data));
      nav("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Register failed");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ maxWidth: 380, mx: "auto" }}>
        <Typography variant="h5" textAlign={"center"}>
          REGISTER
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Name"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ mt: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              display: "block",
              mt: 4,
              backgroundColor: "#6B46C1",
              "&:hover": { backgroundColor: "#553C9A" },
              mx: "auto",
            }}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
      </Box>
    </Container>
  );
}
