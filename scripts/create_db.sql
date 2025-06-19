-- Database: rse_kyc_db
-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS rse_kyc_db;

-- Use the database
USE rse_kyc_db;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    registration_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active'
);

-- Table: brokers
CREATE TABLE IF NOT EXISTS brokers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active'
);

-- Insert initial brokers (matching existing data in js/dashboard.js if any)
INSERT IGNORE INTO brokers (id, name, contact_email, phone, status) VALUES
('broker1', 'BK Capital Rwanda', 'contact@bkcapital.rw', '+250788123001', 'active'),
('broker2', 'Rwanda Investment Group', 'info@rig.rw', '+250788123002', 'active'),
('broker3', 'East Africa Securities', 'support@eas.rw', '+250788123003', 'active'),
('broker4', 'Capital Markets Rwanda', 'admin@cmr.rw', '+250788123004', 'active');


-- Table: applications
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    broker_id VARCHAR(50),
    submitted_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    personal_info JSON,
    identity_info JSON,
    financial_info JSON,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (broker_id) REFERENCES brokers(id)
);
