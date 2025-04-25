const conn = require("../db/connection");
const { v4: uuidv4 } = require("uuid");

const agreements = async (req, res) => {
    try {
        const {
            userId,
            Id,
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
        const roomId = uuidv4(); // Assuming each agreement creates a new conversation room
        const notificationId = uuidv4();

        // You could customize this message
        const message = `New agreement created for project: ${projectTitle}`;

        // Insert the agreement
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

                // Insert the notification after successful agreement insert
                const notificationQuery = `
                    INSERT INTO notifications (id, userId, type, roomId, senderId, message)
                    VALUES (?, ?, 'contract', ?, ?, ?)
                `;
                conn.query(notificationQuery, [notificationId, Id, roomId, userId, message], (notifErr) => {
                    if (notifErr) {
                        console.error("Notification insert error:", notifErr);
                        return res.status(500).json({ success: false, message: "Error creating notification" });
                    }

                    return res.status(200).json({
                        success: true,
                        agreementId,
                        insertId: results.insertId,
                        notificationId,
                        roomId
                    });
                });
            }
        );
    } catch (error) {
        console.error("Unexpected error inserting agreement:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { agreements };