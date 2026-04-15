# 🚀 Project Setup

## 📦 Prerequisites

* Node.js ≥ 18
* pnpm

```bash
npm install -g pnpm
```

* MongoDB (local or cloud)

---

# ⚙️ Backend (Server)

```bash
cd server
pnpm install
```

### Create `.env` in `server/`

Copy from `.env.example` and fill values.

```env
PORT=required_port_number_here
MONGO_URI=your_mongodb_uri_here

ACCESS_SECRET=your_access_token_secret_here
REFRESH_SECRET=your_refresh_token_secret_here

CLIENT_URL=your_client_url_here
```

### Run server

```bash
pnpm dev
```

### Seed database

```bash
pnpm build
node dist/seed.js
```

---

# 🎨 Frontend (Client)

```bash
cd client
pnpm install
```

### Create `.env` in `client/`

```env
VITE_API_URL=your_api_url_here
```

### Run client

```bash
pnpm dev
```

---

# 🌐 App URLs

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend: [http://localhost:5000](http://localhost:5000)

---

# ⚠️ Important

* Make sure MongoDB is running
* Use correct `.env` values
* For deployment (Vercel), add:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

Done ✅
