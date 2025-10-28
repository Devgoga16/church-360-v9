-- Mock Data for Iglesia 360

-- ============================================================================
-- USERS
-- ============================================================================

INSERT INTO users (email, name, phone, status) VALUES
('admin@iglesia360.com', 'Juan García', '+34 666 111 111', 'active'),
('tesorero@iglesia360.com', 'María López', '+34 666 222 222', 'active'),
('pastor@iglesia360.com', 'Carlos Rodríguez', '+34 666 333 333', 'active'),
('pastor_red1@iglesia360.com', 'Ana Martínez', '+34 666 444 444', 'active'),
('miembro1@iglesia360.com', 'Pedro Sánchez', '+34 666 555 555', 'active'),
('miembro2@iglesia360.com', 'Rosa González', '+34 666 666 666', 'active');

-- ============================================================================
-- ASSIGN ROLES TO USERS
-- ============================================================================

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- Juan García = admin
(2, 2), -- María López = tesorero
(3, 3), -- Carlos Rodríguez = pastor_general
(4, 4), -- Ana Martínez = pastor_red
(5, 5), -- Pedro Sánchez = usuario
(6, 5); -- Rosa González = usuario

-- ============================================================================
-- MINISTRIES
-- ============================================================================

INSERT INTO ministries (code, name, description, responsible_user_id, budget_limit, currency) VALUES
('MIN001', 'Ministerio de Alabanza', 'Responsable de la música y adoración', 4, 5000.00, 'USD'),
('MIN002', 'Ministerio de Jóvenes', 'Actividades y discipulado de jóvenes', 4, 8000.00, 'USD'),
('MIN003', 'Ministerio de Niños', 'Cuidado y educación de niños', 5, 6000.00, 'USD'),
('MIN004', 'Ministerio de Obras Sociales', 'Ayuda a la comunidad', 6, 10000.00, 'USD'),
('MIN005', 'Ministerio de Misiones', 'Actividades misioneras y evangelismo', 3, 15000.00, 'USD');

-- ============================================================================
-- SOLICITUDES (Financial Requests)
-- ============================================================================

-- Request 1: Draft
INSERT INTO solicitudes (code, ministry_id, requester_user_id, responsible_user_id, title, description, total_amount, currency, status, payment_type, payment_detail) VALUES
('SOL001', 1, 5, 4, 'Equipos de sonido para alabanza', 'Compra de micrófono inalámbrico, amplificador y cables de audio de alta calidad para mejorar la calidad de sonido en los servicios.', 2500.00, 'USD', 'borrador', 'terceros', 'Pagar a proveedor TechSound Inc.');

-- Request 2: Pending
INSERT INTO solicitudes (code, ministry_id, requester_user_id, responsible_user_id, title, description, total_amount, currency, status, payment_type, payment_detail, submitted_at) VALUES
('SOL002', 2, 5, 4, 'Retiro de jóvenes verano 2024', 'Viaje de campamento para jóvenes incluyendo transporte, alojamiento y comidas para 40 personas.', 4500.00, 'USD', 'pendiente', 'terceros', 'Pagar a empresa de turismo Valle Bonito', NOW());

-- Request 3: Under Review
INSERT INTO solicitudes (code, ministry_id, requester_user_id, responsible_user_id, title, description, total_amount, currency, status, payment_type, payment_detail, submitted_at) VALUES
('SOL003', 3, 6, 4, 'Material didáctico para niños', 'Libros de colorear, juguetes educativos y materiales para las lecciones bíblicas semanales.', 1800.00, 'USD', 'en_revision', 'terceros', 'Pagar a Editorial Infantil Cristiana', NOW());

-- Request 4: Partially Approved
INSERT INTO solicitudes (code, ministry_id, requester_user_id, responsible_user_id, title, description, total_amount, currency, status, payment_type, payment_detail, submitted_at) VALUES
('SOL004', 4, 5, 6, 'Kits de alimentos para familias en necesidad', 'Distribución de paquetes de alimentos básicos a 30 familias de la comunidad durante el mes.', 3200.00, 'USD', 'aprobado_parcial', 'terceros', 'Pagar a proveedor local de alimentos', NOW());

