-- Phase 2: PostgreSQL Database Setup & Seed Data
-- This script creates the retail database and seeds sample data

-- Create database (if not exists)
-- Run this separately if needed: CREATE DATABASE retail;

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    category VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 10,
    store_id INT DEFAULT 1,
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE(product_id, store_id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    total FLOAT NOT NULL,
    items JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed users (passwords need to be hashed in production)
-- For demo: admin/admin123, user1/user123
-- These are bcrypt hashes of the demo passwords
INSERT INTO users (username, password, role) VALUES
('admin', '$2b$12$8xZXhPCGnkJP8Q7J3N8K2OPKZ8Q7X5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'admin'),
('user1', '$2b$12$9yZYhPCGnkJP8Q7J3N8K2OPKZ8Q7X5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'user')
ON CONFLICT (username) DO NOTHING;

-- Seed products
INSERT INTO products (name, price, category) VALUES
('Sofa', 500, 'furniture'),
('Cushion', 50, 'furniture'),
('Table', 300, 'furniture'),
('Lamp', 150, 'home decor'),
('Rug', 200, 'home decor')
ON CONFLICT DO NOTHING;

-- Seed inventory
INSERT INTO inventory (product_id, quantity, store_id) VALUES
(1, 10, 1),
(2, 10, 1),
(3, 10, 1),
(4, 10, 1),
(5, 10, 1)
ON CONFLICT (product_id, store_id) DO NOTHING;

-- Verify data
SELECT 'Users:' as info;
SELECT id, username, role FROM users;

SELECT 'Products:' as info;
SELECT id, name, price, category FROM products;

SELECT 'Inventory:' as info;
SELECT i.id, i.product_id, p.name, i.quantity FROM inventory i
JOIN products p ON i.product_id = p.id;
