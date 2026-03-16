-- Создание базы данных для системы учёта практикантов
-- Запустите этот скрипт в MariaDB:
-- mysql -u root -p < scripts/001-create-tables.sql

-- Создание базы данных
CREATE DATABASE IF NOT EXISTS practice_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE practice_tracker;

-- Таблица пользователей (руководителей)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    position VARCHAR(255),
    role ENUM('supervisor', 'admin') DEFAULT 'supervisor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Таблица студентов
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    group_name VARCHAR(50) NOT NULL,
    direction VARCHAR(255) NOT NULL,
    practice_start DATE NOT NULL,
    practice_end DATE NOT NULL,
    supervisor_id VARCHAR(36) NOT NULL,
    score INT DEFAULT 0,
    status ENUM('active', 'completed', 'inactive') DEFAULT 'active',
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supervisor_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_supervisor (supervisor_id),
    INDEX idx_status (status),
    INDEX idx_group (group_name)
);

-- Таблица достижений
CREATE TABLE IF NOT EXISTS achievements (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    student_id VARCHAR(36) NOT NULL,
    description TEXT NOT NULL,
    score_change INT NOT NULL,
    score_after INT NOT NULL,
    employee_name VARCHAR(255) NOT NULL,
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_student (student_id),
    INDEX idx_created_at (created_at)
);

-- Таблица замечаний
CREATE TABLE IF NOT EXISTS remarks (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    student_id VARCHAR(36) NOT NULL,
    description TEXT NOT NULL,
    score_change INT NOT NULL,
    score_after INT NOT NULL,
    employee_name VARCHAR(255) NOT NULL,
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_student (student_id),
    INDEX idx_created_at (created_at)
);

-- Таблица истории баллов
CREATE TABLE IF NOT EXISTS score_history (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    student_id VARCHAR(36) NOT NULL,
    score INT NOT NULL,
    change_type ENUM('achievement', 'remark', 'initial') NOT NULL,
    reference_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_created_at (created_at)
);

-- Таблица сессий для авторизации
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user (user_id),
    INDEX idx_expires (expires_at)
);

-- Процедура очистки истёкших сессий
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS cleanup_expired_sessions()
BEGIN
    DELETE FROM sessions WHERE expires_at < NOW();
END //
DELIMITER ;

-- Создание события для автоматической очистки сессий (опционально)
-- SET GLOBAL event_scheduler = ON;
-- CREATE EVENT IF NOT EXISTS cleanup_sessions_event
-- ON SCHEDULE EVERY 1 HOUR
-- DO CALL cleanup_expired_sessions();

DELIMITER ;

SELECT 'База данных practice_tracker успешно создана!' as status;
