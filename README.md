
# VynixC Payment API – Kainure Integration
A lightweight and customizable payment API for the **Kainure** framework, designed to simplify in‑game product handling using MySQL.

---

## 📦 Installation

Place `VynixC.js` inside:

```
Kainure/includes/
```

Then inside that same folder, run:

```bash
npm install
```

Done — the API is ready to use.

---

## 🧩 Usage

### Connect to MySQL
```js
import { vynixc_connectDB } from "./VynixC.js";

await vynixc_connectDB({
    host: "localhost",
    user: "root",
    password: "",
    database: "gamemode_db"
});
```

### Register Custom Logic
```js
import { vynixc_registerLogic } from "./VynixC.js";

vynixc_registerLogic({
    onDeliver: async (purchase) => {
        console.log("Delivering:", purchase.product_id);
    }
});
```

### Add Product
```js
await vynixc_addProduct({ name: "VIP Gold", price: 25 });
```

### Create Purchase
```js
await vynixc_createPurchase(userId, productId);
```

### Check Purchase
```js
await vynixc_checkPurchase(purchaseId);
```

### Deliver Purchase
```js
await vynixc_deliver(purchaseId);
```

---

## 📄 License
MIT — Developed by **VynixC**.
