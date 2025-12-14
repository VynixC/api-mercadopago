
// VynixC.js - Payment API for Kainure
// Fully modular, lightweight, customizable

import mysql from "mysql2/promise";

let pool = null;
let customLogic = {};

export async function vynixc_connectDB(config) {
    try {
        pool = mysql.createPool(config);
        await pool.getConnection();
        console.log("[VynixC PaymentAPI] Successfully connected to MySQL.");
        return { success: true };
    } catch (err) {
        console.error("[VynixC PaymentAPI] Failed to connect:", err);
        return { success: false, message: err.message };
    }
}

function db() {
    if (!pool)
        throw new Error("[VynixC PaymentAPI] Database not connected. Call vynixc_connectDB first.");
    return pool;
}

export function vynixc_registerLogic(logicObject) {
    customLogic = logicObject || {};
    console.log("[VynixC PaymentAPI] Custom logic registered.");
    return { success: true };
}

export async function vynixc_addProduct(productData) {
    try {
        if (!productData || typeof productData !== "object")
            return { success: false, message: "Invalid productData." };

        const database = db();
        const [result] = await database.query("INSERT INTO products SET ?", productData);

        return { success: true, productId: result.insertId };
    } catch (err) {
        console.error("[VynixC PaymentAPI] Add product error:", err);
        return { success: false, message: err.message };
    }
}

export async function vynixc_createPurchase(userId, productId) {
    try {
        if (!userId || !productId)
            return { success: false, message: "Missing userId or productId." };

        const database = db();
        const [result] = await database.query(
            "INSERT INTO purchases (user_id, product_id, status) VALUES (?, ?, 'pending')",
            [userId, productId]
        );

        return { success: true, purchaseId: result.insertId };
    } catch (err) {
        console.error("[VynixC PaymentAPI] Create purchase error:", err);
        return { success: false, message: err.message };
    }
}

export async function vynixc_checkPurchase(purchaseId) {
    try {
        const database = db();
        const [rows] = await database.query("SELECT * FROM purchases WHERE id = ?", [purchaseId]);

        if (rows.length === 0)
            return { success: false, exists: false, message: "Purchase not found." };

        return { success: true, exists: true, data: rows[0] };
    } catch (err) {
        console.error("[VynixC PaymentAPI] Check purchase error:", err);
        return { success: false, message: err.message };
    }
}

export async function vynixc_deliver(purchaseId) {
    try {
        const database = db();
        const [rows] = await database.query("SELECT * FROM purchases WHERE id = ?", [purchaseId]);

        if (rows.length === 0)
            return { success: false, message: "Purchase not found." };

        const purchase = rows[0];

        if (customLogic.onDeliver) {
            try {
                await customLogic.onDeliver(purchase);
            } catch (err) {
                console.error("[VynixC PaymentAPI] Custom logic error:", err);
            }
        }

        await database.query("UPDATE purchases SET status='delivered' WHERE id=?", [purchaseId]);

        return { success: true, purchase };
    } catch (err) {
        console.error("[VynixC PaymentAPI] Deliver error:", err);
        return { success: false, message: err.message };
    }
}
