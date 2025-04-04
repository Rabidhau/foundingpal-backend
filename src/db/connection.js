const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

con.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    throw err;
  }
  console.log("Connected to MySQL");

  // Create database if it doesn't exist
  con.query("CREATE DATABASE IF NOT EXISTS FoundingPals", (err) => {
    if (err) {
      console.error("Error creating database:", err);
      throw err;
    }
    console.log('Database "FoundingPals" created or exists');

    // Switch to the new database
    con.query("USE FoundingPals", (err) => {
      if (err) {
        console.error("Error using database:", err);
        throw err;
      }
      console.log('Using database "FoundingPals"');

      // 1. Create Users table
      con.query(
        `CREATE TABLE IF NOT EXISTS Users (
          userId VARCHAR(100) NOT NULL PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(255) NOT NULL,
          profile_image VARCHAR(255),
          bio TEXT,
          qualifications TEXT,
          token VARCHAR(255) NOT NULL
        )`,
        (err) => {
          if (err) {
            console.error("Error creating Users table:", err);
            throw err;
          }
          console.log('Table "Users" created or exists');

          // 2. Create idealisting table
          con.query(
            `CREATE TABLE IF NOT EXISTS idealisting (
              id VARCHAR(255) NOT NULL PRIMARY KEY,
              ideaTitle VARCHAR(255) NOT NULL,
              ideaInfo TEXT NOT NULL,
              ideaType VARCHAR(255) NOT NULL,
              ideaStage VARCHAR(255) NOT NULL,
              requirements VARCHAR(255) NOT NULL,
              equity VARCHAR(255) NOT NULL,
              status VARCHAR(255) NOT NULL
            )`,
            (err) => {
              if (err) {
                console.error("Error creating idealisting table:", err);
                throw err;
              }
              console.log('Table "idealisting" created or exists');

              // 3. Create founder_info table
              con.query(
                `CREATE TABLE IF NOT EXISTS founder_info (
                  id VARCHAR(255) NOT NULL PRIMARY KEY,
                  name VARCHAR(255) NOT NULL,
                  email VARCHAR(255)
                )`,
                (err) => {
                  if (err) {
                    console.error("Error creating founder_info table:", err);
                    throw err;
                  }
                  console.log('Table "founder_info" created or exists');

                  // 4. Create talent_info table
                  con.query(
                    `CREATE TABLE IF NOT EXISTS talent_info (
                      id VARCHAR(255) NOT NULL PRIMARY KEY,
                      name VARCHAR(255) NOT NULL,
                      email VARCHAR(255),
                      status BOOLEAN,
                      bio TEXT,
                      qualifications TEXT
                    )`,
                    (err) => {
                      if (err) {
                        console.error("Error creating talent_info table:", err);
                        throw err;
                      }
                      console.log('Table "talent_info" created or exists');

                      // 5. Create applied_idea table (composite primary key)
                      con.query(
                        `CREATE TABLE IF NOT EXISTS applied_idea (
                          ideaID VARCHAR(255) NOT NULL,
                          talentID VARCHAR(255) NOT NULL,
                          PRIMARY KEY (ideaID, talentID)
                        )`,
                        (err) => {
                          if (err) {
                            console.error("Error creating applied_idea table:", err);
                            throw err;
                          }
                          console.log('Table "applied_idea" created or exists');

                          // 6. Create user_friends table (composite primary key)
                          con.query(
                            `CREATE TABLE IF NOT EXISTS user_friends (
                              userId VARCHAR(255) NOT NULL,  
                              friendId VARCHAR(255) NOT NULL,
                              PRIMARY KEY (userId, friendId)
                            )`,
                            (err) => {
                              if (err) {
                                console.error("Error creating user_friends table:", err);
                                throw err;
                              }
                              console.log('Table "user_friends" created or exists');

                              // 7. Create accepted_idea table
                              con.query(
                                `CREATE TABLE IF NOT EXISTS accepted_idea (
                                  ideaId VARCHAR(255),
                                  talentId VARCHAR(255),
                                  status BOOLEAN,
                                  rejectionReason TEXT
                                )`,
                                (err) => {
                                  if (err) {
                                    console.error("Error creating accepted_idea table:", err);
                                    throw err;
                                  }
                                  console.log('Table "accepted_idea" created or exists');

                                  // 8. Create paymentintegration table
                                  con.query(
                                    `CREATE TABLE IF NOT EXISTS paymentintegration (
                                      PaymentId VARCHAR(255) PRIMARY KEY,
                                      username VARCHAR(255),
                                      email VARCHAR(255),
                                      address VARCHAR(20),
                                      task TEXT,
                                      payment VARCHAR(50),
                                      amount VARCHAR(255),
                                      status VARCHAR(50) DEFAULT 'Pending'
                                    )`,
                                    (err) => {
                                      if (err) {
                                        console.error("Error creating PaymentIntegration table:", err);
                                        throw err;
                                      }
                                      console.log('Table "PaymentIntegration" created or exists');

                                      // 9. Create agreements table
                                      con.query(
                                        `CREATE TABLE IF NOT EXISTS agreements (
                                          id VARCHAR(255) PRIMARY KEY,
                                          effectiveDate VARCHAR(255),
                                          founderName VARCHAR(255),
                                          founderAddress VARCHAR(255),
                                          founderEmail VARCHAR(255),
                                          collaboratorName VARCHAR(255),
                                          collaboratorAddress VARCHAR(255),
                                          collaboratorEmail VARCHAR(255),
                                          projectTitle VARCHAR(255),
                                          projectDescription TEXT,
                                          founderResponsibilities TEXT,
                                          collaboratorResponsibilities TEXT,
                                          equityPercentage VARCHAR(255),
                                          vestingSchedule VARCHAR(255),
                                          terminationNotice VARCHAR(255),
                                          founderSignature TEXT,
                                          founderDate VARCHAR(255),
                                          collaboratorSignature TEXT,
                                          collaboratorDate VARCHAR(255),
                                          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                                        )`,
                                        (err) => {
                                          if (err) {
                                            console.error("Error creating agreements table:", err);
                                            throw err;
                                          }
                                          console.log('Table "agreements" created or exists');

                                          // 10. Create chat_rooms table (must be created before messages)
                                          con.query(
                                            `CREATE TABLE IF NOT EXISTS chat_rooms (
                                              id INT AUTO_INCREMENT PRIMARY KEY,
                                              roomId VARCHAR(255) NOT NULL UNIQUE,
                                              user1 VARCHAR(255) NOT NULL,
                                              user2 VARCHAR(255) NOT NULL,
                                              createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                              FOREIGN KEY (user1) REFERENCES Users(userId) ON DELETE CASCADE,
                                              FOREIGN KEY (user2) REFERENCES Users(userId) ON DELETE CASCADE
                                            )`,
                                            (err) => {
                                              if (err) {
                                                console.error("Error creating chat_rooms table:", err);
                                                throw err;
                                              }
                                              console.log('Table "chat_rooms" created or exists');

                                              // 11. Create messages table (depends on chat_rooms and Users)
                                              con.query(
                                                `CREATE TABLE IF NOT EXISTS messages (
                                                  id VARCHAR(255) PRIMARY KEY,
                                                  roomId VARCHAR(255) NOT NULL,
                                                  sender VARCHAR(255) NOT NULL,
                                                  receiver VARCHAR(255) NOT NULL,
                                                  message TEXT NOT NULL,
                                                  readAt DATETIME DEFAULT NULL,
                                                  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                  FOREIGN KEY (roomId) REFERENCES chat_rooms(roomId) ON DELETE CASCADE,
                                                  FOREIGN KEY (sender) REFERENCES Users(userId) ON DELETE CASCADE,
                                                  FOREIGN KEY (receiver) REFERENCES Users(userId) ON DELETE CASCADE
                                                )`,
                                                (err) => {
                                                  if (err) {
                                                    console.error("Error creating messages table:", err);
                                                    throw err;
                                                  }
                                                  console.log('Table "messages" created or exists');

                                                  // 12. Create notifications table
                                                  con.query(
                                                    `CREATE TABLE  IF NOT EXISTS notifications (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'message',
  roomId VARCHAR(255),
  senderId VARCHAR(255),
  message TEXT,
  isUnread BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (userId),
  INDEX (isUnread)
);`,
                                                    (err) => {
                                                      if (err) {
                                                        console.error("Error creating notifications table:", err);
                                                        throw err;
                                                      }
                                                      console.log('Table "notifications" created or exists');

                                                      console.log("All tables created successfully");
                                                    }
                                                  );
                                                }
                                              );
                                            }
                                          );
                                        }
                                      );
                                    }
                                  );
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
});

module.exports = con;