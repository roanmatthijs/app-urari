# App Urari

This project is a Node.js Express server with a front‑end that interacts with the Gemini API to generate custom wishes. Jest is used for unit testing the DOM helpers.

## Installation

1. Install [Node.js](https://nodejs.org/) (version 18 or newer).
2. Clone this repository and install dependencies:

```bash
npm install
```

A `package-lock.json` is committed so installs are reproducible.

## API Key

The application uses the Gemini API. Copy your API key to a `.env` file in the project root:

```bash
GEMINI_API_KEY=your_key_here
```

## Running the server

Start the development server with:

```bash
node server.js
```

It will listen on the port specified by the `PORT` environment variable (default `3000`).

## Running tests

Jest is used for testing. Run all tests with:

```bash
npm test
```

