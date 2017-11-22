CREATE TABLE list (
	user_id SERIAL PRIMARY KEY,
	task VARCHAR(50),
	description VARCHAR(200),
	due_date DATE,
	completed VARCHAR(1)
);