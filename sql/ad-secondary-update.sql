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

