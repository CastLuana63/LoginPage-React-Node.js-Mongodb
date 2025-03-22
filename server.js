import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();
const app = express();
app.use(express.json());

//Limita Acesso a API
app.use(cors({ origin: "http://localhost:5173" }));

//Criar usuário
app.post("/usuarios", async (req, res) => {
  await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
  });

  res.status(201).send(req.body);
});

//Fazer Login e gerar Token
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid)
      return res.status(401).json({ message: "Password incorreto!" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "Login bem-sucedido!", token, user });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login", error });
  }
});

//Listar todos os Usuários
app.get("/usuarios", async (req, res) => {
  const users = await prisma.user.findMany();

  res.status(200).json(users);
});

//Atualizar informações de usuário através do ID
app.put("/usuarios/:id", async (req, res) => {
  await prisma.user.update({
    where: {
      id: req.params.id,
    },
    data: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
  });

  res.status(200).send(req.body);
});

//Deletar usuário
app.delete("/usuarios/:id", async (req, res) => {
  await prisma.user.delete({
    where: {
      id: req.params.id,
    },
  });
  res.status(204).json({ menssage: "Deletado com sucesso!" });
});

//Atualizar senha do usuário através do Email
app.patch("/usuarios/:email", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "A senha é obrigatória" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await prisma.user.update({
      where: {
        email: req.params.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({ message: "Senha atualizada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a senha" });
  }
});

//Middleware
const autentificador = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Acesso negado" });

  try {
    const decoded = jwt.verify(token, "minha_chave_secreta");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

app.get("/home", autentificador, (req, res) => {
  res.json({ message: "Bem-vindo à Home!", userId: req.user.id });
});

app.listen(3050);
