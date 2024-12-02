// Importing required modules
const express = require('express');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// In-memory storage for expenses
let expenses = [];

// Routes

// 1. Add a new expense
app.post('/expenses', (req, res) => {
  const { category, amount, date } = req.body;

  // Validate input
  if (!category || !amount || !date) {
    return res.status(400).json({ error: "All fields (category, amount, date) are required." });
  }

  // Ensure amount is a valid number and date is a valid ISO date
  if (isNaN(amount) || isNaN(new Date(date).getTime())) {
    return res.status(400).json({ error: "Invalid amount or date format." });
  }

  const expense = {
    id: expenses.length + 1,
    category,
    amount: parseFloat(amount),
    date: new Date(date), // Store date as a Date object
  };

  expenses.push(expense);
  res.status(201).json({ message: "Expense added successfully", expense });
});

// 2. Retrieve a summary of expenses (filter by category or date range)
app.get('/expenses', (req, res) => {
  const { category, startDate, endDate } = req.query;

  let filteredExpenses = expenses;

  // Filter by category if specified
  if (category) {
    filteredExpenses = filteredExpenses.filter((expense) => expense.category === category);
  }

  // Filter by date range if both startDate and endDate are provided
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date range." });
    }

    filteredExpenses = filteredExpenses.filter(
      (expense) => expense.date >= start && expense.date <= end
    );
  }

  res.json(filteredExpenses);
});

// 3. Generate a weekly or monthly summary
app.get('/expenses/summary', (req, res) => {
  const { period } = req.query;

  // Validate period query parameter
  if (!period || (period !== 'weekly' && period !== 'monthly')) {
    return res.status(400).json({ error: "Specify 'weekly' or 'monthly' as the period." });
  }

  const now = new Date();
  let filteredExpenses = expenses;

  // Filter expenses based on the specified period
  if (period === 'weekly') {
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - 7);
    filteredExpenses = filteredExpenses.filter(
      (expense) => expense.date >= startOfWeek
    );
  } else if (period === 'monthly') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    filteredExpenses = filteredExpenses.filter(
      (expense) => expense.date >= startOfMonth
    );
  }

  // Generate summary
  const summary = filteredExpenses.reduce((acc, curr) => {
    acc.total += curr.amount;
    acc.categories[curr.category] = (acc.categories[curr.category] || 0) + curr.amount;
    return acc;
  }, { total: 0, categories: {} });

  res.json(summary);
});

// Starting the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
