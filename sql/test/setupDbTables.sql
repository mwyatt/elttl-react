#  no longer required, remove me!





-- auto-generated definition

# --------------------------------

create table tennisYear
(
    id    int unsigned,
    name  varchar(10) not null,
    value longtext    not null comment 'can be very large as older archives are just html constructs'
)
    charset = utf8mb3;

create table options
(
    id    int unsigned auto_increment
        primary key,
    name  varchar(255) default '' not null,
    value varchar(255) default '' not null
)
    charset = utf8mb3;

create table tennisEncounter
(
    id                    int unsigned auto_increment,
    yearId                int unsigned     not null,
    playerIdLeft          int unsigned     null,
    playerIdRight         int unsigned     null,
    scoreLeft             tinyint unsigned null,
    scoreRight            tinyint unsigned null,
    playerRankChangeLeft  tinyint          null,
    playerRankChangeRight tinyint          null,
    fixtureId             int unsigned     null,
    status                varchar(20)      null
)
    charset = utf8mb3;

create index fixtureId
    on tennisEncounter (fixtureId);

create index id
    on tennisEncounter (id);

create index playerIdLeft
    on tennisEncounter (playerIdLeft);

create index playerIdRight
    on tennisEncounter (playerIdRight);

create index yearId
    on tennisEncounter (yearId);

alter table tennisEncounter
    modify id int unsigned auto_increment;

create table tennisFixture
(
    id            int unsigned,
    yearId        int unsigned not null,
    teamIdLeft    int unsigned not null,
    teamIdRight   int unsigned not null,
    timeFulfilled int unsigned null
)
    charset = utf8mb3;

create index id
    on tennisFixture (id);

create index teamIdLeft
    on tennisFixture (teamIdLeft);

create index teamIdRight
    on tennisFixture (teamIdRight);

create index yearId
    on tennisFixture (yearId);

alter table tennisFixture
    modify id int unsigned auto_increment;

create table tennisPlayer
(
    id                int unsigned,
    yearId            int unsigned           not null,
    nameFirst         varchar(75) default '' null,
    nameLast          varchar(75) default '' null,
    slug              varchar(255)           null,
    `rank`            int unsigned           null,
    phoneLandline     varchar(30) default '' null,
    phoneMobile       varchar(30) default '' null,
    ettaLicenseNumber varchar(10) default '' null,
    teamId            int unsigned           null
)
    charset = utf8mb3;

create index id
    on tennisPlayer (id);

create index teamId
    on tennisPlayer (teamId);

create index yearId
    on tennisPlayer (yearId);

alter table tennisPlayer
    modify id int unsigned auto_increment;

create table tennisTeam
(
    id          int unsigned,
    yearId      int unsigned not null,
    name        varchar(75)  null,
    slug        varchar(255) null,
    homeWeekday tinyint(1)   null,
    secretaryId int unsigned null,
    venueId     int unsigned null,
    divisionId  int unsigned null
)
    charset = utf8mb3;

create index divisionId
    on tennisTeam (divisionId);

create index id
    on tennisTeam (id);

create index secretaryId
    on tennisTeam (secretaryId);

create index venueId
    on tennisTeam (venueId);

create index yearId
    on tennisTeam (yearId);

alter table tennisTeam
    modify id int unsigned auto_increment;

create table tennisDivision
(
    id     int unsigned,
    yearId int unsigned not null,
    name   varchar(20)  null
)
    charset = utf8mb3;

create index id
    on tennisDivision (id);

create index yearId
    on tennisDivision (yearId);

alter table tennisDivision
    modify id int unsigned auto_increment;

create table tennisVenue
(
    id       int unsigned,
    yearId   int unsigned not null,
    name     varchar(75)  null,
    slug     varchar(255) null,
    location varchar(200) null
)
    charset = utf8mb3;

create index id
    on tennisVenue (id);

create index yearId
    on tennisVenue (yearId);

alter table tennisVenue
    modify id int unsigned auto_increment;
