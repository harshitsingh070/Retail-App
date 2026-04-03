-- PostgreSQL Setup Commands for Meridian Home & Lifestyle
-- Run these in order in your PostgreSQL query editor

-- 1. CREATE DATABASE
CREATE DATABASE retail;

-- 2. CREATE TABLES (run these while connected to 'retail' database)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    category VARCHAR(100) NOT NULL
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 10,
    store_id INT DEFAULT 1,
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE(product_id, store_id)
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    total FLOAT NOT NULL,
    items JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. SEED USERS
INSERT INTO users (username, password, role) VALUES
('admin', 'admin123_temp', 'admin'),
('user1', 'user123_temp', 'user');

-- 4. SEED PRODUCTS
INSERT INTO products (name, price, category) VALUES
('Sofa', 500, 'furniture'),
('Cushion', 50, 'furniture'),
('Table', 300, 'furniture'),
('Lamp', 150, 'home decor'),
('Rug', 200, 'home decor');

-- 5. SEED INVENTORY
INSERT INTO inventory (product_id, quantity, store_id) VALUES
(1, 10, 1),
(2, 10, 1),
(3, 10, 1),
(4, 10, 1),
(5, 10, 1);

-- 6. VERIFY DATA
SELECT 'Users:' as info;
SELECT * FROM users;

SELECT 'Products:' as info;
SELECT * FROM products;

SELECT 'Inventory:' as info;
SELECT * FROM inventory;
