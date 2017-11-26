CREATE TABLE list (
	user_id SERIAL PRIMARY KEY,
	task VARCHAR(50),
	description VARCHAR(200),
	due_date DATE,
	completed VARCHAR(1)
);

ALTER TABLE list ADD work_type VARCHAR(15);

ALTER TABLE list ADD work_time INTEGER;  

INSERT INTO list (task, description, due_date, completed, work_type) VALUES ('Clean Car', 'Vacuum out the car and wash the outside', '2017/12/08', 'N', 'home'),('Work on pie chart', 'work on generating a pie chart to show division of time spent on jobs', '2017/11/24', 'N', 'school'),('Time off request', 'Submit time off request for winter break travel to Italy', '2017/12/01', 'N', 'work'),('Paint', 'Finish painting models', '2018/01/01', 'N', 'other');

INSERT INTO list (task, description, due_date, completed, work_type, work_time) VALUES ('Gift Ideas', 'Come up with present ideas for friends and families', '2017/11/20', 'Y', 'other', 45), ('Laundry', 'Do laundry and set aside outfits for upcoming week', '2017/11/26', 'Y', 'home', 90), ('Flex Box Menu', 'Create a flex box menu to sort between web pages', '2017/11/25', 'Y', 'school', 30), ('Enter jobs', 'enter completed jobs for the week into the database', '2017/11/24', 'Y', 'work', 60);

DELETE FROM list WHERE user_id=24;

SELECT * FROM list ORDER BY due_date;

SELECT * FROM list ORDER BY completed; 

SELECT * FROM list WHERE user_id = 1;

UPDATE list SET completed = 'Y', work_time = '60' WHERE user_id= 19;
