-- Скрипт для добавления тестовых данных
-- Запустите после создания таблиц:
-- mysql -u root -p practice_tracker < scripts/002-seed-data.sql

USE practice_tracker;

-- Добавление тестовых пользователей (руководителей)
-- Пароль: password123 (хеш bcrypt)
-- ВАЖНО: Эти пароли нужно заменить на реальные через интерфейс регистрации

INSERT INTO users (id, email, password_hash, first_name, last_name, middle_name, position, role) VALUES
('sup-1', 'petrov@university.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.AuH8uM3lYy0RAL/p6K', 'Александр', 'Петров', 'Иванович', 'Старший преподаватель', 'supervisor'),
('sup-2', 'smirnova@university.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.AuH8uM3lYy0RAL/p6K', 'Елена', 'Смирнова', 'Владимировна', 'Доцент', 'supervisor'),
('sup-3', 'kozlov@university.ru', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.AuH8uM3lYy0RAL/p6K', 'Михаил', 'Козлов', 'Сергеевич', 'Профессор', 'admin')
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Добавление тестовых студентов
INSERT INTO students (id, first_name, last_name, middle_name, group_name, direction, practice_start, practice_end, supervisor_id, score, status, photo_url) VALUES
('std-1', 'Анна', 'Иванова', 'Сергеевна', 'ИВТ-21-1', 'Информатика и вычислительная техника', '2024-02-01', '2024-04-30', 'sup-1', 85, 'active', '/avatars/student-1.jpg'),
('std-2', 'Дмитрий', 'Сидоров', 'Александрович', 'ИВТ-21-2', 'Информатика и вычислительная техника', '2024-02-01', '2024-04-30', 'sup-1', 62, 'active', '/avatars/student-2.jpg'),
('std-3', 'Мария', 'Козлова', 'Дмитриевна', 'ПИ-22-1', 'Программная инженерия', '2024-02-15', '2024-05-15', 'sup-2', 45, 'active', '/avatars/student-3.jpg'),
('std-4', 'Алексей', 'Новиков', 'Петрович', 'ИВТ-20-1', 'Информатика и вычислительная техника', '2023-09-01', '2023-12-31', 'sup-3', 92, 'completed', '/avatars/student-4.jpg'),
('std-5', 'Екатерина', 'Волкова', 'Андреевна', 'ПИ-21-2', 'Программная инженерия', '2024-01-15', '2024-04-15', 'sup-2', 28, 'active', '/avatars/student-5.jpg'),
('std-6', 'Иван', 'Морозов', 'Викторович', 'ИВТ-22-1', 'Информатика и вычислительная техника', '2024-03-01', '2024-05-31', 'sup-1', -5, 'active', '/avatars/student-6.jpg')
ON DUPLICATE KEY UPDATE first_name = VALUES(first_name);

-- Добавление тестовых достижений
INSERT INTO achievements (id, student_id, description, score_change, score_after, employee_name, created_by, created_at) VALUES
('ach-1', 'std-1', 'Отлично выполнила задание по разработке модуля авторизации', 10, 85, 'Петров А.И.', 'sup-1', '2024-03-10 09:30:00'),
('ach-2', 'std-2', 'Успешно завершил этап тестирования приложения', 8, 62, 'Петров А.И.', 'sup-1', '2024-03-09 10:00:00'),
('ach-3', 'std-4', 'Защита итогового проекта с отличной оценкой', 15, 92, 'Козлов М.С.', 'sup-3', '2023-12-20 15:00:00')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Добавление тестовых замечаний
INSERT INTO remarks (id, student_id, description, score_change, score_after, employee_name, created_by, created_at) VALUES
('rem-1', 'std-1', 'Опоздание на рабочее место на 30 минут', -3, 70, 'Смирнова Е.В.', 'sup-2', '2024-03-05 11:00:00'),
('rem-2', 'std-2', 'Некорректное оформление документации', -2, 54, 'Козлов М.С.', 'sup-3', '2024-03-07 16:30:00'),
('rem-3', 'std-6', 'Неявка на рабочее место без уважительной причины', -10, -5, 'Петров А.И.', 'sup-1', '2024-03-11 09:00:00')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Добавление истории баллов
INSERT INTO score_history (id, student_id, score, change_type, reference_id, created_at) VALUES
('sh-1', 'std-1', 0, 'initial', NULL, '2024-02-01 00:00:00'),
('sh-2', 'std-1', 85, 'achievement', 'ach-1', '2024-03-10 09:30:00'),
('sh-3', 'std-2', 0, 'initial', NULL, '2024-02-01 00:00:00'),
('sh-4', 'std-2', 62, 'achievement', 'ach-2', '2024-03-09 10:00:00'),
('sh-5', 'std-6', 0, 'initial', NULL, '2024-03-01 00:00:00'),
('sh-6', 'std-6', -5, 'remark', 'rem-3', '2024-03-11 09:00:00')
ON DUPLICATE KEY UPDATE score = VALUES(score);

SELECT 'Тестовые данные успешно добавлены!' as status;
SELECT COUNT(*) as users_count FROM users;
SELECT COUNT(*) as students_count FROM students;
SELECT COUNT(*) as achievements_count FROM achievements;
SELECT COUNT(*) as remarks_count FROM remarks;
