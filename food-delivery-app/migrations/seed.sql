INSERT INTO user (id, username, password, role, created_at) VALUES(1, 'admin', '$2b$12$dTkw6z/oIiL8E7J8HzwMs.AdshfaJjBsyq1w53waZvfhwH0Wu0n4C', 'ADMIN', DATE('now'));
INSERT INTO user (id, username, password, role, created_at) VALUES(2, 'tuser1', '$2b$12$KDOUfDo.1eO3WEb2/PM.Bu7oaay6kmbXqEfJs7rRyMAqTABSuYyjO', 'USER', DATE('now'));
INSERT INTO user (id, username, password, role, created_at) VALUES(3, 'tuser2', '$2b$12$KDOUfDo.1eO3WEb2/PM.Bu7oaay6kmbXqEfJs7rRyMAqTABSuYyjO', 'USER', DATE('now'));
INSERT INTO user (id, username, password, role, created_at) VALUES(4, 'tuser3', '$2b$12$KDOUfDo.1eO3WEb2/PM.Bu7oaay6kmbXqEfJs7rRyMAqTABSuYyjO', 'USER', DATE('now'));
INSERT INTO user (id, username, password, role, created_at) VALUES(5, 'towner1', '$2b$12$KDOUfDo.1eO3WEb2/PM.Bu7oaay6kmbXqEfJs7rRyMAqTABSuYyjO', 'OWNER', DATE('now'));
INSERT INTO user (id, username, password, role, created_at) VALUES(6, 'towner2', '$2b$12$KDOUfDo.1eO3WEb2/PM.Bu7oaay6kmbXqEfJs7rRyMAqTABSuYyjO', 'OWNER', DATE('now'));
INSERT INTO user (id, username, password, role, created_at) VALUES(7, 'tuser4', '$2b$12$KDOUfDo.1eO3WEb2/PM.Bu7oaay6kmbXqEfJs7rRyMAqTABSuYyjO', 'USER', DATE('now'));
INSERT INTO category VALUES (1, 'Primary 1', 1);
INSERT INTO category VALUES (2, 'Primary 2', 1);
INSERT INTO category VALUES (3, 'Secondary 1', 0);
INSERT INTO category VALUES (4, 'Secondary 2', 0);
INSERT INTO restaurant ('name', 'description', 'created_at', 'modified_at', 'owner_id') VALUES ('Test Restaurant', 'Test Restaurant Description', DATE('now'), DATE('now'), 5);
INSERT INTO restaurant_item VALUES (2, "Test Item 2", null, "Test Item Description", 1.05, 1);
INSERT INTO restaurant_item VALUES (1, "Test Item 1", null, "Test Item Description", 1.05, 1);
INSERT INTO restaurant_item VALUES (3, "Test Item 3", null, "Test Item Description", 1.05, 1);
INSERT INTO cart VALUES (1, 0, null, 1, 2);
INSERT INTO cart_item VALUES (1, 1, 1, 1);
INSERT INTO cart_item VALUES (2, 2, 1, 2);