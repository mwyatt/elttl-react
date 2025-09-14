select * from ad;

INSERT INTO ad (title, description, url, action, timeCreated, status, image, groupKey) VALUES ('Welcome to Season 2025', 'Welcome to the new season, download the handbook for fixtures and more.', 'handbook-2025-2026.pdf', 'Download', null, 1, null, 'home-primary');

INSERT INTO ad (title, description, url, action, timeCreated, status, image, groupKey) VALUES ('Competitions Schedule', 'Find out more about the various competitions being held this season.', 'competitions-schedule-2025-2026.pdf', 'Download', null, 1, null, 'home-primary');

UPDATE ad t SET t.status = 0 WHERE t.id = 18