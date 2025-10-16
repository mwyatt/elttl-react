DROP TABLE IF EXISTS tennisWeeks;
DROP TABLE IF EXISTS tennisWeek;

# New tables which outline week commencing, to group up various events
CREATE TABLE tennisWeek
(
    id             INT unsigned not null,
    timeCommencing int unsigned NOT NULL KEY,
    type           varchar(50)  NOT NULL,
    yearId         INT unsigned NOT NULL,
    FOREIGN KEY (yearId) REFERENCES tennisYear(id)
);

create index id
    on tennisWeek (id);

# Example types
# 'fixture', 'holiday', 'tournament'

# Add a column to the tennisFixture table which will then point to the weekId
ALTER TABLE tennisFixture
    ADD COLUMN weekId INT DEFAULT NULL;

# ideas:
# you could say how many matches will be being played on a particular day at hyndburn