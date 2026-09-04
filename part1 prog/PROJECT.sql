CREATE DATABASE ContractMonthlyClaimSystem;


USE ContractMonthlyClaimSystem;



-- =========================
-- LECTURER TABLE
-- =========================
CREATE TABLE Lecturer
(
    LecturerID INT PRIMARY KEY IDENTITY(1,1),
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Department VARCHAR(100) NOT NULL
);


-- =========================
-- COORDINATOR TABLE
-- =========================
CREATE TABLE Coordinator
(
    CoordinatorID INT PRIMARY KEY IDENTITY(1,1),
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE
);


-- =========================
-- MANAGER TABLE
-- =========================
CREATE TABLE Manager
(
    ManagerID INT PRIMARY KEY IDENTITY(1,1),
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE
);


-- =========================
-- CLAIM TABLE
-- =========================
CREATE TABLE Claim
(
    ClaimID INT PRIMARY KEY IDENTITY(1,1),

    LecturerID INT NOT NULL,
    CoordinatorID INT NULL,
    ManagerID INT NULL,

    HoursWorked DECIMAL(10,2) NOT NULL,
    HourlyRate DECIMAL(10,2) NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL,

    ClaimStatus VARCHAR(50) NOT NULL,
    DateSubmitted DATE NOT NULL,

    FOREIGN KEY (LecturerID)
        REFERENCES Lecturer(LecturerID),

    FOREIGN KEY (CoordinatorID)
        REFERENCES Coordinator(CoordinatorID),

    FOREIGN KEY (ManagerID)
        REFERENCES Manager(ManagerID)
);


-- =========================
-- SUPPORTING DOCUMENT TABLE
-- =========================
CREATE TABLE SupportingDocument
(
    DocumentID INT PRIMARY KEY IDENTITY(1,1),

    ClaimID INT NOT NULL,

    FileName VARCHAR(255) NOT NULL,
    FilePath VARCHAR(500) NOT NULL,
    UploadDate DATE NOT NULL,

    FOREIGN KEY (ClaimID)
        REFERENCES Claim(ClaimID)
);