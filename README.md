# bookngo-user-fe

BookNGo user-facing frontend (Next.js).

## Local development

```bash
npm install
npm run start:user-frontend
```

Open `http://localhost:3002`.

## Environment variables

- `NEXT_PUBLIC_API_BASE_URL` (required): `https://bookngo-backend-pqx1.onrender.com`
- `NEXT_PUBLIC_MAPBOX_TOKEN` (optional, required for maps)
- `RESEND_API_KEY` (optional, only if enabling contact email)
- `CONTACT_EMAIL` (optional)

## Health check

- `GET /api/health`
