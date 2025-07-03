# Library Management System – Backend

This is the **Backend** for the Library Management System built using **Node.js**, **Express.js**, and **MongoDB**.

## Features

- Book CRUD operations (Create, Read, Update, Delete)
- Borrow books with validation logic
- Borrow summary with aggregation
- Pagination support
- Clean MVC structure
- Consistent error handling

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- CORS
- dotenv

## Project Structure

```
backend/
├── controllers/
│   ├── book.controller.ts
│   └── borrow.controller.ts
├── models/
│   ├── Book.ts
│   └── Borrow.ts
├── config/
│   └── db.ts
├── app.ts
├── server.ts
├── .env
└── package.json
```

## Environment Variables

Create a `.env` file in the root with the following:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/library-management
```

## Installation & Running

```bash
npm install
npm run dev
```

The server will be running at `http://localhost:5000/api/`.

## API Endpoints

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| GET    | /books           | Get paginated list of books |
| GET    | /books/:id       | Get a single book           |
| POST   | /books           | Add a new book              |
| PATCH  | /books/:id       | Update book details         |
| DELETE | /books/:id       | Delete a book               |
| POST   | /borrows/:bookId | Borrow a book               |
| GET    | /borrow-summary  | Aggregated borrow summary   |

## Developer

- Built by Tanzeem Siddique
