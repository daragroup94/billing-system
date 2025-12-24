-- ============================================================================
-- ISP BILLING SYSTEM - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Script ini membuat semua tabel yang diperlukan untuk sistem billing ISP
-- Dapat langsung dijalankan di database PostgreSQL
-- ============================================================================

-- Drop existing tables jika ada (urutan yang benar untuk drop)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS company_profile CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- TABLE: users
-- Menyimpan data user/admin untuk akses sistem
-- ============================================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin', -- admin, superadmin, staff
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: company_profile
-- Menyimpan profil perusahaan untuk tampilan invoice dan branding
-- ============================================================================
CREATE TABLE company_profile (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    website VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20),
    logo_url VARCHAR(255),
    tax_number VARCHAR(50),
    business_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: packages
-- Menyimpan paket layanan internet yang ditawarkan
-- ============================================================================
CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    speed VARCHAR(100) NOT NULL, -- misal: "10 Mbps", "50 Mbps"
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'IDR',
    description TEXT,
    features JSONB, -- fitur-fitur paket dalam format JSON
    bandwidth_quota VARCHAR(100), -- misal: "Unlimited", "500 GB"
    contract_duration INTEGER, -- durasi kontrak dalam bulan, null = tanpa kontrak
    installation_fee DECIMAL(10, 2) DEFAULT 0,
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: customers
-- Menyimpan data pelanggan/pengguna layanan
-- ============================================================================
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    customer_number VARCHAR(50) UNIQUE NOT NULL, -- nomor pelanggan unik
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20),
    package_id INTEGER REFERENCES packages(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, suspended, terminated
    installation_date DATE,
    billing_cycle VARCHAR(50) DEFAULT 'monthly', -- monthly, quarterly, yearly
    billing_day INTEGER DEFAULT 1, -- tanggal tagihan setiap bulan (1-31)
    router_mac_address VARCHAR(50),
    router_ip_address VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    notes TEXT,
    metadata JSONB, -- data tambahan dalam format JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: invoices
-- Menyimpan data tagihan/faktur untuk pelanggan
-- ============================================================================
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    package_id INTEGER REFERENCES packages(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL, -- amount + tax - discount
    currency VARCHAR(10) DEFAULT 'IDR',
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, paid, overdue, cancelled
    description TEXT,
    notes TEXT,
    payment_method VARCHAR(50),
    sent_via VARCHAR(50), -- email, whatsapp, sms, manual
    sent_at TIMESTAMP,
    paid_at TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: payments
-- Menyimpan data pembayaran dari pelanggan
-- ============================================================================
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'IDR',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50) NOT NULL, -- cash, transfer, bank_transfer, ewallet, credit_card, qris
    payment_status VARCHAR(50) DEFAULT 'completed', -- pending, completed, failed, cancelled, refunded
    payment_channel VARCHAR(100), -- misal: "BCA Transfer", "GoPay", "OVO"
    transaction_id VARCHAR(255), -- ID transaksi dari payment gateway
    reference_number VARCHAR(255),
    receipt_url VARCHAR(255), -- URL bukti pembayaran
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: notifications
-- Menyimpan notifikasi untuk admin dan sistem
-- ============================================================================
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- payment, invoice, system, reminder, warning, info, success, error
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    metadata JSONB, -- data tambahan dalam format JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: audit_logs
-- Menyimpan log aktivitas untuk audit dan tracking
-- ============================================================================
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- create, update, delete, login, logout, export, print
    entity_type VARCHAR(100), -- customer, invoice, payment, package, user
    entity_id INTEGER,
    description TEXT,
    ip_address VARCHAR(50),
    user_agent TEXT,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: system_settings
-- Menyimpan pengaturan sistem
-- ============================================================================
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    category VARCHAR(100), -- general, billing, notification, whatsapp
    is_encrypted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: reminder_schedules
-- Menyimpan jadwal pengingat tagihan
-- ============================================================================
CREATE TABLE reminder_schedules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    days_before_due INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    send_via VARCHAR(50), -- email, whatsapp, sms
    message_template TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: invoice_history
-- Menyimpan riwayat perubahan status invoice
-- ============================================================================
CREATE TABLE invoice_history (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
    status_from VARCHAR(50),
    status_to VARCHAR(50) NOT NULL,
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE: payment_history
-- Menyimpan riwayat perubahan status pembayaran
-- ============================================================================
CREATE TABLE payment_history (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES payments(id) ON DELETE CASCADE,
    status_from VARCHAR(50),
    status_to VARCHAR(50) NOT NULL,
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES untuk optimasi query
-- ============================================================================

-- Index untuk tabel users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Index untuk tabel packages
CREATE INDEX idx_packages_is_active ON packages(is_active);
CREATE INDEX idx_packages_is_popular ON packages(is_popular);
CREATE INDEX idx_packages_sort_order ON packages(sort_order);

-- Index untuk tabel customers
CREATE INDEX idx_customers_customer_number ON customers(customer_number);
CREATE INDEX idx_customers_package_id ON customers(package_id);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_city ON customers(city);

-- Index untuk tabel invoices
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_package_id ON invoices(package_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_billing_period ON invoices(billing_period_start, billing_period_end);
CREATE INDEX idx_invoices_created_at ON invoices(created_at);

-- Index untuk tabel payments
CREATE INDEX idx_payments_payment_number ON payments(payment_number);
CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
CREATE INDEX idx_payments_payment_status ON payments(payment_status);
CREATE INDEX idx_payments_payment_method ON payments(payment_method);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);

-- Index untuk tabel notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_customer_id ON notifications(customer_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Index untuk tabel audit_logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Index untuk tabel system_settings
CREATE INDEX idx_system_settings_key ON system_settings(key);
CREATE INDEX idx_system_settings_category ON system_settings(category);

-- Index untuk tabel reminder_schedules
CREATE INDEX idx_reminder_days_before ON reminder_schedules(days_before_due);
CREATE INDEX idx_reminder_is_active ON reminder_schedules(is_active);

-- Index untuk tabel invoice_history
CREATE INDEX idx_invoice_history_invoice_id ON invoice_history(invoice_id);
CREATE INDEX idx_invoice_history_created_at ON invoice_history(created_at);

-- Index untuk tabel payment_history
CREATE INDEX idx_payment_history_payment_id ON payment_history(payment_id);
CREATE INDEX idx_payment_history_created_at ON payment_history(created_at);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function untuk auto update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk auto update timestamp pada setiap tabel
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_profile_updated_at BEFORE UPDATE ON company_profile
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminder_schedules_updated_at BEFORE UPDATE ON reminder_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function untuk generate customer number otomatis
CREATE OR REPLACE FUNCTION generate_customer_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.customer_number IS NULL OR NEW.customer_number = '' THEN
        NEW.customer_number := 'CUST' || LPAD(NEW.id::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk auto generate customer number
CREATE TRIGGER generate_customer_number_trigger BEFORE INSERT ON customers
    FOR EACH ROW EXECUTE FUNCTION generate_customer_number();

-- Function untuk generate invoice number otomatis
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := 'INV' || TO_CHAR(CURRENT_DATE, 'YYYYMM') || LPAD(NEW.id::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk auto generate invoice number
CREATE TRIGGER generate_invoice_number_trigger BEFORE INSERT ON invoices
    FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();

-- Function untuk generate payment number otomatis
CREATE OR REPLACE FUNCTION generate_payment_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_number IS NULL OR NEW.payment_number = '' THEN
        NEW.payment_number := 'PAY' || TO_CHAR(CURRENT_DATE, 'YYYYMM') || LPAD(NEW.id::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk auto generate payment number
CREATE TRIGGER generate_payment_number_trigger BEFORE INSERT ON payments
    FOR EACH ROW EXECUTE FUNCTION generate_payment_number();

-- Function untuk create invoice history ketika status berubah
CREATE OR REPLACE FUNCTION create_invoice_history()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status != OLD.status THEN
        INSERT INTO invoice_history (invoice_id, status_from, status_to, created_by, created_at)
        VALUES (NEW.id, OLD.status, NEW.status, NEW.created_by, CURRENT_TIMESTAMP);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk create invoice history
CREATE TRIGGER create_invoice_history_trigger AFTER UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION create_invoice_history();

-- Function untuk create payment history ketika status berubah
CREATE OR REPLACE FUNCTION create_payment_history()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status != OLD.payment_status THEN
        INSERT INTO payment_history (payment_id, status_from, status_to, created_by, created_at)
        VALUES (NEW.id, OLD.payment_status, NEW.payment_status, NEW.created_by, CURRENT_TIMESTAMP);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk create payment history
CREATE TRIGGER create_payment_history_trigger AFTER UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION create_payment_history();

-- ============================================================================
-- SEED DATA - DATA AWAL
-- ============================================================================

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, name, role, phone)
VALUES (
    'admin@ispbilling.com',
    '$2b$10$eLLF46zRanYgedSI3XyHCOn8Gm3zCwPjIWEAcHIOIHXZAm/iaOCrS',
    'Administrator',
    'admin',
    '081234567890'
);

-- Insert sample company profile
INSERT INTO company_profile (company_name, email, phone, whatsapp, website, address, city, province, postal_code)
VALUES (
    'ISP Network Solutions',
    'info@ispnetwork.com',
    '021-12345678',
    '081234567890',
    'www.ispnetwork.com',
    'Jl. Sudirman No. 123, Gedung Cyber',
    'Jakarta',
    'DKI Jakarta',
    '10110'
);

-- Insert sample packages
INSERT INTO packages (code, name, speed, price, description, features, bandwidth_quota, installation_fee, is_popular, is_active, sort_order)
VALUES
('PKG001', 'Basic', '10 Mbps', 150000, 'Paket internet dasar untuk rumahan', '["Unlimited kuota", "Support 08-17", "WiFi router"]', 'Unlimited', 250000, false, true, 1),
('PKG002', 'Standard', '50 Mbps', 350000, 'Paket keluarga dengan kecepatan lebih tinggi', '["Unlimited kuota", "24/7 Support", "Free instalasi", "WiFi router premium"]', 'Unlimited', 0, false, true, 2),
('PKG003', 'Ultimate', '100 Mbps', 750000, 'Paket internet tercepat untuk bisnis dan gaming', '["Unlimited kuota", "24/7 Support", "Free instalasi", "Free router premium", "Prioritas bandwidth", "Static IP"]', 'Unlimited', 0, true, true, 3),
('PKG004', 'Business', '200 Mbps', 1500000, 'Paket khusus untuk bisnis dan korporasi', '["Unlimited kuota", "Dedicated support", "SLA 99.9%", "Free instalasi", "Free router enterprise", "IP address dedicated", "Backup link"]', 'Unlimited', 0, false, true, 4);

-- Insert sample customers
INSERT INTO customers (customer_number, name, email, phone, whatsapp, address, city, package_id, status, installation_date, billing_cycle)
VALUES
('CUST000001', 'Ahmad Wijaya', 'ahmad@gmail.com', '081234567891', '081234567891', 'Jl. Merdeka No. 1', 'Jakarta', 2, 'active', '2024-01-15', 'monthly'),
('CUST000002', 'Budi Santoso', 'budi@yahoo.com', '081234567892', '081234567892', 'Jl. Sudirman No. 45', 'Bandung', 3, 'active', '2024-02-20', 'monthly'),
('CUST000003', 'Citra Dewi', 'citra@gmail.com', '081234567893', '081234567893', 'Jl. Gatot Subroto No. 100', 'Surabaya', 1, 'active', '2024-03-10', 'monthly'),
('CUST000004', 'Doni Pratama', 'doni@gmail.com', '081234567894', '081234567894', 'Jl. Diponegoro No. 50', 'Semarang', 2, 'inactive', '2024-04-05', 'monthly'),
('CUST000005', 'Eka Putri', 'eka@gmail.com', '081234567895', '081234567895', 'Jl. Pahlawan No. 25', 'Yogyakarta', 4, 'active', '2024-05-12', 'quarterly');

-- Insert sample invoices
INSERT INTO invoices (invoice_number, customer_id, package_id, amount, tax_amount, discount_amount, total_amount, billing_period_start, billing_period_end, due_date, status)
VALUES
('INV2024120001', 1, 2, 350000, 38500, 0, 388500, '2024-12-01', '2024-12-31', '2024-12-10', 'paid'),
('INV2024120002', 2, 3, 750000, 82500, 50000, 782500, '2024-12-01', '2024-12-31', '2024-12-10', 'paid'),
('INV2024120003', 3, 1, 150000, 16500, 0, 166500, '2024-12-01', '2024-12-31', '2024-12-10', 'pending'),
('INV2024120004', 5, 4, 4500000, 495000, 200000, 4795000, '2024-12-01', '2025-03-01', '2025-01-10', 'overdue');

-- Insert sample payments
INSERT INTO payments (payment_number, invoice_id, customer_id, amount, payment_date, payment_method, payment_status, payment_channel)
VALUES
('PAY2024120001', 1, 1, 388500, '2024-12-05 10:30:00', 'transfer', 'completed', 'BCA Transfer'),
('PAY2024120002', 2, 2, 782500, '2024-12-07 14:15:00', 'qris', 'completed', 'QRIS');

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, is_read)
VALUES
(1, 'payment', 'Pembayaran Diterima', 'Ahmad Wijaya telah melakukan pembayaran sebesar Rp 388.500', false),
(1, 'invoice', 'Tagihan Baru', 'Tagihan baru telah dibuat untuk Citra Dewi sebesar Rp 166.500', false),
(1, 'warning', 'Tagihan Terlambat', 'Eka Putri memiliki tagihan yang sudah melewati tanggal jatuh tempo', false);

-- Insert sample system settings
INSERT INTO system_settings (key, value, description, category)
VALUES
('company_name', 'ISP Network Solutions', 'Nama perusahaan', 'general'),
('tax_rate', '11', 'Persentase pajak (%)', 'billing'),
('currency', 'IDR', 'Mata uang sistem', 'general'),
('default_billing_cycle', 'monthly', 'Siklus tagihan default', 'billing'),
('invoice_prefix', 'INV', 'Prefix nomor invoice', 'billing'),
('payment_prefix', 'PAY', 'Prefix nomor pembayaran', 'billing'),
('customer_prefix', 'CUST', 'Prefix nomor pelanggan', 'general'),
('reminder_days', '3,7,14', 'Hari pengingat sebelum jatuh tempo', 'reminder'),
('whatsapp_enabled', 'true', 'Aktifkan notifikasi WhatsApp', 'notification'),
('whatsapp_api_url', 'https://api.whatsapp.com/send', 'URL API WhatsApp', 'notification');

-- Insert sample reminder schedules
INSERT INTO reminder_schedules (name, days_before_due, is_active, send_via, message_template)
VALUES
('Reminder 3 Hari', 3, true, 'whatsapp,email', 'Halo {customer_name}, tagihan Anda sebesar {amount} akan jatuh tempo dalam 3 hari. Mohon segera lakukan pembayaran.'),
('Reminder 7 Hari', 7, true, 'whatsapp', 'Halo {customer_name}, tagihan Anda sebesar {amount} akan jatuh tempo dalam 7 hari.'),
('Reminder 14 Hari', 14, true, 'email', 'Mohon lakukan pembayaran tagihan Anda sebesar {amount} sebelum tanggal {due_date}.');

-- ============================================================================
-- VIEWS untuk memudahkan query
-- ============================================================================
-- View untuk summary dashboard stats
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM customers WHERE status = 'active') AS active_customers,
    (SELECT COUNT(*) FROM customers WHERE status = 'inactive') AS inactive_customers,
    (SELECT COUNT(*) FROM customers WHERE status = 'suspended') AS suspended_customers,
    (SELECT COUNT(*) FROM invoices WHERE status = 'pending') AS pending_invoices,
    (SELECT COUNT(*) FROM invoices WHERE status = 'overdue') AS overdue_invoices,
    (SELECT COUNT(*) FROM invoices WHERE status = 'paid' AND payment_date::date = CURRENT_DATE) AS paid_today,
    (SELECT COALESCE(SUM(total_amount), 0) FROM invoices WHERE status = 'paid' AND EXTRACT(MONTH FROM paid_at) = EXTRACT(MONTH FROM CURRENT_DATE)) AS revenue_this_month,
    (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE payment_status = 'completed' AND payment_date::date = CURRENT_DATE) AS collections_today;

-- View untuk invoice dengan detail customer dan package
CREATE OR REPLACE VIEW invoice_details AS
SELECT
    i.*,
    c.name AS customer_name,
    c.customer_number,
    c.email AS customer_email,
    c.phone AS customer_phone,
    c.whatsapp AS customer_whatsapp,
    c.address AS customer_address,
    p.name AS package_name,
    p.speed AS package_speed,
    cp.company_name,
    cp.email AS company_email,
    cp.phone AS company_phone,
    cp.whatsapp AS company_whatsapp,
    cp.address AS company_address,
    cp.logo_url AS company_logo
FROM invoices i
LEFT JOIN customers c ON i.customer_id = c.id
LEFT JOIN packages p ON i.package_id = p.id
CROSS JOIN company_profile cp
LIMIT 1;

-- View untuk payment dengan detail customer dan invoice
CREATE OR REPLACE VIEW payment_details AS
SELECT
    p.*,
    c.name AS customer_name,
    c.customer_number,
    i.invoice_number,
    i.total_amount AS invoice_amount,
    cp.company_name
FROM payments p
LEFT JOIN customers c ON p.customer_id = c.id
LEFT JOIN invoices i ON p.invoice_id = i.id
CROSS JOIN company_profile cp
LIMIT 1;

-- View untuk customer dengan detail package dan billing info
CREATE OR REPLACE VIEW customer_billing_info AS
SELECT
    c.*,
    p.name AS package_name,
    p.speed AS package_speed,
    p.price AS package_price,
    (SELECT COUNT(*) FROM invoices WHERE customer_id = c.id AND status = 'pending') AS pending_invoices,
    (SELECT COUNT(*) FROM invoices WHERE customer_id = c.id AND status = 'overdue') AS overdue_invoices,
    (SELECT COALESCE(SUM(amount), 0) FROM invoices WHERE customer_id = c.id AND status = 'pending') AS total_pending_amount,
    (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE customer_id = c.id AND payment_status = 'completed') AS total_paid_amount
FROM customers c
LEFT JOIN packages p ON c.package_id = p.id;

-- ============================================================================
-- Selesai - Database Schema Complete
-- ============================================================================
