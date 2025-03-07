const conn = require("../db/connection");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid"); // Import UUID library

// Esewa Secret Key for Testing
const secretKey = "8gBm/:&EnhH.1/q";

// Function to generate HMAC-SHA256 signature
function generateSignature(message, secretKey) {
    return crypto.createHmac("sha256", secretKey)
        .update(message)
        .digest("base64");
}

// Controller function for creating a payment
const Payment = (req, res) => {
    const { total, email, name, address, title } = req.body;
    const transaction_uuid = uuidv4(); // Generate a unique ID inside the function

    // Insert order into MySQL
    const sql = "INSERT INTO paymentintegration (PaymentId, username, email, address, task,amount, payment) VALUES (?,?, ?, ?, ?, ?, 'Esewa')";
    
    conn.query(sql, [transaction_uuid, name, email, address, title,total], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database error", details: err.sqlMessage });
        }
    
        const message = `total_amount=${total},transaction_uuid=${transaction_uuid},product_code=EPAYTEST`;
        const signature = generateSignature(message, secretKey);
    
        const formData = {
            "amount": total,
            "failure_url": "https://google.com",
            "product_delivery_charge": "0",
            "product_service_charge": "0",
            "product_code": "EPAYTEST",
            "signature": signature,
            "signed_field_names": "total_amount,transaction_uuid,product_code",
            "success_url": `http://localhost:5173/success?transaction_uuid=${transaction_uuid}`,  // Pass transaction_uuid
            "tax_amount": "0",
            "total_amount": total,
            "transaction_uuid": transaction_uuid
        };
    
        res.json(formData);
    });
};


module.exports = { Payment };