create table elttl_test.tennisEncounter
(
    id                    int unsigned,
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
    on elttl_test.tennisEncounter (fixtureId);

create index id
    on elttl_test.tennisEncounter (id);

create index playerIdLeft
    on elttl_test.tennisEncounter (playerIdLeft);

create index playerIdRight
    on elttl_test.tennisEncounter (playerIdRight);

create index yearId
    on elttl_test.tennisEncounter (yearId);

alter table elttl_test.tennisEncounter
    modify id int unsigned auto_increment;

create table elttl_test.tennisFixture
(
    id            int unsigned,
    yearId        int unsigned not null,
    teamIdLeft    int unsigned not null,
    teamIdRight   int unsigned not null,
    timeFulfilled int unsigned null
)
    charset = utf8mb3;

create index id
    on elttl_test.tennisFixture (id);

create index teamIdLeft
    on elttl_test.tennisFixture (teamIdLeft);

create index teamIdRight
    on elttl_test.tennisFixture (teamIdRight);

create index yearId
    on elttl_test.tennisFixture (yearId);

alter table elttl_test.tennisFixture
    modify id int unsigned auto_increment;

create table elttl_test.tennisPlayer
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
    on elttl_test.tennisPlayer (id);

create index teamId
    on elttl_test.tennisPlayer (teamId);

create index yearId
    on elttl_test.tennisPlayer (yearId);

alter table elttl_test.tennisPlayer
    modify id int unsigned auto_increment;

create table elttl_test.tennisTeam
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
    on elttl_test.tennisTeam (divisionId);

create index id
    on elttl_test.tennisTeam (id);

create index secretaryId
    on elttl_test.tennisTeam (secretaryId);

create index venueId
    on elttl_test.tennisTeam (venueId);

create index yearId
    on elttl_test.tennisTeam (yearId);

alter table elttl_test.tennisTeam
    modify id int unsigned auto_increment;

create table elttl_test.options
(
    id    int unsigned auto_increment
        primary key,
    name  varchar(255) default '' not null,
    value varchar(255) default '' not null
)
    charset = utf8mb3;

create table elttl_test.tennisYear
(
    id    int unsigned,
    name  varchar(10) not null,
    value longtext    not null comment 'can be very large as older archives are just html constructs'
)
    charset = utf8mb3;
