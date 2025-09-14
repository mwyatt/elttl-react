select * from ad where id = 13;

update ad set
              action = 'View',
    title = 'Press Releases',
          description = 'Check out the latest press releases.',
          url = '/press'
          where id = 13;

update ad set
              url = '/handbook-2024-2025.pdf'
          where id = 3 and title = 'Get the Handbook';

update ad set
              url = '/handbook-2025-2026.pdf'
          where id = 3 and title = 'Get the Handbook';

UPDATE ad t SET t.title = 'Fixtures Generated 2025', t.description = 'The fixtures have been generated for the 2025 season, take a look!', t.url = 'result/2025/', t.action = 'Season Overview', t.status = 1 WHERE t.id = 4
UPDATE ad t SET t.status = 0 WHERE t.id = 13
