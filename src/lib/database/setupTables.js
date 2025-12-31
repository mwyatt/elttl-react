export default async function setupTables (connection) {
  const commands = [
    `
CREATE TABLE tennisYear (
    id    INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name  VARCHAR(10) NOT NULL,
    value LONGTEXT NOT NULL COMMENT 'can be very large as older archives are just html constructs',
    PRIMARY KEY (id)
) CHARSET = utf8mb3;
  `,
    `
create table options
(
    id    int unsigned auto_increment
        primary key,
    name  varchar(255) default '' not null,
    value varchar(255) default '' not null
)
    charset = utf8mb3;
  `,
    `
CREATE TABLE tennisEncounter (
    id                    INT UNSIGNED AUTO_INCREMENT,
    yearId                INT UNSIGNED NOT NULL,
    playerIdLeft          INT UNSIGNED NULL,
    playerIdRight         INT UNSIGNED NULL,
    scoreLeft             TINYINT UNSIGNED NULL,
    scoreRight            TINYINT UNSIGNED NULL,
    playerRankChangeLeft  TINYINT NULL,
    playerRankChangeRight TINYINT NULL,
    fixtureId             INT UNSIGNED NULL,
    status                VARCHAR(20) NULL,
    PRIMARY KEY (id),
    INDEX yearId_idx (yearId),
    INDEX fixtureId_idx (fixtureId),
    INDEX playerIdLeft_idx (playerIdLeft),
    INDEX playerIdRight_idx (playerIdRight)
) CHARSET = utf8mb3;
  `,
    `
CREATE TABLE tennisFixture (
    id            INT UNSIGNED AUTO_INCREMENT,
    yearId        INT UNSIGNED NOT NULL,
    teamIdLeft    INT UNSIGNED NOT NULL,
    teamIdRight   INT UNSIGNED NOT NULL,
    timeFulfilled INT UNSIGNED NULL,
    weekId        INT          NULL,
    PRIMARY KEY (id),
    INDEX yearId_idx (yearId),
    INDEX teamIdLeft_idx (teamIdLeft),
    INDEX teamIdRight_idx (teamIdRight)
) CHARSET = utf8mb3;
`,
`
CREATE TABLE tennisPlayer (
    id                INT UNSIGNED AUTO_INCREMENT,
    yearId            INT UNSIGNED NOT NULL,
    nameFirst         VARCHAR(75)  DEFAULT '' NULL,
    nameLast          VARCHAR(75)  DEFAULT '' NULL,
    slug              VARCHAR(255) NULL,
    ${'`rank`'}            INT UNSIGNED NULL,
    phoneLandline     VARCHAR(30)  DEFAULT '' NULL,
    phoneMobile       VARCHAR(30)  DEFAULT '' NULL,
    ettaLicenseNumber VARCHAR(10)  DEFAULT '' NULL,
    teamId            INT UNSIGNED NULL,
    INDEX id_idx (id),
    INDEX yearId_idx (yearId),
    INDEX teamId_idx (teamId)
) CHARSET = utf8mb3;
`,
`    
CREATE TABLE tennisTeam (
    id          INT UNSIGNED AUTO_INCREMENT,
    yearId      INT UNSIGNED NOT NULL,
    name        VARCHAR(75)  NULL,
    slug        VARCHAR(255) NULL,
    homeWeekday TINYINT(1)   NULL,
    secretaryId INT UNSIGNED NULL,
    venueId     INT UNSIGNED NULL,
    divisionId  INT UNSIGNED NULL,
    INDEX id_idx (id),
    INDEX yearId_idx (yearId),
    INDEX secretaryId_idx (secretaryId),
    INDEX venueId_idx (venueId),
    INDEX divisionId_idx (divisionId)
) CHARSET = utf8mb3;
`,
`
CREATE TABLE tennisDivision (
    id     INT UNSIGNED AUTO_INCREMENT,
    yearId INT UNSIGNED NOT NULL,
    name   VARCHAR(20) NULL,
    INDEX id_idx (id),
    INDEX yearId_idx (yearId)
) CHARSET = utf8mb3;
`,
`
CREATE TABLE tennisVenue (
    id       INT UNSIGNED AUTO_INCREMENT,
    yearId   INT UNSIGNED NOT NULL,
    name     VARCHAR(75)  NULL,
    slug     VARCHAR(255) NULL,
    location VARCHAR(200) NULL,
    INDEX id_idx (id),
    INDEX yearId_idx (yearId)
) CHARSET = utf8mb3;
`,
    `
create table tennisWeek
(
    id        int unsigned     not null,
    timeStart int unsigned     not null,
    type      tinyint unsigned not null,
    yearId    int unsigned     not null,
    primary key (id, yearId),
    constraint tennisWeek_ibfk_1
        foreign key (yearId) references tennisYear (id)
);
    `
  ]

  await Promise.all(commands.map(command => connection.query(command)))

  return connection
}