-- Request 5: Approved
INSERT INTO solicitudes (code, ministry_id, requester_user_id, responsible_user_id, title, description, total_amount, currency, status, payment_type, payment_detail, submitted_at) VALUES
('SOL005', 5, 6, 3, 'Viaje misionero a región rural', 'Viaje de evangelismo y construcción de una pequeña capilla en zona rural. Incluye transporte, alojamiento y materiales de construcción.', 6500.00, 'USD', 'aprobado', 'terceros', 'Pagar a coordinador de misiones', NOW());

-- Request 6: Completed
INSERT INTO solicitudes (code, ministry_id, requester_user_id, responsible_user_id, title, description, total_amount, currency, status, payment_type, payment_detail, submitted_at, completed_at) VALUES
('SOL006', 1, 5, 4, 'Reparación de instrumentos musicales', 'Mantenimiento y reparación de órgano, guitarras y batería de la iglesia.', 1200.00, 'USD', 'completado', 'terceros', 'Pagar a taller de reparaciones Harmonia', NOW(), NOW());

-- ============================================================================
-- SOLICITUD ITEMS
-- ============================================================================

-- SOL001 Items
INSERT INTO solicitud_items (solicitud_id, item_number, description, amount, quantity, unit_price) VALUES
(1, 1, 'Micrófono inalámbrico profesional', 800.00, 2, 400.00),
(1, 2, 'Amplificador de audio 500W', 1200.00, 1, 1200.00),
(1, 3, 'Cables de audio y conectores', 500.00, 5, 100.00);

-- SOL002 Items
INSERT INTO solicitud_items (solicitud_id, item_number, description, amount, quantity, unit_price) VALUES
(2, 1, 'Transporte en autobús (4 buses)', 2000.00, 4, 500.00),
(2, 2, 'Alojamiento (2 noches)', 1800.00, 40, 45.00),
(2, 3, 'Comidas (desayuno, almuerzo, cena)', 700.00, 40, 17.50);

-- SOL003 Items
INSERT INTO solicitud_items (solicitud_id, item_number, description, amount, quantity, unit_price) VALUES
(3, 1, 'Libros de colorear cristianos', 600.00, 3, 200.00),
(3, 2, 'Juguetes educativos variados', 800.00, 2, 400.00),
(3, 3, 'Material para manualidades', 400.00, 1, 400.00);

-- SOL004 Items
INSERT INTO solicitud_items (solicitud_id, item_number, description, amount, quantity, unit_price) VALUES
(4, 1, 'Paquetes básicos de alimentos', 3200.00, 30, 106.67);

-- SOL005 Items
INSERT INTO solicitud_items (solicitud_id, item_number, description, amount, quantity, unit_price) VALUES
(5, 1, 'Transporte', 2000.00, 1, 2000.00),
(5, 2, 'Alojamiento y comidas', 2500.00, 1, 2500.00),
(5, 3, 'Materiales de construcción', 2000.00, 1, 2000.00);

-- SOL006 Items
INSERT INTO solicitud_items (solicitud_id, item_number, description, amount, quantity, unit_price) VALUES
(6, 1, 'Reparación y mantenimiento de instrumentos', 1200.00, 1, 1200.00);

-- ============================================================================
-- APROBACIONES (Approvals)
-- ============================================================================

-- SOL002 approvals (pending)
INSERT INTO aprobaciones (solicitud_id, approver_user_id, approval_order, status) VALUES
(2, 4, 1, 'pendiente'),
(2, 2, 2, 'pendiente');

-- SOL003 approvals (under review - one approved, one pending)
INSERT INTO aprobaciones (solicitud_id, approver_user_id, approval_order, status, approval_date, comments) VALUES
(3, 4, 1, 'aprobado', NOW(), 'Aprobado por pastor de red'),
(3, 2, 2, 'pendiente', NULL, NULL);

