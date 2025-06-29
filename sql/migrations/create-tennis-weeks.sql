drop table if exists tennisWeek;

create table tennisWeek
(
    id          int unsigned not null auto_increment primary key,
    description varchar(255) null,
    yearId      int unsigned not null,
        timeStart int unsigned null
)
    charset = utf8mb3;

# Adjust tennisFixture table to reference tennisWeek
alter table tennisFixture
    add column weekId int unsigned null;
