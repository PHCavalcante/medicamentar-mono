import * as React from "react";

import Box from "@mui/material/Box";
import { Paper, Stack } from "@mui/material";
import Header from "@components/Header";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import WhiteTextField from "@components/WhiteTextField";
import FormControlLabel from "@mui/material/FormControlLabel";

import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

import axiosInstance from "@utils/axiosInstance";
import { useTheme } from "@constants/theme/useTheme";
import { ContainerUniversal } from "@components/ContainerUniversal";

import handleCapslock from "@utils/handleCapslock";
import handleShowPassword from "@utils/handleShowPassword";

export default function Register() {
  const { login } = useAuth();
  const [error, setError] = React.useState<null | string>(null);
  const [remember, setRemember] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { darkMode } = useTheme();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const name = data.get("name");
    const email = (data.get("email") as string) ?? "";
    const password = (data.get("password") as string) ?? "";
    const confirmPassword = data.get("confirmPassword");

    const emailRegex = /\S+@\S+\.\S+/;
    const specialCharRegex = /^(?=.*[!@#$%^&()_+\-=[\]{};':"\\|,.<>/?]).*$/;

    if (
      name === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      setError("Preencha todos os campos");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Insira um email válido");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas devem ser iguais");
      return;
    }

    if (password.length < 8 || confirmPassword.length < 8) {
      setError("As senhas devem ter pelo menos 8 dígitos");
      return;
    }

    if (!specialCharRegex.test(password)) {
      setError("A senha deve conter pelo menos um caractere especial");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/register", {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      });

      const token = response.data;
      if (token) {
        if (remember) {
          window.electron.store.set("email", email);
          window.electron.store.set("password", password);
        }
        setError(null);
        await login({ token });
      }
      setError(null);

      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Ocorreu um erro no registro"
        );
      } else {
        setError("Ocorreu um erro inesperado");
      }
    }
  };

  const card__wrapper = {
    top: "130px",
    left: "50%",
    display: "flex",
    position: "absolute",
    alignItems: "center",
    p: "0 30px 30px 30px ",
    flexDirection: "column",
    transform: "translateX(-50%)",
    width: { sm: "720px", xs: "95%" },
    transition: "ease-out 300ms margin-top",
    backgroundColor: darkMode ? "primary.dark" : "primary.light",
  };

  return (
    <ContainerUniversal
      sx={{
        backgroundColor: darkMode ? "primary.darker" : "common.white",
        overflowY: "auto",
      }}
    >
      <Header />
      <Paper sx={card__wrapper}>
        <Typography
          sx={{
            my: "50px",
            fontSize: "30px",
            fontWeight: "bold",
            color: "common.white",
          }}
        >
          {"REGISTRE-SE"}
        </Typography>
        <Box component="form" width={"90%"} onSubmit={handleSubmit} noValidate>
          <WhiteTextField
            required
            fullWidth
            id="name"
            name="name"
            label="Nome completo"
            margin="normal"
            autoComplete="name"
          />
          <WhiteTextField
            required
            fullWidth
            id="email"
            name="email"
            label="Email"
            margin="normal"
            autoComplete="email"
          />
          <WhiteTextField
            required
            fullWidth
            label="Senha"
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            margin="normal"
            variant="outlined"
            autoComplete="current-password"
            onKeyDown={(event:React.KeyboardEvent<HTMLInputElement>) => handleCapslock(event, setError)}
          />
          <WhiteTextField
            required
            fullWidth
            label="Confirmar senha"
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            margin="normal"
            variant="outlined"
            autoComplete="current-password"
            onKeyDown={(event:React.KeyboardEvent<HTMLInputElement>) => handleCapslock(event, setError)}
          />
          {error && (
            <Typography sx={{ color: "common.white", textAlign: "center" }}>
              {error}
            </Typography>
          )}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            <FormControlLabel
              label="Lembrar senha"
              sx={{ color: "common.white" }}
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  sx={{ color: "common.white" }}
                  onChange={(e) => setRemember(e.target.checked)}
                />
              }
            />
            <FormControlLabel
              label="Mostrar Senha"
              sx={{ color: "common.white" }}
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  sx={{ color: "common.white" }}
                  onChange={() => handleShowPassword(setShowPassword)}
                />
              }
            />
          </Stack>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mb: 4, py: 1.5, backgroundColor: "#0078B6" }}
          >
            {"CADASTRAR-SE"}
          </Button>
          <Link
            to="/signin"
            style={{
              color: "#0078B6",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            <Typography>Já tem uma conta?</Typography>
          </Link>
        </Box>
      </Paper>
    </ContainerUniversal>
  );
}
