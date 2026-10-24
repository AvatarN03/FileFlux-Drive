ALTER TABLE "files" ADD COLUMN "object_key" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "stream_header" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "encrypted_key_nonce" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "encrypted_key_ciphertext" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "encrypted_metadata_nonce" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "encrypted_metadata_ciphertext" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "is_encrypted" boolean DEFAULT false NOT NULL;