drop table if exists bookmarks;
CREATE TABLE bookmarks (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  mark text not null
 );
INSERT INTO bookmarks
  (mark)
  VALUES 
  	('great stuff'),
  	('average stuff'),
  	('fun stuff'),
  	('happy stuff'),
  	('weird stuff'),
  	('same old stuff'),
  	('angry stuff'),
  	('patriotic stuff'),
  	('smelly stuff'),
  	('corny stuff'),
  	('also pretty great stuff');