const conn = require("../db/connection"); // Ensure this is correctly configured
const { v4: uuidv4 } = require("uuid");

const agreements = async (req, res) => {
    try {
        const {
            effectiveDate,
            founderName,
            founderAddress,
            founderEmail,
            collaboratorName,
            collaboratorAddress,
            collaboratorEmail,
            projectTitle,
            projectDescription,
            founderResponsibilities,
            collaboratorResponsibilities,
            equityPercentage,
            vestingSchedule,
            terminationNotice,
            founderSignature,
            founderDate,
            collaboratorSignature,
            collaboratorDate,
        } = req.body;

        const agreementId = uuidv4();

        // Ensure conn.query exists
        if (!conn.query) {
            throw new Error("Database connection is not properly set up.");
        }

        // Execute the query
        conn.query(
            `INSERT INTO agreements (
                id, effectiveDate, founderName, founderAddress, founderEmail, collaboratorName,
                collaboratorAddress, collaboratorEmail, projectTitle, projectDescription,
                founderResponsibilities, collaboratorResponsibilities, equityPercentage,
                vestingSchedule, terminationNotice, founderSignature, founderDate,
                collaboratorSignature, collaboratorDate
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                agreementId,
                effectiveDate,
                founderName,
                founderAddress,
                founderEmail,
                collaboratorName,
                collaboratorAddress,
                collaboratorEmail,
                projectTitle,
                projectDescription,
                founderResponsibilities,
                collaboratorResponsibilities,
                equityPercentage,
                vestingSchedule,
                terminationNotice,
                founderSignature,
                founderDate,
                collaboratorSignature,
                collaboratorDate,
            ],
            (error, results) => {
                if (error) {
                    console.error("Error inserting agreement:", error);
                    return res.status(500).json({ success: false, message: "Internal server error" });
                }

                res.status(200).json({ success: true, agreementId, insertId: results.insertId });
            }
        );
    } catch (error) {
        console.error("Error inserting agreement:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { agreements };