CREATE TABLE `attendance_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`classId` int NOT NULL,
	`beneficiaryId` int NOT NULL,
	`date` date NOT NULL,
	`present` boolean NOT NULL DEFAULT false,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attendance_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attendances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`beneficiaryId` int,
	`projectId` int,
	`type` enum('individual','group','family') NOT NULL,
	`date` date NOT NULL,
	`duration` int,
	`notes` text,
	`status` enum('completed','pending','canceled') NOT NULL DEFAULT 'completed',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `attendances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `beneficiaries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`birthDate` date,
	`gender` enum('male','female','other'),
	`ethnicity` varchar(100),
	`maritalStatus` varchar(50),
	`education` varchar(100),
	`income` enum('very_low','low','medium','high'),
	`occupation` varchar(255),
	`addressStreet` varchar(255),
	`addressNumber` varchar(20),
	`addressComplement` varchar(255),
	`addressCity` varchar(100),
	`addressState` varchar(2),
	`addressZipCode` varchar(10),
	`contactPhone` varchar(20),
	`contactEmail` varchar(320),
	`registrationDate` date NOT NULL,
	`status` enum('active','inactive','graduated') NOT NULL DEFAULT 'active',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `beneficiaries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `class_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`classId` int NOT NULL,
	`dayOfWeek` int,
	`startTime` varchar(5),
	`endTime` varchar(5),
	`location` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `class_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`projectId` int,
	`name` varchar(255) NOT NULL,
	`description` text,
	`educatorId` int,
	`startDate` date NOT NULL,
	`endDate` date,
	`maxParticipants` int,
	`status` enum('planning','active','completed') NOT NULL DEFAULT 'planning',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `classes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `indicators` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`targetValue` decimal(15,2),
	`currentValue` decimal(15,2) DEFAULT '0',
	`unit` varchar(100),
	`status` enum('on_track','at_risk','exceeded') NOT NULL DEFAULT 'on_track',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `indicators_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`subscriptionId` int,
	`invoiceNumber` varchar(50) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` enum('pending','paid','overdue','canceled') NOT NULL DEFAULT 'pending',
	`dueDate` date NOT NULL,
	`paidDate` date,
	`boletoUrl` varchar(500),
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoiceNumber_unique` UNIQUE(`invoiceNumber`)
);
--> statement-breakpoint
CREATE TABLE `licenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`licenseKey` varchar(100) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`renewalDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `licenses_id` PRIMARY KEY(`id`),
	CONSTRAINT `licenses_licenseKey_unique` UNIQUE(`licenseKey`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`userId` int,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`type` varchar(50),
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `page_customizations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`heroTitle` text,
	`heroDescription` text,
	`heroImage` varchar(500),
	`featuresSection` json,
	`testimonialSection` json,
	`ctaText` varchar(255),
	`footerText` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `page_customizations_id` PRIMARY KEY(`id`),
	CONSTRAINT `page_customizations_tenantId_unique` UNIQUE(`tenantId`)
);
--> statement-breakpoint
CREATE TABLE `project_actions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`milestoneId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`status` enum('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_actions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_evidences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actionId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`fileUrl` varchar(500) NOT NULL,
	`fileType` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_evidences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	`status` enum('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`objectives` text,
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	`budget` decimal(15,2),
	`status` enum('planning','active','completed','suspended') NOT NULL DEFAULT 'planning',
	`targetAudience` varchar(255),
	`location` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`proposalNumber` varchar(50) NOT NULL,
	`planId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` enum('draft','sent','accepted','rejected','expired') NOT NULL DEFAULT 'draft',
	`validUntil` date NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `proposals_id` PRIMARY KEY(`id`),
	CONSTRAINT `proposals_proposalNumber_unique` UNIQUE(`proposalNumber`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attendanceId` int NOT NULL,
	`referredTo` varchar(255) NOT NULL,
	`reason` text NOT NULL,
	`status` enum('pending','completed','rejected') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`projectId` int,
	`type` enum('financial','impact','activities','general') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` longtext,
	`status` enum('draft','submitted','approved','rejected') NOT NULL DEFAULT 'draft',
	`submittedAt` timestamp,
	`approvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscription_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`monthlyPrice` decimal(10,2) NOT NULL,
	`yearlyPrice` decimal(10,2),
	`maxUsers` int,
	`maxProjects` int,
	`maxBeneficiaries` int,
	`features` json,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscription_plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`planId` int NOT NULL,
	`status` enum('active','canceled','expired') NOT NULL DEFAULT 'active',
	`startDate` timestamp NOT NULL DEFAULT (now()),
	`endDate` timestamp,
	`autoRenew` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tenants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('osc','investor','both') NOT NULL,
	`cnpj` varchar(20),
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`website` varchar(255),
	`description` text,
	`logo` varchar(500),
	`status` enum('pending','active','suspended','inactive') NOT NULL DEFAULT 'pending',
	`subscriptionPlanId` int,
	`licenseExpiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tenants_id` PRIMARY KEY(`id`),
	CONSTRAINT `tenants_cnpj_unique` UNIQUE(`cnpj`)
);
--> statement-breakpoint
CREATE TABLE `theme_customizations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`primaryColor` varchar(7) NOT NULL DEFAULT '#10b981',
	`secondaryColor` varchar(7) NOT NULL DEFAULT '#059669',
	`textColor` varchar(7) NOT NULL DEFAULT '#000000',
	`backgroundColor` varchar(7) NOT NULL DEFAULT '#ffffff',
	`logoUrl` varchar(500),
	`faviconUrl` varchar(500),
	`platformName` varchar(255) NOT NULL DEFAULT 'ImpactoHub',
	`fontFamily` varchar(100) NOT NULL DEFAULT 'Inter',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `theme_customizations_id` PRIMARY KEY(`id`),
	CONSTRAINT `theme_customizations_tenantId_unique` UNIQUE(`tenantId`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','client_admin','client_user','investor') NOT NULL DEFAULT 'client_user';--> statement-breakpoint
ALTER TABLE `users` ADD `tenantId` int;