-- SOL004 approvals (partially approved)
INSERT INTO aprobaciones (solicitud_id, approver_user_id, approval_order, status, approval_date, comments) VALUES
(4, 6, 1, 'aprobado', NOW(), 'Aprobado por responsable de ministerio'),
(4, 2, 2, 'aprobado', NOW(), 'Aprobado por tesorero con observaciones sobre presupuesto');

-- SOL005 approvals (fully approved)
INSERT INTO aprobaciones (solicitud_id, approver_user_id, approval_order, status, approval_date, comments) VALUES
(5, 4, 1, 'aprobado', NOW(), 'Aprobado por pastor de red'),
(5, 3, 2, 'aprobado', NOW(), 'Aprobado por pastor general - proyecto importante'),
(5, 2, 3, 'aprobado', NOW(), 'Aprobado por tesorero');

-- SOL006 approvals (completed)
INSERT INTO aprobaciones (solicitud_id, approver_user_id, approval_order, status, approval_date, comments) VALUES
(6, 4, 1, 'aprobado', NOW(), 'Aprobado por pastor de red'),
(6, 2, 2, 'aprobado', NOW(), 'Aprobado por tesorero');

-- ============================================================================
-- SOLICITUD LOGS (Audit)
-- ============================================================================

INSERT INTO solicitud_logs (solicitud_id, user_id, action, new_value, comment) VALUES
(1, 5, 'created', 'borrador', 'Solicitud creada'),
(2, 5, 'created', 'borrador', 'Solicitud creada'),
(2, 5, 'submitted', 'pendiente', 'Solicitud enviada para revisión'),
(3, 6, 'created', 'borrador', 'Solicitud creada'),
(3, 6, 'submitted', 'pendiente', 'Solicitud enviada para revisión'),
(3, 4, 'approved', 'en_revision', 'Aprobado por pastor de red'),
(4, 5, 'created', 'borrador', 'Solicitud creada'),
(4, 5, 'submitted', 'pendiente', 'Solicitud enviada para revisión'),
(4, 6, 'approved', 'aprobado_parcial', 'Aprobado por responsable de ministerio'),
(4, 2, 'approved', 'aprobado_parcial', 'Aprobado por tesorero'),
(5, 6, 'created', 'borrador', 'Solicitud creada'),
(5, 6, 'submitted', 'pendiente', 'Solicitud enviada para revisión'),
(5, 4, 'approved', 'en_revision', 'Aprobado por pastor de red'),
(5, 3, 'approved', 'en_revision', 'Aprobado por pastor general'),
(5, 2, 'approved', 'aprobado', 'Aprobado por tesorero'),
(6, 5, 'created', 'borrador', 'Solicitud creada'),
(6, 5, 'submitted', 'pendiente', 'Solicitud enviada para revisión'),
(6, 4, 'approved', 'en_revision', 'Aprobado por pastor de red'),
(6, 2, 'approved', 'aprobado', 'Aprobado por tesorero'),
(6, 2, 'completed', 'completado', 'Solicitud marcada como completada');

-- ============================================================================
-- FINANCIAL MOVEMENTS
-- ============================================================================

INSERT INTO movimientos_financieros (solicitud_id, type, amount, currency, description, reference_number, payment_date, recorded_by) VALUES
(6, 'gasto', 1200.00, 'USD', 'Reparación de instrumentos musicales', 'REF-001', CURDATE(), 2),
(5, 'gasto', 6500.00, 'USD', 'Viaje misionero a región rural', 'REF-002', CURDATE(), 2);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

INSERT INTO notifications (user_id, solicitud_id, type, title, message, is_read) VALUES
(4, 2, 'solicitud_submitted', 'Nueva solicitud pendiente de revisión', 'Pedro Sánchez ha enviado la solicitud SOL002: Retiro de jóvenes verano 2024', 0),
(2, 3, 'solicitud_submitted', 'Nueva solicitud para aprobación', 'Rosa González ha enviado la solicitud SOL003: Material didáctico para niños', 1),
(4, 2, 'comment_added', 'Nuevo comentario en solicitud', 'El tesorero ha dejado un comentario en SOL002', 0),
(6, 3, 'approval_needed', 'Aprobación requerida', 'Tu aprobación es necesaria para SOL003', 1);
