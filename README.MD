<!-- Package installation -->
npm i 

<!-- To run the application -->
nodemon app


<!-- DATABASES -->
Create a database name called jobgenie

<!-- Run this command to create -->
CREATE TABLE JobListing (
    id VARCHAR(255) PRIMARY KEY,
    companyName VARCHAR(255),
    jobTitle VARCHAR(255),
    location VARCHAR(255),
    emailAddress VARCHAR(255),
    requirement1 VARCHAR(255),
    requirement2 VARCHAR(255),
    requirement3 VARCHAR(255),
    requirement4 VARCHAR(255),
    jobDetails VARCHAR(255),
    submitBy VARCHAR(255),
    category VARCHAR(255)
);

<!-- applied_job -->

CREATE TABLE applied_job (
    jobID VARCHAR(255) PRIMARY KEY,
    candidateID TEXT
);