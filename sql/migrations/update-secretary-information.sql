UPDATE tennisPlayer SET phoneLandline = '01254 872193', phoneMobile = '07962308533' WHERE yearId = :yearId AND nameLast = 'Mason';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07834043694' WHERE yearId = :yearId AND nameLast = 'Milnes';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07775533866' WHERE yearId = :yearId AND nameLast = 'Hanson';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07774787343' WHERE yearId = :yearId AND nameLast = 'Bose';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07798713164' WHERE yearId = :yearId AND nameLast = 'Argile';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07973684517' WHERE yearId = :yearId AND nameLast = 'Hooper';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07733802734' WHERE yearId = :yearId AND nameLast = 'Sheard';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07879633355' WHERE yearId = :yearId AND nameLast = 'Pickles';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07881610874' WHERE yearId = :yearId AND nameFirst = 'Bernard' AND nameLast = 'Milnes';
UPDATE tennisPlayer SET phoneLandline = '01200 425005', phoneMobile = '07837686746' WHERE yearId = :yearId AND nameFirst = 'Phil' AND nameLast = 'Mileham';
UPDATE tennisPlayer SET phoneLandline = '01282 455068', phoneMobile = '07736473609' WHERE yearId = :yearId AND nameFirst = 'Darren' AND nameLast = 'Wright';
UPDATE tennisPlayer SET phoneLandline = '01619 983703', phoneMobile = '07714097341' WHERE yearId = :yearId AND nameFirst = 'Paul' AND nameLast = 'Wood';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07402899095' WHERE yearId = :yearId AND nameFirst = 'Ryan' AND nameLast = 'Fallon';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07737741851' WHERE yearId = :yearId AND nameFirst = 'Dan' AND nameLast = 'Bower';
UPDATE tennisPlayer SET phoneLandline = '01254 608565', phoneMobile = '07849958343' WHERE yearId = :yearId AND nameFirst = 'David' AND nameLast = 'Heys';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07767218668' WHERE yearId = :yearId AND nameFirst = 'Ian' AND nameLast = 'Mills';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07516004063' WHERE yearId = :yearId AND nameFirst = 'David' AND nameLast = 'Mottershead';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07484262288' WHERE yearId = :yearId AND nameFirst = 'Phillip' AND nameLast = 'Austin';
UPDATE tennisPlayer SET phoneLandline = '01282 455068', phoneMobile = '07885460165' WHERE yearId = :yearId AND nameFirst = 'James' AND nameLast = 'Balmforth';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07807636960' WHERE yearId = :yearId AND nameFirst = 'Mick' AND nameLast = 'Swindells';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07968101664' WHERE yearId = :yearId AND nameFirst = 'Chib' AND nameLast = 'Mistry';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07443874785' WHERE yearId = :yearId AND nameFirst = 'Geoff' AND nameLast = 'Brindle';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07948095224' WHERE yearId = :yearId AND nameFirst = 'Peter' AND nameLast = 'Hitchcock';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07456279590' WHERE yearId = :yearId AND nameFirst = 'Judith' AND nameLast = 'Glover';
UPDATE tennisPlayer SET phoneLandline = '', phoneMobile = '07503167547' WHERE yearId = :yearId AND nameFirst = 'Iain' AND nameLast = 'Clements';

INSERT INTO tennisPlayer (id, yearId, nameFirst, nameLast, slug, `rank`, phoneLandline, phoneMobile, ettaLicenseNumber, teamId)
VALUES (105, :yearId, 'Bryan', 'Edwards', 'bryan-edwards', 1039, '0161 7975082', '07538021102', '38160', null)

UPDATE tennisTeam SET secretaryId = 535 WHERE yearId = :yearId AND slug = 'spartans';
UPDATE tennisTeam SET secretaryId = 105 WHERE yearId = :yearId AND slug = 'ramsbottom-a';
UPDATE tennisTeam SET secretaryId = 439 WHERE yearId = :yearId AND slug = 'best-centre-phantoms';

