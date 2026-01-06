# Droptext 💧

Droptext is a high-performance, privacy-focused text sharing application. It utilizes a **Zero-Knowledge architecture** where data is encrypted on the client-side before ever reaching the server.

**Repository:** [github.com/codemaestro64/droptext](https://github.com/codemaestro64/droptext)

---

## 🏗️ Monorepo Structure

This project is managed as a monorepo using **Turborepo** for optimized caching and task execution.

### Applications (`apps/`)
* **frontend**: React + Vite application handling client-side AES-GCM encryption.
* **server**: Fastify backend for storing and retrieving encrypted text blobs.

### Shared Packages (`packages/`)
* **db-schema**: Shared database models and migration files.
* **config**: Shared application configurations and environment logic.
* **typescript-config**: Shared base TypeScript configurations.
* **eslint-config**: Standardized linting rules for the entire repo.

---

## 🔐 Security Model

Droptext ensures that the server operator can never read your notes:

1. **Client-Side Encryption**: Text is encrypted in the browser using the Web Crypto API.
2. **The "Zero-Knowledge" Link**: The decryption key is stored in the URL hash fragment (e.g., `droptext.io/v/123#<key>`).
3. **Privacy**: Browsers do not send the hash fragment to the server, so the decryption key never leaves your device.

---

## 🛠️ Development

### Prerequisites
* Node.js (v18 or higher)
* pnpm (`npm install -g pnpm`)

### Installation

1. Clone the repository:
   `git clone https://github.com/codemaestro64/droptext.git`
   `cd droptext`

2. Install dependencies:
   `pnpm install`

### Running Locally

To start all applications (frontend and server) simultaneously:

`pnpm dev`

* **Frontend**: http://localhost:5173
* **Server**: http://localhost:3000

To run only a specific app:
`pnpm turbo run dev --filter=frontend`

---

## 🏗️ Build for Production

### 1. Build the Monorepo
To compile all packages and applications:

`pnpm build`

Turborepo will build dependencies in the correct order, ensuring `db-schema` and `config` are ready before the apps are built.

### 2. Deployment

#### Frontend
Deploy the contents of `apps/frontend/dist` to any static hosting provider (Vercel, Cloudflare Pages, etc.).

#### Server
The Fastify server requires a Node.js runtime.
1. Navigate to the server: `cd apps/server`
2. Start the production build: `pnpm start`

---

## 🧪 Commands

| Command | Description |
| :--- | :--- |
| pnpm build | Builds all apps and packages |
| pnpm dev | Starts development servers |
| pnpm lint | Runs ESLint across the monorepo |
| pnpm clean | Removes build artifacts and node_modules |

---

## 📄 License
Distributed under the MIT License.