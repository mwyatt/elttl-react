import express from 'express';
import database from './src/database.js';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/', (req, res, next) => {
  res.status(200).json('Welcome!');
});

app.get('/press', (req, res, next) => {
  try {
    res.status(200).json([{id: 1, name: 'Post 1', email: 'test'}]);
  } catch (err) {
    next(err);
  }
});

app.get('/press/:slug', async (req, res, next) => {
  const connection = await database.getConnection();

  const [presses] = await connection.execute(`
      SELECT title, html, timePublished, CONCAT(user.nameFirst, ' ', user.nameLast) AS author
      FROM content
               LEFT JOIN user ON content.userId = user.id
      WHERE type = 'press'
        AND slug = :slug
  `, {slug: req.params.slug});

  try {
    res.status(200).json(presses[0]);
  } catch (err) {
    next(err);
  }
});


app.get('/result', async (req, res, next) => {
  const connection = await database.getConnection();

  const [years] = await connection.query(`
      SELECT name
      FROM tennisYear
      ORDER BY name DESC
  `);

  try {
    res.status(200).json(years);
  } catch (err) {
    next(err);
  }
});

app.get('/fixture', async (req, res, next) => {
  const connection = await database.getConnection();

  console.log(req.query)

  const [currentYears] = await connection.execute(`
      SELECT id
      FROM tennisYear
      WHERE name = ?
  `, [req.query.year]);
  const currentYear = currentYears[0]

  const [teamLefts] = await connection.execute(`
      select id, name, venueId
      from tennisTeam
      where slug = ?
        and yearId = ?
  `, [req.query.teamLeftSlug, currentYear.id]);
  const teamLeft = teamLefts[0]

  const [teamRights] = await connection.execute(`
      select id, name, venueId
      from tennisTeam
      where slug = ?
        and yearId = ?
  `, [req.query.teamRightSlug, currentYear.id]);
  const teamRight = teamRights[0]

  const [venuess] = await connection.execute(`
      select name, slug
      from tennisVenue
      where id = ?
        and yearId = ?
  `, [teamLeft.venueId, currentYear.id]);
  const venue = venuess[0]

  const [fixtures] = await connection.execute(`
      select id, timeFulfilled
      from tennisFixture
      where teamIdLeft = ?
        and teamIdRight = ?
        and yearId = ?
        and timeFulfilled IS NOT NULL
  `, [teamLeft.id, teamRight.id, currentYear.id]);
  const fixture = fixtures[0]

  const [encounters] = await connection.execute(`
      select CONCAT(tp.nameFirst, ' ', tp.nameLast)   AS playerLeftName,
             tp.slug                                  AS playerLeftSlug,
             te.playerRankChangeLeft,
             te.scoreLeft,
             CONCAT(tpr.nameFirst, ' ', tpr.nameLast) AS playerRightName,
             tpr.slug                                 AS playerRightSlug,
             te.playerRankChangeRight,
             te.scoreRight,
             te.status
      from tennisEncounter te
               inner join tennisPlayer tp on te.playerIdLeft = tp.id and tp.yearId = :yearId
               inner join tennisPlayer tpr on te.playerIdRight = tpr.id AND tpr.yearId = :yearId
      where te.fixtureId = :fixtureId
        and te.yearId = :yearId
  `, {
    yearId: currentYear.id,
    fixtureId: fixture.id,
  });

  res.status(200).json({
    teamLeft: teamLeft,
    teamRight: teamRight,
    venue: venue,
    fixture: fixture,
    encounters: encounters
  });
});

app.get('/result/:year', async (req, res, next) => {
  const connection = await database.getConnection();

  const [currentYears] = await connection.execute(`
      SELECT id
      FROM tennisYear
      WHERE name = ?
  `, [req.params.year]);
  const currentYear = currentYears[0]

  const [divisions] = await connection.execute(`
      SELECT name
      FROM tennisDivision
      WHERE yearId = ?
  `, [currentYear.id]);

  try {
    res.status(200).json(divisions);
  } catch (err) {
    next(err);
  }
});

