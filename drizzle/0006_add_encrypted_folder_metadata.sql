ALTER TABLE "folders" ADD COLUMN "encrypted_metadata_nonce" text;--> statement-breakpoint
ALTER TABLE "folders" ADD COLUMN "encrypted_metadata_ciphertext" text;--> statement-breakpoint
ALTER TABLE "folders" ADD COLUMN "is_encrypted" boolean DEFAULT false NOT NULL;