CREATE TABLE `loan` (
	`booking_id` int AUTO_INCREMENT NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	CONSTRAINT `loan_booking_id` PRIMARY KEY(`booking_id`)
);
