const express = require('express');
const app = express();

const postsRouter = require("./routes/questions");
const authRouter = require("./routes/auth");

const PORT = process.env.PORT || 3006;
const prisma = require("./lib/prisma");

const questionsRouter = require("./routes/questions"); 

// Middleware to parse JSON bodies (will be useful in later steps)
app.use(express.json());

// everything under /api/questions
app.use("/api/questions", questionsRouter);

app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.json({msg: "Not found"});
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

