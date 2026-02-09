DROP TABLE `activities`;--> statement-breakpoint
DROP TABLE `attendances`;--> statement-breakpoint
DROP TABLE `beneficiaries`;--> statement-breakpoint
DROP TABLE `indicators`;--> statement-breakpoint
DROP TABLE `investors`;--> statement-breakpoint
DROP TABLE `notifications`;--> statement-breakpoint
DROP TABLE `organizations`;--> statement-breakpoint
DROP TABLE `projectInvestments`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
DROP TABLE `reports`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin') NOT NULL DEFAULT 'user';