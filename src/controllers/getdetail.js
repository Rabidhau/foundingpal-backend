const conn = require("../db/connection");

const get_detail = async (req, res) => {
    const { id } = req.params;

    console.log("🛠 Incoming API Request for Agreement ID:", id); // Debugging log

    if (!id) {
        return res.status(400).json({ success: false, message: "Invalid agreement ID" });
    }

    try {
        const sql = `SELECT * FROM agreements WHERE id = ?`;

        console.log("🔍 Executing Query:", sql, "with ID:", id);

        conn.query(sql, [id], (err, results) => {
            if (err) {
                console.error("❌ Database Error:", err);
                return res.status(500).json({ success: false, message: "Database error" });
            }

            console.log("✅ Query Result:", results);

            if (results.length === 0) {
                return res.status(404).json({ success: false, message: "No agreements found" });
            }

            res.status(200).json({ success: true, agreement: results[0] });
        });
    } catch (error) {
        console.error("🔥 Server Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { get_detail };