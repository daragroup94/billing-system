-- ISP Billing System Database Schema

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ISP Company Profile
CREATE TABLE IF NOT EXISTS company_profile (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    address TEXT,
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    speed VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    features JSONB,
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    package_id INTEGER REFERENCES packages(id),
    status VARCHAR(20) DEFAULT 'active',
    join_date DATE DEFAULT CURRENT_DATE,
    monthly_fee DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(50) PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    package_id INTEGER REFERENCES packages(id),
    amount DECIMAL(10, 2) NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(50) PRIMARY KEY,
    invoice_id VARCHAR(50) REFERENCES invoices(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    method VARCHAR(50) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'success',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, name, role) 
VALUES ('admin@ispbilling.com', '$2a$10$YourHashedPasswordHere', 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default company profile
INSERT INTO company_profile (company_name, email, phone, address)
VALUES ('ISP Billing System', 'info@ispbilling.com', '+62 812 3456 7890', 'Jakarta, Indonesia')
ON CONFLICT DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
('invoice_prefix', 'INV-', 'Prefix for invoice numbers'),
('due_days', '7', 'Default due date in days'),
('email_notifications', 'true', 'Enable email notifications'),
('whatsapp_notifications', 'false', 'Enable WhatsApp notifications'),
('reminder_days', '3', 'Send reminder days before due date')
ON CONFLICT (key) DO NOTHING;

-- Insert sample packages
INSERT INTO packages (name, speed, price, description, features, is_popular) VALUES
('Basic', '10 Mbps', 150000, 'Paket internet dasar untuk browsing', '["Unlimited kuota", "24/7 Support", "Free instalasi"]', false),
('Standard', '25 Mbps', 250000, 'Paket internet untuk keluarga', '["Unlimited kuota", "24/7 Support", "Free instalasi", "Free router"]', true),
('Premium', '50 Mbps', 450000, 'Paket internet untuk streaming & gaming', '["Unlimited kuota", "24/7 Support", "Free instalasi", "Free router", "Prioritas bandwidth"]', false),
('Ultimate', '100 Mbps', 750000, 'Paket internet tercepat', '["Unlimited kuota", "24/7 Support", "Free instalasi", "Free router", "Prioritas bandwidth", "Static IP"]', false)
ON CONFLICT DO NOTHING;
