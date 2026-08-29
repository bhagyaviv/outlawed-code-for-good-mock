-- OutLawed India Database Schema
-- Run this script inside MySQL Workbench to initialize the tables

CREATE DATABASE IF NOT EXISTS outlawed_db;
USE outlawed_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(25) NOT NULL
);

-- 2. Case Records Table
CREATE TABLE IF NOT EXISTS case_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    issue_type VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    urgency VARCHAR(25) NOT NULL,
    status VARCHAR(50) NOT NULL,
    language VARCHAR(20) NOT NULL,
    follow_up_date VARCHAR(20),
    client_name VARCHAR(100) NOT NULL,
    client_age INT,
    client_phone VARCHAR(30),
    file_name VARCHAR(255),
    situation TEXT,
    expert_question TEXT,
    expert_advisor VARCHAR(100),
    expert_comments TEXT,
    expert_answer_date VARCHAR(20),
    created_by VARCHAR(100),
    last_updated VARCHAR(20)
);

-- 3. Case Tasks Checklist Table
CREATE TABLE IF NOT EXISTS case_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    due_date VARCHAR(20),
    done BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (case_id) REFERENCES case_records(id) ON DELETE CASCADE
);

-- 4. Case Notes Table
CREATE TABLE IF NOT EXISTS case_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT NOT NULL,
    text TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    created_at VARCHAR(20),
    FOREIGN KEY (case_id) REFERENCES case_records(id) ON DELETE CASCADE
);

-- 5. Anonymized Resolved Previous Cases Table
CREATE TABLE IF NOT EXISTS previous_cases (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    issue_type VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    language VARCHAR(20) NOT NULL,
    year INT NOT NULL,
    priority VARCHAR(25) NOT NULL,
    problem TEXT,
    actions_taken TEXT,
    knowledge_used TEXT,
    outcome VARCHAR(50) NOT NULL,
    resolution_summary TEXT,
    documents TEXT,
    tags TEXT,
    lessons_learned TEXT
);
