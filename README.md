# Code Snippet Web Application

This is a web application that facilitates the submission and display of code snippets. Users can submit their code snippets along with their username, preferred code language, and standard input. The submitted code snippets are displayed in a tabular format on another page.

## Technologies Used

* **Backend:** Express.js, MySQL, Redis
* **Frontend:** Next.js

## Features

* Submit code snippets with username, code language, and standard input.
* Display submitted code snippets in a tabular format.
* Cache code snippets data using Redis.

## Setup Instructions

1. Clone the repository:

```bash
git clone <repository_url>
cd code-snippet-app
```
2. Install dependencies:
```bash
cd backend
npm install

cd ../frontend
npm install
```
3.  Start Servers
```bash
cd backend
npm start

# Start the frontend server
cd ../frontend
npm run dev
```


## API Endpoints

* `POST /submit`: Submit a code snippet.
* `GET /code-snippets`: Get all submitted code snippets.

