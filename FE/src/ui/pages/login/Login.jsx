import React, { useState } from "react";
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  Button,
  Link,
  Typography,
  Stack,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { GENERATE_QRCODE, LOGIN, VERIFY_TWOFA } from "./mutation";
import { useNavigate } from "react-router";
import { useAuth } from "../../component/context/authContext";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();

  const navigate = useNavigate();
  const { setAuthToken } = useAuth();

  const [secretKey, setSecretKey] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [code, setCode] = useState("");

  const [LoginUser] = useMutation(LOGIN);
  const [generateQrCode] = useMutation(GENERATE_QRCODE);
  const [verifyTwoFa] = useMutation(VERIFY_TWOFA);

  const formSubmit = (data) => {
    console.log("🚀 ~ formSubmit ~ data:", data);
    LoginUser({
      variables: {
        input: { ...data },
      },
    })
      .then((res) => {
        // console.log("🚀 ~ formSubmit ~ res:", res);
        const token = res?.data?.loginUser?.token;
        if (token) {
          setAuthToken(token);
          navigate("/");
        }
      })
      .catch((error) => {
        console.log("🚀 ~ formSubmit ~ error:", error);
      });
  };

  const handleTWOFA = (e) => {
    e.preventDefault();
    const email = getValues("email");
    console.log("🚀 ~ handleOTP ~ email:", email);
    generateQrCode({
      variables: {
        email,
      },
    })
      .then((res) => {
        console.log("🚀 ~ handleOTP ~ res:", res?.data?.generateTwoFASecret);
        setSecretKey(res?.data?.generateTwoFASecret?.secret);
        setQrCode(res?.data?.generateTwoFASecret?.qrCode);
      })
      .catch((error) => {
        console.log("🚀 ~ handleOTP ~ error:", error);
      });
  };

  const verifyQRCode = (e) => {
    e.preventDefault();
    const email = getValues("email");
    verifyTwoFa({
      variables: {
        email,
        secretKey,
        code,
      },
    })
      .then((res) => {
        console.log("🚀 ~ verifyQRCode ~ res:", res);
      })
      .catch((error) => {
        console.log("🚀 ~ verifyQRCode ~ error:", error);
      });
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
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
          Login
        </Typography>
        <form action="#" method="POST" onSubmit={handleSubmit(formSubmit)}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="enter your email"
              {...register("email", {
                required: "email is required",
              })}
            />
            <span className="block w-full text-red-500 tetx-center">
              {errors?.email?.message}
            </span>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="enter your password"
              {...register("password", {
                required: "password is required",
              })}
            />
            <span className="block w-full text-red-500 tetx-center">
              {errors?.password?.message}
            </span>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
          >
            Log in
          </Button>
        </form>
        <Typography>
          Don't have an account?{" "}
          <Link href="/signup" underline="hover">
            Sign up
          </Link>
        </Typography>

        <Stack>
          {" "}
          <Button type="submit" underline="hover" onClick={handleTWOFA}>
            Login with TWO factor Authentication
          </Button>
          {qrCode && (
            <>
              <Stack justifyContent="center" alignItems="center">
                <img src={qrCode} alt="QR Code" width="122" />
              </Stack>
              <Alert severity="warning">
                <Typography variant="h6">{secretKey}</Typography>
                <Typography>
                  If you're having trouble using the QR code, select manual
                  entry on your app.
                </Typography>
              </Alert>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Input
                  type="number"
                  placeholder="Enter authentication code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={verifyQRCode}
              >
                Complete
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Container>
  );
};

export default Login;
