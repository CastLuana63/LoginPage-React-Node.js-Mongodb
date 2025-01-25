import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

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

app.get("/usuarios", async (req, res) => {
  const users = await prisma.user.findMany();

  res.status(200).json(users);
});

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

app.delete("/usuarios/:id", async (req, res) => {
  await prisma.user.delete({
    where: {
      id: req.params.id,
    },
  });
  res.status(204).json({ menssage: "Deletado com sucesso!" });
});

app.patch("/usuarios/:id", async (req, res) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });

  res.status(200).json(updatedUser);
});

app.listen(3050);
