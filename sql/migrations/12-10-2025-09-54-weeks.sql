DROP TABLE IF EXISTS tennisWeek;

CREATE TABLE tennisWeek
(
    id        INT UNSIGNED     NOT NULL,
    timeStart INT UNSIGNED     NOT NULL,
    type      TINYINT UNSIGNED NOT NULL,
    yearId    INT UNSIGNED     NOT NULL,
    FOREIGN KEY (yearId) REFERENCES tennisYear (id),
    PRIMARY KEY (id, yearId)
);

# Add a column to the tennisFixture table which will then point to the weekId
ALTER TABLE tennisFixture
    ADD COLUMN weekId INT DEFAULT NULL;

# update all tennisFixture rows so that weekId is null
UPDATE tennisFixture
SET weekId = NULL where weekId IS not NULL;