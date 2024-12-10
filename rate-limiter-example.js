// server.js
const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(bodyParser.json());

// Define rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiter to all requests
app.use(limiter);

let todos = [];

// Create
app.post('/todos', (req, res) => {
  const { title, description } = req.body;
  const todo = { id: Date.now(), title, description };
  todos.push(todo);
  res.status(201).json(todo);
});

// Read
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id, 10));
  if (!todo) return res.status(404).send('Todo not found');
  res.json(todo);
});

// Update
app.put('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id, 10));
  if (!todo) return res.status(404).send('Todo not found');
  todo.title = req.body.title;
  todo.description = req.body.description;
  res.json(todo);
});

// Delete
app.delete('/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id !== parseInt(req.params.id, 10));
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
