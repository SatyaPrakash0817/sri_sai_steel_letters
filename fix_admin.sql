UPDATE users SET password = '$2a$10$QWJ/p1anKapLYP6oCOBX7.HNrl6xoF4TbdzTqMgd9glHYSE8F6Q/K' WHERE email = 'admin@123.com';
SELECT email, password FROM users WHERE email = 'admin@123.com';