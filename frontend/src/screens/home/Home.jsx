import React, { useEffect, useRef, useState } from "react";
import "./home.css";
import api from "../../services/api.js";

import { AiFillDelete } from "react-icons/ai";

function Home() {
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

  let [users, setUsers] = useState([]);
  const inputId = useRef();
  const inputEmail = useRef();
  const inputName = useRef();
  const inputPassword = useRef();

  async function getUsers() {
    const apiUsers = await api.get("/usuarios");

    setUsers(apiUsers.data);
  }

  useEffect(() => {
    getUsers();
  }, []);

  async function deleteUsers(id) {
    await api.delete(`/usuarios/${id}`);

    alert("Dados Alterados com Sucesso!!");
  }

  async function putUsers(id) {
    await api.put(`/usuarios/${id}`, {
      email: inputEmail.current.value,
      name: inputName.current.value,
      password: inputPassword.current.value,
    });

    alert("Dados Alterados com Sucesso!!");
    console.log("Dados Alterados com Sucesso!!");
  }

  return (
    <div className="conteiner">
      <div className="card2">
        <h1>Change Infos</h1>
        <div className="form-box2">
          <input name="id" type="text" placeholder="ID" ref={inputId} />
        </div>
        <div className="form-box2">
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            ref={inputEmail}
          />
        </div>
        <div className="form-box2">
          <input name="name" type="text" placeholder="Name" ref={inputName} />
        </div>
        <div className="form-box2">
          <input
            name="password"
            type="password"
            placeholder="Password"
            ref={inputPassword}
          />
          <i className="bxs-lock-alt" onClick={togglePasswordVisibility}></i>
        </div>

        <button
          type="button"
          className="btn"
          onClick={() => putUsers(inputId.current.value)}
        >
          Edit
        </button>
      </div>

      <div className="boxinfos">
        {users.map((user) => (
          <div className="box" key={user.id}>
            <div className="box-item">
              <p>
                <span>Id:</span> {user.id}
              </p>
              <p>
                <span>Name:</span> {user.name}
              </p>
              <p>
                <span>E-mail:</span> {user.email}
              </p>
              <p>
                <span>Password:</span> {user.password}
              </p>
            </div>
            <button className="delete" onClick={() => deleteUsers(user.id)}>
              <AiFillDelete className="icon" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
