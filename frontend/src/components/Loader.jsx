import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import "./Loader.css";

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 2000); 
    return () => clearTimeout(timer); 
  }, []);

  if (!loading) return null; 

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <div className="violet-loader">
        <div></div>
        <div></div>
      </div>
    </Box>
  );
};

export default Loader;
