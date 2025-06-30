-- Create department table
CREATE TABLE [dbo].[department] (
    [department_id] INT IDENTITY(1,1) PRIMARY KEY,
    [department_name] VARCHAR(255) NOT NULL,
    [status] BIT DEFAULT 1,
    [archive] BIT DEFAULT 0
);
GO

-- Create designation table
CREATE TABLE [dbo].[designation] (
    [designation_id] INT IDENTITY(1,1) PRIMARY KEY,
    [designation_name] VARCHAR(255) NOT NULL,
    [department_id] INT,
    [status] BIT DEFAULT 1,
    [archive] BIT DEFAULT 0,
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);
GO

-- Create district table
CREATE TABLE [dbo].[district] (
    [district_id] INT IDENTITY(1,1) PRIMARY KEY,
    [district_name] VARCHAR(255) NOT NULL,
    [stateid] INT,
    [status] BIT DEFAULT 1,
    [archive] BIT DEFAULT 0,
    FOREIGN KEY (stateid) REFERENCES ATM_state(stateid)
);
GO

-- Create tehsil table
CREATE TABLE [dbo].[tehsil] (
    [tehsil_id] INT IDENTITY(1,1) PRIMARY KEY,
    [tehsil_name] VARCHAR(255) NOT NULL,
    [district_id] INT,
    [status] BIT DEFAULT 1,
    [archive] BIT DEFAULT 0,
    FOREIGN KEY (district_id) REFERENCES district(district_id)
);
GO 