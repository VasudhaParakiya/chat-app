import React from "react";
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  TextField,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { SIGNUP } from "./mutation";
import { useNavigate } from "react-router";

const SignUp = () => {
  const navigate = useNavigate();
  const [signup] = useMutation(SIGNUP);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const formSubmit = (data) => {
    // console.log("🚀 ~ formSubmit ~ data:", data);
    signup({
      variables: {
        input: { ...data },
      },
    })
      .then((res) => {
        console.log("🚀 ~ formSubmit ~ res:", res);
        // navigate("/login");
      })
      .catch((error) => {
        console.log("🚀 ~ formSubmit ~ error:", error);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          borderRadius: 1,
          boxShadow: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit(formSubmit)}>
          <TextField
            label="firstName"
            variant="outlined"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
            {...register("firstName", {
              required: "firstName is required",
            })}
          />
          {errors.firstName && (
            <Typography color="error" variant="body2">
              {errors.firstName.message}
            </Typography>
          )}

          <TextField
            label="lastName"
            variant="outlined"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
            {...register("lastName", {
              required: "lastName is required",
            })}
          />
          {errors.lastName && (
            <Typography color="error" variant="body2">
              {errors.lastName.message}
            </Typography>
          )}

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
            {...register("email", {
              required: "email is required",
            })}
          />
          {errors.email && (
            <Typography color="error" variant="body2">
              {errors.email.message}
            </Typography>
          )}

          <TextField
            label="password"
            variant="outlined"
            fullWidth
            type="password"
            sx={{ mt: 2, mb: 2 }}
            {...register("password", {
              required: "password is required",
            })}
          />
          {errors.password && (
            <Typography color="error" variant="body2">
              {errors.password.message}
            </Typography>
          )}

          <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }}>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              row
              {...register("gender", {
                required: "gender is required",
              })}
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
            </RadioGroup>
            {errors.gender && (
              <Typography color="error" variant="body2">
                {errors.gender.message}
              </Typography>
            )}
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mr: 1 }}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => reset()}
            >
              Reset
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default SignUp;
