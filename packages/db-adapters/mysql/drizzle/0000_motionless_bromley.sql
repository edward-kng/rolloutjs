CREATE TABLE `rolloutjs_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`version` int NOT NULL DEFAULT 0,
	CONSTRAINT `rolloutjs_config_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rolloutjs_flags` (
	`key` varchar(255) NOT NULL,
	`name` varchar(255),
	`description` varchar(1024),
	`default_value` json NOT NULL,
	CONSTRAINT `rolloutjs_flags_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `rolloutjs_overrides` (
	`flag_key` varchar(255) NOT NULL,
	`targeting_key` varchar(255),
	`segment_key` varchar(255),
	`value` json NOT NULL,
	CONSTRAINT `rolloutjs_overrides_targeting_key_flag_key_unique` UNIQUE(`targeting_key`,`flag_key`),
	CONSTRAINT `rolloutjs_overrides_segment_key_flag_key_unique` UNIQUE(`segment_key`,`flag_key`),
	CONSTRAINT `targeting_or_segment_key` CHECK((targeting_key IS NOT NULL AND segment_key IS NULL) OR (targeting_key IS NULL AND segment_key IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE `rolloutjs_segments` (
	`key` varchar(255) NOT NULL,
	`name` varchar(255),
	`description` varchar(1024),
	`rules` json NOT NULL,
	`priority` int NOT NULL,
	CONSTRAINT `rolloutjs_segments_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
ALTER TABLE `rolloutjs_overrides` ADD CONSTRAINT `rolloutjs_overrides_flag_key_rolloutjs_flags_key_fk` FOREIGN KEY (`flag_key`) REFERENCES `rolloutjs_flags`(`key`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rolloutjs_overrides` ADD CONSTRAINT `rolloutjs_overrides_segment_key_rolloutjs_segments_key_fk` FOREIGN KEY (`segment_key`) REFERENCES `rolloutjs_segments`(`key`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
INSERT INTO `rolloutjs_config` (`version`) VALUES (0);