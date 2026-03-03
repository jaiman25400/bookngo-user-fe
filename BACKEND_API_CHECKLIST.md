# Backend API Checklist — Why 3rd Resort Might Not Show

The frontend does **not** filter resorts; it displays whatever your backend returns. If you have 3 resorts in the DB but only 2 show on the frontend, the backend (or the data it reads) is returning only 2.

---

## 1. Skiing page (`http://localhost:3002/skiing`)

**Endpoint the frontend calls:**
```http
GET {NEXT_PUBLIC_API_BASE_URL}/user/ski-slopes/skiing-customers
```
Default base URL: `http://localhost:3000` →  
`GET http://localhost:3000/user/ski-slopes/skiing-customers`

**Expected response:** A **JSON array** of objects, one per resort, with these fields:

| Field             | Type   | Required |
|-------------------|--------|----------|
| `name`            | string | Yes      |
| `latitude`        | number | Yes      |
| `longitude`       | number | Yes      |
| `city`            | string | Yes      |
| `customer_image`  | string | Yes      |
| `slug`            | string | Yes      |

**Backend checklist:**
- [ ] The handler for `GET /user/ski-slopes/skiing-customers` reads from the same DB/schema where you see 3 resorts (e.g. `BookNGo_CMS.customers` / `customer_details` / `customer_users`).
- [ ] No extra filter (e.g. `WHERE status = 'active'` or `LIMIT 2`) that would exclude the 3rd resort.
- [ ] All 3 rows are joined correctly (customers ↔ customer_details ↔ customer_users) so none are dropped.
- [ ] Response is a **raw array** `[{...}, {...}, {...}]`, not wrapped in `{ data: [...] }` (the frontend expects the array directly).

**Quick test:**
```bash
curl -s http://localhost:3000/user/ski-slopes/skiing-customers
```
You should see a JSON array with **3** elements. If you see 2, the bug is in the backend query or mapping.

---

## 2. Ontario / region page (`http://localhost:3002/Ontario`)

**Endpoint the frontend calls:**
```http
GET {NEXT_PUBLIC_API_BASE_URL}/user/ski-slopes?region=Ontario
```
→ `GET http://localhost:3000/user/ski-slopes?region=Ontario`

**Expected response:** A **JSON object** (not array):

```json
{
  "region": "Ontario",
  "count": 3,
  "results": [
    {
      "id": 1,
      "customer_display_name": "Resort A",
      "customer_slug": "resort-a",
      "customer_city": "City",
      "home_image_url": "/uploads/..."
    }
  ]
}
```

**Backend checklist:**
- [ ] The handler for `GET /user/ski-slopes?region=...` filters by `region` (e.g. from `customer_details` or equivalent). The 3rd resort must have its **region** set to `"Ontario"` (or whatever value you send; check casing).
- [ ] All 3 resorts are included in the query (no hidden `LIMIT 2`, no extra condition that excludes the 3rd).
- [ ] Response shape is `{ region, count, results }` and `results` is an array of objects with `id`, `customer_display_name`, `customer_slug`, `customer_city`, `home_image_url`.

**Quick test:**
```bash
curl -s "http://localhost:3000/user/ski-slopes?region=Ontario"
```
Check `results.length` and `count`. If they are 2 instead of 3, the backend is not returning the 3rd resort for that region.

---

## 3. Frontend cache

The frontend caches these responses for **60 seconds** (`revalidate: 60`). If the backend was fixed to return 3 resorts:
- Hard-refresh the page (Ctrl+Shift+R or Cmd+Shift+R), or
- Wait up to 60 seconds and refresh again.

---

## 4. Summary

| Page    | Backend endpoint                         | Fix if 3rd missing                          |
|---------|------------------------------------------|---------------------------------------------|
| /skiing | `GET /user/ski-slopes/skiing-customers`  | Ensure query returns all 3; response = array |
| /Ontario| `GET /user/ski-slopes?region=Ontario`   | Ensure 3rd resort has region Ontario; query returns all 3 |

The frontend displays exactly what these two endpoints return; it does not remove or filter the 3rd resort.
