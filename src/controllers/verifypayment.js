const conn = require("../db/connection");

const verifyEsewaPayment = async (req, res) => {
    const { transaction_uuid, status } = req.body;

    // Validate required fields
    if (!transaction_uuid || !status) {
        return res.status(400).json({ success: false, error: "Missing transaction UUID or status" });
    }

    // Check if the transaction UUID corresponds to a valid PaymentId
    const sql = "SELECT * FROM paymentintegration WHERE PaymentId = ?";
    conn.query(sql, [transaction_uuid], (err, results) => {
        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ success: false, error: "Database query failed", details: err.message });
        }

        if (results.length === 0) {
            console.error("Transaction ID not found:", transaction_uuid);
            return res.status(404).json({ success: false, error: `Transaction ID not found: ${transaction_uuid}` });
        }

        const currentStatus = results[0].status;

        // Check if the current status is "Pending"
        if (currentStatus !== 'Pending') {
            return res.status(400).json({ success: false, error: `Transaction already processed or in a non-pending state: ${currentStatus}` });
        }

        // If found and status is "Pending", update the status
        const updateSQL = "UPDATE paymentintegration SET status = ? WHERE PaymentId = ?";
        conn.query(updateSQL, [status, transaction_uuid], (err, result) => {
            if (err) {
                console.error("Database Update Error:", err);
                return res.status(500).json({ success: false, error: "Failed to update payment status", details: err.message });
            }

            // Return success response
            return res.status(200).json({ success: true, message: "Payment verified successfully" });
        });
    });
};

module.exports = { verifyEsewaPayment };