app.get('/venue', async (req, res, next) => {
  const connection = await database.getConnection();

  const [currentYears] = await connection.execute(`
      SELECT id
      FROM tennisYear
      WHERE name = ?
  `, [req.query.yearName]);
  const currentYear = currentYears[0]

  const [venues] = await connection.execute(`
      SELECT id, name, slug, location
      FROM tennisVenue
      WHERE yearId = ?
        AND slug = ?
  `, [currentYear.id, req.query.venueSlug]);
  const venue = venues[0]
 
  const [teams] = await connection.execute(`
      SELECT tt.name, tt.slug, tt.homeWeekday, LOWER(td.name) AS divisionSlug
      FROM tennisTeam tt
               LEFT JOIN tennisDivision td ON tt.divisionId = td.id AND td.yearId = tt.yearId
      WHERE tt.yearId = ?
        AND tt.venueId = ?
  `, [currentYear.id, venue.id]);

  try {
    res.status(200).json({venue: venue, teams: teams});
  } catch (err) {
    next(err);
  }
});

app.get('/result/:year/:division', async (req, res, next) => {
  const connection = await database.getConnection();

  const [yearDivisionIds] = await connection.execute(`
      SELECT td.id AS divisionId,
             ty.id AS yearId
      FROM tennisDivision td
               LEFT JOIN tennisYear ty ON ty.id = td.yearId
      WHERE ty.name = ?
        AND td.name = ?
  `, [req.params.year, req.params.division]);

  const yearDivisionId = yearDivisionIds[0]

  const [leagueTable] = await connection.execute(`
      SELECT tt.name            AS teamLeftName,
             tt.slug            AS teamLeftSlug,
             SUM(te.scoreLeft)  as teamLeftScoreTotal,
             ttr.name           AS teamRightName,
             ttr.slug           AS teamRightSlug,
             SUM(te.scoreRight) as teamRightScoreTotal,
             tf.timeFulfilled
      FROM tennisFixture tf
               LEFT JOIN tennisTeam tt ON tt.id = tf.teamIdLeft AND tt.divisionId = ? AND tt.yearId = ?
               LEFT JOIN tennisTeam ttr ON ttr.id = tf.teamIdRight AND ttr.divisionId = ? AND ttr.yearId = ?
               LEFT JOIN tennisEncounter te ON te.fixtureId = tf.id
      WHERE tf.timeFulfilled IS NOT NULL
        AND tf.yearId = ?
        AND tt.divisionId = ?
        AND tt.yearId = ?
      GROUP BY tf.id
  `, [
    yearDivisionId.divisionId, yearDivisionId.yearId,
    yearDivisionId.divisionId, yearDivisionId.yearId,
    yearDivisionId.yearId, yearDivisionId.divisionId, yearDivisionId.yearId
  ]);

  try {
    res.status(200).json(leagueTable);
  } catch (err) {
    next(err);
  }
});

