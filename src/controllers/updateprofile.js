const conn = require("../db/connection");

const updateProfile = async (req, res) => {
    const { userId, bio, qualification } = req.body;

    try {
        // First query to update the Users table
        const updateUserQuery =
            "UPDATE Users SET bio = ?, qualification = ? WHERE userId = ?";
        
        // Second query to update the talent_info table
        const updateTalentInfoQuery =
            "UPDATE talent_info SET qualification = ?, bio = ? WHERE id = ?";

        // Start a transaction to ensure both queries run together
        conn.beginTransaction((err) => {
            if (err) {
                console.error("Error starting transaction:", err);
                return res.status(400).send("Error starting transaction");
            }

            // Update the Users table
            conn.query(updateUserQuery, [bio, qualification, userId], (err, result) => {
                if (err) {
                    return conn.rollback(() => {
                        console.error("Error updating Users table:", err);
                        res.status(400).send("Error updating profile in Users table");
                    });
                }

                // Update the talent_info table
                conn.query(updateTalentInfoQuery, [qualification, bio, userId], (err, result) => {
                    if (err) {
                        return conn.rollback(() => {
                            console.error("Error updating talent_info table:", err);
                            res.status(400).send("Error updating profile in talent_info table");
                        });
                    }

                    // Commit the transaction if both queries are successful
                    conn.commit((err) => {
                        if (err) {
                            console.error("Error committing transaction:", err);
                            return conn.rollback(() => {
                                res.status(400).send("Error committing transaction");
                            });
                        }

                        // Send success response
                        res.status(200).send("Profile updated successfully");
                    });
                });
            });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(400).send("Error occurred while processing the request");
    }
};

module.exports = { updateProfile };