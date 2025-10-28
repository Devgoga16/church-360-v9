-- Iglesia 360 Database Schema
-- Church/Religious Organization Management System

-- ============================================================================
-- USERS AND ROLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS user_roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by INT,
  UNIQUE KEY unique_user_role (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_role_id (role_id)
);

-- ============================================================================
-- PERMISSIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  module VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_module (module),
  INDEX idx_action (action),
  UNIQUE KEY unique_module_action (module, action)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  granted_by INT,
  UNIQUE KEY unique_role_permission (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
  INDEX idx_role_id (role_id),
  INDEX idx_permission_id (permission_id)
);

-- ============================================================================
-- MINISTRIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS ministries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  responsible_user_id INT,
  budget_limit DECIMAL(15, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (responsible_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_code (code),
  INDEX idx_status (status)
);

-- ============================================================================
-- FINANCIAL REQUESTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS solicitudes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL UNIQUE,
  ministry_id INT NOT NULL,
  requester_user_id INT NOT NULL,
  responsible_user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  total_amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('borrador', 'pendiente', 'en_revision', 'aprobado_parcial', 'aprobado', 'rechazado', 'completado', 'cancelado') DEFAULT 'borrador',
  payment_type ENUM('uno_mismo', 'terceros') DEFAULT 'terceros',
  payment_detail TEXT,
  requester_comments TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (ministry_id) REFERENCES ministries(id) ON DELETE RESTRICT,
  FOREIGN KEY (requester_user_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (responsible_user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_code (code),
  INDEX idx_status (status),
  INDEX idx_ministry_id (ministry_id),
  INDEX idx_requester_user_id (requester_user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_submitted_at (submitted_at)
);

CREATE TABLE IF NOT EXISTS solicitud_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  solicitud_id INT NOT NULL,
  item_number INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  INDEX idx_solicitud_id (solicitud_id)
);

CREATE TABLE IF NOT EXISTS solicitud_attachments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  solicitud_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size INT,
  file_path VARCHAR(500),
  uploaded_by INT NOT NULL,
  document_type ENUM('comprobante', 'presupuesto', 'otro') DEFAULT 'otro',
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_solicitud_id (solicitud_id),
  INDEX idx_document_type (document_type)
);

-- ============================================================================
-- APPROVALS AND AUDIT
-- ============================================================================

CREATE TABLE IF NOT EXISTS aprobaciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  solicitud_id INT NOT NULL,
  approver_user_id INT NOT NULL,
  approval_order INT NOT NULL,
  status ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
  required_approval TINYINT DEFAULT 1,
  approval_date TIMESTAMP NULL,
  comments TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  FOREIGN KEY (approver_user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_solicitud_id (solicitud_id),
  INDEX idx_approver_user_id (approver_user_id),
  INDEX idx_status (status),
  UNIQUE KEY unique_solicitud_approver (solicitud_id, approver_user_id)
);

CREATE TABLE IF NOT EXISTS solicitud_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  solicitud_id INT NOT NULL,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  old_value TEXT,
  new_value TEXT,
  comment TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_solicitud_id (solicitud_id),
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
);

-- ============================================================================
-- FINANCIAL MOVEMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS movimientos_financieros (
  id INT PRIMARY KEY AUTO_INCREMENT,
  solicitud_id INT NOT NULL,
  type ENUM('gasto', 'ingreso', 'ajuste') DEFAULT 'gasto',
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  description TEXT,
  reference_number VARCHAR(100),
  payment_date DATE,
  recorded_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_solicitud_id (solicitud_id),
  INDEX idx_type (type),
  INDEX idx_payment_date (payment_date)
);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  solicitud_id INT,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
);

-- ============================================================================
-- INITIAL ROLES
-- ============================================================================

INSERT INTO roles (name, description) VALUES
('admin', 'Administrador del sistema con acceso total'),
('tesorero', 'Tesorero responsable de finanzas'),
('pastor_general', 'Pastor general de la iglesia'),
('pastor_red', 'Pastor de red o miniiglesia'),
('usuario', 'Miembro normal de la iglesia');

-- ============================================================================
-- INITIAL PERMISSIONS
-- ============================================================================

INSERT INTO permissions (name, module, action, description) VALUES
-- Users Module
('users.create', 'users', 'create', 'Crear nuevos usuarios'),
('users.view', 'users', 'view', 'Ver usuarios'),
('users.edit', 'users', 'edit', 'Editar usuarios'),
('users.delete', 'users', 'delete', 'Eliminar usuarios'),
('users.manage_roles', 'users', 'manage_roles', 'Asignar/editar roles de usuarios'),

-- Permissions Module
('permissions.manage', 'permissions', 'manage', 'Gestionar permisos'),

-- Solicitudes Module
('solicitudes.create', 'solicitudes', 'create', 'Crear solicitudes financieras'),
('solicitudes.view', 'solicitudes', 'view', 'Ver solicitudes'),
('solicitudes.view_all', 'solicitudes', 'view_all', 'Ver todas las solicitudes'),
('solicitudes.edit', 'solicitudes', 'edit', 'Editar solicitudes'),
('solicitudes.edit_approved', 'solicitudes', 'edit_approved', 'Editar solicitudes aprobadas'),
('solicitudes.approve', 'solicitudes', 'approve', 'Aprobar/rechazar solicitudes'),
('solicitudes.force_approval', 'solicitudes', 'force_approval', 'Forzar aprobación'),
('solicitudes.comment', 'solicitudes', 'comment', 'Comentar en solicitudes'),
('solicitudes.attach_document', 'solicitudes', 'attach_document', 'Adjuntar documentos'),
('solicitudes.mark_paid', 'solicitudes', 'mark_paid', 'Marcar como pagado'),
('solicitudes.cancel', 'solicitudes', 'cancel', 'Cancelar solicitudes'),

-- Ministries Module
('ministries.create', 'ministries', 'create', 'Crear ministerios'),
('ministries.view', 'ministries', 'view', 'Ver ministerios'),
('ministries.edit', 'ministries', 'edit', 'Editar ministerios'),
('ministries.delete', 'ministries', 'delete', 'Eliminar ministerios');

-- ============================================================================
-- ROLE PERMISSIONS - ADMIN
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'admin'
ON DUPLICATE KEY UPDATE role_id = r.id;

-- ============================================================================
-- ROLE PERMISSIONS - TESORERO
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'tesorero'
AND p.name IN (
  'solicitudes.view_all', 'solicitudes.view', 'solicitudes.approve',
  'solicitudes.comment', 'solicitudes.attach_document', 'solicitudes.mark_paid',
  'users.view'
);

-- ============================================================================
-- ROLE PERMISSIONS - PASTOR_GENERAL
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'pastor_general'
AND p.name IN (
  'solicitudes.view_all', 'solicitudes.view', 'solicitudes.approve',
  'solicitudes.force_approval', 'solicitudes.comment', 'solicitudes.attach_document',
  'users.view', 'ministries.view'
);

-- ============================================================================
-- ROLE PERMISSIONS - PASTOR_RED
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'pastor_red'
AND p.name IN (
  'solicitudes.view', 'solicitudes.approve', 'solicitudes.comment',
  'solicitudes.attach_document', 'users.view', 'ministries.view'
);

-- ============================================================================
-- ROLE PERMISSIONS - USUARIO
-- ============================================================================

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'usuario'
AND p.name IN (
  'solicitudes.create', 'solicitudes.view', 'solicitudes.edit',
  'solicitudes.comment', 'solicitudes.attach_document'
);
