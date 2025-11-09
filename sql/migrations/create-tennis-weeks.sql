use elttl_003;

drop table if exists tennisWeek;

create table tennisWeek
(
    id        int unsigned not null auto_increment primary key,
    yearId    int unsigned not null,
    type      varchar(24)  not null,
    timeStart int unsigned not null
)
    charset = utf8mb3;

# Adjust tennisFixture table to reference tennisWeek
alter table tennisFixture
    add column weekId int unsigned null;
