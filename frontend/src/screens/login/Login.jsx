import React, { useState, useRef } from "react";
import "../../../src/index.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
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

  const inputId = useRef();
  const inputNameC = useRef();
  const inputEmailC = useRef();
  const inputPasswordC = useRef();

  async function createUsers() {
    await api.post("/usuarios", {
      name: inputNameC.current.value,
      email: inputEmailC.current.value,
      password: inputPasswordC.current.value,
    });
    alert("Conta Criada Com Sucesso!!!");
  }

  async function resetPassword(id) {
    await api.patch(`/usuarios/${id}`, {
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
            <input name="email" type="email" placeholder="E-mail" />
          </div>
          <div className="form-box">
            <input name="password" type="password" placeholder="Password" />
            <i className="bxs-lock-alt" onClick={togglePasswordVisibility}></i>
          </div>
          <div className="about-box">
            <a
              onClick={() => setView("password")}
              role="button"
              style={{ cursor: "pointer" }}
            >
              Forgot E-mail?
            </a>
            <a
              onClick={() => setView("password")}
              role="button"
              style={{ cursor: "pointer" }}
            >
              Forgot Password?
            </a>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => navigate("/home")}
          >
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
          <button type="button" className="btn" onClick={createUsers}>
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
            <input name="id" type="text" placeholder="Id" ref={inputId} />
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
              resetPassword(inputId.current.value), setView("login");
            }}
          >
            Reset
          </button>
          <button className="btnBack" onClick={() => setView("login")}>
            <AiOutlineArrowLeft />
          </button>
        </div>
      )}
      <div class="fonte">
        <button>
          <IoIosAlert color="red" className="i" />
        </button>
        <div class="box-fonte">
          <div class="fonte-item">
            <p>Aviso Importante</p>
          </div>
          <div class="fonte-item">
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
