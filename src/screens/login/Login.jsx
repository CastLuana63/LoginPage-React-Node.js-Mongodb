import React, { useState, useRef } from "react";
import "../../../src/index.css";
import api from "../../services/api";
import bcrypt from "bcryptjs";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { IoIosAlert } from "react-icons/io";


function Login() {
  const [view, setView] = useState("login");
  const navigate = useNavigate();

  const togglePasswordVisibility = (e) => {
    const inputPass = e.target.previousSibling;
    if (inputPass.type === "password") {
      inputPass.type = "text";
      e.target.classList.replace("bxs-lock-alt", "bxs-lock-open-alt");
    } else {
      inputPass.type = "password";
      e.target.classList.replace("bxs-lock-open-alt", "bxs-lock-alt");
    }
  };

  const inputNameC = useRef();
  const inputEmailC = useRef();
  const inputPasswordC = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function userLogin() {
    try {
      const response = await api.post("/login", { email, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Armazena o token
        alert("Login bem-sucedido!");
        navigate("/home"); // Redireciona para a Home
      } else {
        alert("Erro ao fazer login: " + response.data.message);
      }
    } catch (error) {
      alert("Erro na requisição!");
    }
  }

  async function createUsers() {
    const password = inputPasswordC.current.value;
    const PassCrypt = await bcrypt.hash(password, 10);
    await api.post("/usuarios", {
      name: inputNameC.current.value,
      email: inputEmailC.current.value,
      password: PassCrypt,
    });
    alert("Conta Criada Com Sucesso!!!");
  }

  async function resetPassword(email) {
    await api.patch(`/usuarios/${email}`, {
      password: inputPasswordC.current.value,
    });
    alert("Senha Alterada Com Sucesso!");
  }


  return (
    <div className="conteiner">
      {view === "login" && (
        <div className="card">
          <h1>Login</h1>
          <div className="form-box">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(v) => setEmail(v.target.value)}
            />
          </div>
          <div className="form-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(v) => setPassword(v.target.value)}
            />
          </div>
          <div className="about-box">
            <a
              onClick={() => setView("password")}
              role="button"
              style={{ cursor: "pointer" }}
            ></a>
            <a
              onClick={() => setView("password")}
              role="button"
              style={{ cursor: "pointer" }}
            >
              Forgot Password?
            </a>
          </div>
          <button type="button" className="btn" onClick={userLogin}>
            Login
          </button>
          <div className="create-account">
            <p>
              Don't have an account?
              <a
                onClick={() => {
                  setView("create");
                }}
              >
                Create Account
              </a>
            </p>
          </div>
        </div>
      )}

      {view === "create" && (
        <div className="card">
          <h1>Create Account</h1>
          <div className="form-box">
            <input
              name="name"
              type="text"
              placeholder="UserName"
              ref={inputNameC}
            />
          </div>
          <div className="form-box">
            <input
              name="email"
              type="email"
              placeholder="Email"
              ref={inputEmailC}
            />
          </div>
          <div className="form-box">
            <input
              name="password"
              type="password"
              placeholder="Password"
              ref={inputPasswordC}
            />
          </div>
          <button
            type="button"
            className="btn"
            onClick={async () => {
              await createUsers();
              setView("login");
            }}
          >
            Sign Up
          </button>
          <button className="btnBack" onClick={() => setView("login")}>
            <AiOutlineArrowLeft />
          </button>
        </div>
      )}

      {view === "password" && (
        <div className="card">
          <h1>Reset Password</h1>
          <div className="form-box">
            <input
              name="E-mail"
              type="text"
              placeholder="E-mail"
              ref={inputEmailC}
            />
          </div>
          <div className="form-box">
            <input
              name="password"
              type="password"
              placeholder="New Password"
              ref={inputPasswordC}
            />
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => {
              resetPassword(inputEmailC.current.value), setView("login");
            }}
          >
            Reset
          </button>
          <button className="btnBack" onClick={() => setView("login")}>
            <AiOutlineArrowLeft />
          </button>
        </div>
      )}
      <div className="fonte">
        <IoIosAlert color="red" className="i" />
        <div className="box-fonte">
          <div className="fonte-item">
            <h3>Aviso Importante</h3>
          </div>
          <div className="fonte-item">
            <p>
              <strong>
                Por favor, não insira informações reais ou sensíveis
              </strong>
              (como dados pessoais, bancários ou confidenciais). Todas as
              funcionalidades aqui apresentadas são voltadas para testes e
              demonstrações.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Login;
