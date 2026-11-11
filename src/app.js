import express from "express";
import cors from "cors";

import estoqueRoute from "./route/estoqueRoute.js";

const app = express();
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => res.json({ ok: true, api: "Estoque API" }));

app.use("/estoque",estoqueRoute)

export default app;