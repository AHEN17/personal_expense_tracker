Personal Expense Tracker API
Overview
This API allows users to log, view, and analyze their daily expenses. It provides endpoints to add expenses, view summaries, and analyze spending patterns.

Features
Add a new expense with category, amount, and date.
Retrieve a list of expenses filtered by category or date range.
Get weekly or monthly spending summaries.

Installation
Prerequisites
Node.js (v14 or higher)
npm

API Endpoints
1. Add an Expense
POST /expenses
Request body example:
{
  "category": "Food",
  "amount": 50,
  "date": "2024-12-01"
}
Response body:
{
  "message": "Expense added successfully",
  "expense": {
    "id": 1,
    "category": "Food",
    "amount": 50,
    "date": "2024-12-01"
  }
}



2. Retrieve Expenses
GET /expenses

Query Parameters:
category (optional): Filter by category.
startDate (optional): Start date (YYYY-MM-DD).
endDate (optional): End date (YYYY-MM-DD).

Response:
  {
        "id": 1,
        "category": "Food",
        "amount": 50,
        "date": "2024-12-01T00:00:00.000Z"
    }

3. Get Spending Summary
GET /expenses/summary

Query Parameter:
period: Specify weekly or monthly.
Response:
{
  "total": 100,
  "categories": {
    "Food": 50,
    "Transport": 50
  }
}

