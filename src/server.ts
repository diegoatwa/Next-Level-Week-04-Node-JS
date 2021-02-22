import express from "express"

const app = express()

app.get("/", (req, res) => {
  return res.json({ message: `Hello World - NEW04` })
})

app.post("/", (req, res) => {
  return res.json({ message: `Os dados foram salvos com sucesso!` })
})

app.listen(3333, () => console.log(`Server is running!`))