app.get('/frontend', async (req, res, next) => {
  const connection = await database.getConnection();

  const [currentYears] = await connection.query(`
      SELECT id, name
      FROM tennisYear
      WHERE id = 12
  `);
  const currentYear = currentYears[0]

  const [divisions] = await connection.execute(`
      SELECT name
      FROM tennisDivision
      WHERE yearId = ?
  `, [currentYear.id]);

  let divisionsChildren = []

  divisions.forEach((division) => {
    divisionsChildren.push({
      name: division.name,
      url: `/result/${currentYear.name}/${division.name.toLowerCase()}`,
      children: [
        {name: 'League Table', url: `/result/${currentYear.name}/${division.name.toLowerCase()}`},
        {name: 'Merit Table', url: `/result/${currentYear.name}/${division.name.toLowerCase()}/merit`},
        {name: 'Doubles Merit Table', url: `/result/${currentYear.name}/${division.name.toLowerCase()}/merit-doubles`},
      ]
    })
  })

  try {
    res.status(200).json({
      headLinks: [
        {name: 'Prepaid Practice Scheme', url: '/page/pepaid-practice-scheme'},
        {name: 'Results Archive', url: '/results'},
        {name: 'Contact Us', url: '/contact-us'},
        {name: 'Town Teams', url: '/contact-us'},
        {name: 'Lancashire County TT Assoc', url: '/contact-us'},
        {name: 'GDPR', url: '/contact-us'},
        {name: 'Code of Conduct', url: '/contact-us'},
        {name: 'Safeguarding Policy', url: '/contact-us'},
      ],
      footLinks: [
        {area: 1, name: 'Coaching', url: '/page/pepaid-practice-scheme'},
        {area: 1, name: 'Schools', url: '/results'},
        {area: 1, name: 'Summer League', url: '/contact-us'},
        {area: 1, name: 'Fred Holden Cup', url: '/contact-us'},
        {area: 1, name: 'Local Clubs', url: '/contact-us'},
        {area: 1, name: 'Rules', url: '/contact-us'},
        {area: 2, name: 'Prepaid Practice Scheme', url: '/page/pepaid-practice-scheme'},
        {area: 2, name: 'Results Archive', url: '/page/pepaid-practice-scheme'},
        {area: 2, name: 'Contact Us', url: '/page/pepaid-practice-scheme'},
        {area: 2, name: 'Town Teams', url: '/page/pepaid-practice-scheme'},
        {area: 2, name: 'Lancashire County TT Assoc', url: '/page/pepaid-practice-scheme'},
        {area: 2, name: 'GDPR', url: '/page/pepaid-practice-scheme'},
        {area: 2, name: 'Code of Conduct', url: '/page/pepaid-practice-scheme'},
        {area: 2, name: 'Safeguarding Policy', url: '/page/pepaid-practice-scheme'},
      ],
      menuPrimary: [
        {
          name: 'The League', url: '/', children: [
            {name: 'Handbook', url: '/asset/elttl-handbook.pdf'},
            {name: 'Fixtures', url: '/asset/league-fixtures-2023-2024.xlsx'},
            {name: 'Press Releases', url: '/press'},
            {name: 'Competitions', url: '/page/competitions'},
            {name: 'Contact us', url: '/contact-us'},
          ]
        },
        {
          name: 'Results', url: '/results', children: divisionsChildren
        }
      ],
    });
  } catch (err) {
    next(err);
  }
});

app.get('/homepage', async (req, res, next) => {
  const connection = await database.getConnection();

  const [currentYears] = await connection.query(`
      SELECT name
      FROM tennisYear
      WHERE id = 12
  `);
  const currentYear = currentYears[0].name

  const [advertisementsPrimary] = await connection.query(`
      SELECT id, title, description, url, action
      FROM ad
      WHERE status = 1
        AND groupKey = 'home-primary'
  `);

  const [advertisementsSecondary] = await connection.query(`
      SELECT id, title, description, url, action
      FROM ad
      WHERE status = 1
        AND groupKey = 'small-primary'
  `);

  const [latestPress] = await connection.query(`
      SELECT id, timePublished, title, slug
      FROM content
      WHERE type = 'press'
        AND status = 1
      ORDER BY timePublished DESC LIMIT 5
  `);

  const [latestFixtures] = await connection.query(`
      SELECT timeFulfilled,
             ttl.name AS teamLeftName,
             ttl.slug AS teamLeftSlug,
             ttr.name AS teamRightName,
             ttr.slug AS teamRightSlug
      FROM tennisFixture
               LEFT JOIN tennisTeam AS ttl ON tennisFixture.teamIdLeft = ttl.id AND ttl.yearId = 12
               LEFT JOIN tennisTeam AS ttr
                         ON tennisFixture.teamIdRight = ttr.id AND ttr.yearId = 12
      WHERE tennisFixture.yearId = 12
        AND timeFulfilled IS NOT NULL
      ORDER BY timeFulfilled LIMIT 6
  `);

  latestPress.forEach((press) => {
    press.url = `/press/${press.slug}`
  })

  try {
    res.status(200).json({
      advertisementsPrimary: advertisementsPrimary,
      advertisementsSecondary: advertisementsSecondary,
      latestPress: latestPress,
      latestFixtures: latestFixtures,
      currentYear: currentYear,
      galleryImages: [
        {id: 1, url: 'https://eastlancstt.org.uk/thumb/championships-2017/GH4R0857.jpg'},
        {id: 2, url: 'https://eastlancstt.org.uk/thumb/championships-2017/GH4R0575.jpg'},
        {id: 3, url: 'https://eastlancstt.org.uk/thumb/championships-2017/GH4R0635.jpg'},
        {id: 2, url: 'https://eastlancstt.org.uk/thumb/championships-2017/GH4R0575.jpg'},
        {id: 3, url: 'https://eastlancstt.org.uk/thumb/championships-2017/GH4R0635.jpg'},
      ]
    });
  } catch (err) {
    next(err);
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));