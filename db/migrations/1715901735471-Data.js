module.exports = class Data1715901735471 {
    name = 'Data1715901735471'

    async up(db) {
        await db.query(`ALTER TABLE "channel" ADD "init_to_try_gas" integer`)
        await db.query(`ALTER TABLE "channel" ADD "init_to_ack_gas" integer`)
        await db.query(`ALTER TABLE "channel" ADD "init_to_confirm_gas" integer`)
        await db.query(`ALTER TABLE "packet" ADD "send_to_recv_polymer_gas" numeric`)
        await db.query(`ALTER TABLE "packet" ADD "send_to_ack_polymer_gas" numeric`)
        await db.query(`ALTER TABLE "stat" ADD "chain_id" integer NOT NULL`)
        await db.query(`ALTER TABLE "send_packet" DROP COLUMN "source_channel_id"`)
        await db.query(`ALTER TABLE "send_packet" ADD "source_channel_id" character varying NOT NULL`)
        await db.query(`CREATE INDEX "IDX_5ea77435330a4843da773415b2" ON "send_packet" ("source_channel_id") `)
        await db.query(`ALTER TABLE "send_packet" ADD CONSTRAINT "FK_5ea77435330a4843da773415b2e" FOREIGN KEY ("source_channel_id") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "channel" DROP COLUMN "init_to_try_gas"`)
        await db.query(`ALTER TABLE "channel" DROP COLUMN "init_to_ack_gas"`)
        await db.query(`ALTER TABLE "channel" DROP COLUMN "init_to_confirm_gas"`)
        await db.query(`ALTER TABLE "packet" DROP COLUMN "send_to_recv_polymer_gas"`)
        await db.query(`ALTER TABLE "packet" DROP COLUMN "send_to_ack_polymer_gas"`)
        await db.query(`ALTER TABLE "stat" DROP COLUMN "chain_id"`)
        await db.query(`ALTER TABLE "send_packet" ADD "source_channel_id" text NOT NULL`)
        await db.query(`ALTER TABLE "send_packet" DROP COLUMN "source_channel_id"`)
        await db.query(`DROP INDEX "public"."IDX_5ea77435330a4843da773415b2"`)
        await db.query(`ALTER TABLE "send_packet" DROP CONSTRAINT "FK_5ea77435330a4843da773415b2e"`)
    }
}
