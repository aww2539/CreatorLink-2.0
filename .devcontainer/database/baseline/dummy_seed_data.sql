-- Dummy seed data for the database for testing purposes

-- Dummy seed data for the users table
INSERT INTO creatorlink.users (cognito_sub, username, email, first_name, last_name, phone_number)
VALUES
('sub1', 'user1', 'user1@example.com', 'John', 'Doe', '1234567890'),
('sub2', 'user2', 'user2@example.com', 'Jane', 'Smith', '0987654321'),
('sub3', 'user3', 'user3@example.com', 'Alice', 'Johnson', '5555555555'),
('sub4', 'user4', 'user4@example.com', 'Bob', 'Brown', '4444444444'),
('sub5', 'user5', 'user5@example.com', 'Charlie', 'Davis', '3333333333');

-- Dummy seed data for the user_profiles table
INSERT INTO creatorlink.user_profiles (user_id, bio)
SELECT id, 'Bio for ' || username
FROM creatorlink.users;

-- SQL to delete all dummy data and reset identity sequences
-- TRUNCATE TABLE creatorlink.user_profiles RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE creatorlink.users RESTART IDENTITY CASCADE;