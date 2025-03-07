const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

con.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err; // This will stop the script execution
  }
  console.log('Connected to MySQL');

  con.query("CREATE DATABASE IF NOT EXISTS FoundingPals", (err) => {
    if (err) {
      console.error('Error creating database:', err);
      throw err;
    }
    console.log('Database "FoundingPals" created or exists');

    con.query("USE FoundingPals", (err) => {
      if (err) {
        console.error('Error using database:', err);
        throw err;
      }
      console.log('Using database "FoundingPals"');

      // Create the "Users" table if it doesn't exist
      con.query(`CREATE TABLE IF NOT EXISTS Users (
        userId VARCHAR(100) NOT NULL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL
      )`, (err) => {
        if (err) {
          console.error('Error creating Users table:', err);
          throw err;
        }
        console.log('Table "Users" created or exists');

        con.query(`CREATE TABLE IF NOT EXISTS idealisting (
          id VARCHAR(255) NOT NULL PRIMARY KEY,  -- Added PRIMARY KEY
          ideaTitle VARCHAR(255) NOT NULL,
          ideaInfo TEXT NOT NULL,
          ideaType VARCHAR(255) NOT NULL,
          ideaStage VARCHAR(255) NOT NULL,
          requirements VARCHAR(255) NOT NULL,
          equity VARCHAR(255) NOT NULL,
          status VARCHAR(255) NOT NULL
        )`, (err) => {
          if (err) {
            console.error('Error creating idealisting table:', err);
            throw err;
          }
          console.log('Table "idealisting" created or exists');

          con.query(`CREATE TABLE IF NOT EXISTS founder_info (
            id VARCHAR(255) NOT NULL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255)
          )`, (err) => {
            if (err) {
              console.error('Error creating founder_info table:', err); // Corrected table name in error message
              throw err;
            }
            console.log('Table "founder_info" created or exists'); // Corrected table name in log

            con.query(`CREATE TABLE IF NOT EXISTS talent_info (
              id VARCHAR(255) NOT NULL PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              email VARCHAR(255),
              status BOOLEAN
            )`, (err) => {
              if (err) {
                console.error('Error creating talent_info table:', err);
                throw err;
              }
              console.log('Table "talent_info" created or exists');

              con.query(`CREATE TABLE IF NOT EXISTS applied_idea (
                ideaID VARCHAR(255) NOT NULL,  -- Removed PRIMARY KEY.  A talent can apply to multiple ideas.
                talentID VARCHAR(255) NOT NULL, -- Added talentID
                PRIMARY KEY (ideaID, talentID)      -- Composite Primary Key
              )`, (err) => {
                if (err) {
                  console.error('Error creating applied_idea table:', err);
                  throw err;
                }
                console.log('Table "applied_idea" created or exists');

                con.query(`CREATE TABLE IF NOT EXISTS user_friends (
                  userId VARCHAR(255) NOT NULL,  
                  friendId VARCHAR(255) NOT NULL,
                  PRIMARY KEY (userID, friendID)      
                )`, (err) => {
                  if (err) {
                    console.error('Error creating user_friends table:', err);
                    throw err;
                  }
                  console.log('Table "user_friends" created or exists');

                   con.query(`CREATE TABLE IF NOT EXISTS accepted_idea (
                    ideaId VARCHAR(255),
                    talentId VARCHAR(255),
                    status boolean,
                    rejectionReason TEXT
                  )`, (err) => {
                    if (err) {
                      console.error('Error creating accepted_idea table:', err);
                      throw err;
                    }
                    console.log('Table "accepted_idea" created or exists');

                    con.query(`CREATE TABLE IF NOT EXISTS paymentintegration (
                      PaymentId VARCHAR(255) PRIMARY KEY,
                      username VARCHAR(255),
                      email VARCHAR(255),
                      address VARCHAR(20),
                      task TEXT,
                      payment VARCHAR(50),
                      amount VARCHAR(255),
                      status VARCHAR(50) DEFAULT 'Pending'
                )`, (err) => {
                  if (err) {
                      console.error('Error creating PaymentIntegration table:', err);
                      throw err;
                  }
                  console.log('Table "PaymentIntegration" created or already exists');
              

                  con.query(`CREATE TABLE IF NOT EXISTS agreements (
  id VARCHAR(255) PRIMARY KEY,
  effectiveDate VARCHAR(255) ,
  founderName VARCHAR(255) ,
  founderAddress VARCHAR(255),
  founderEmail VARCHAR(255) ,
  collaboratorName VARCHAR(255) ,
  collaboratorAddress VARCHAR(255) ,
  collaboratorEmail VARCHAR(255) ,
  projectTitle VARCHAR(255) ,
  projectDescription TEXT,
  founderResponsibilities TEXT,
  collaboratorResponsibilities TEXT,
  equityPercentage VARCHAR(255),
  vestingSchedule VARCHAR(255),
  terminationNotice VARCHAR(255) ,
  founderSignature TEXT,
  founderDate VARCHAR(255),
  collaboratorSignature TEXT,
  collaboratorDate VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              )`, (err) => {
                if (err) {
                    console.error('Error creating agreements table:', err);
                    throw err;
                }
                console.log('Table "agreements" created or already exists');
            
              });
                });

                  });

                });
              });
            });
          });
        });
      });
    });
  });
});

module.exports = con;