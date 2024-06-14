module.exports = class Data1715902644807 {
    name = 'Data1715902644807'

    async up(db) {
        await db.query(`ALTER TABLE "send_packet" ADD "src_channel_id" text NOT NULL`)
        await db.query(`ALTER TABLE "send_packet" DROP CONSTRAINT "FK_5ea77435330a4843da773415b2e"`)
        await db.query(`ALTER TABLE "send_packet" ALTER COLUMN "source_channel_id" DROP NOT NULL`)
        await db.query(`ALTER TABLE "send_packet" ADD CONSTRAINT "FK_5ea77435330a4843da773415b2e" FOREIGN KEY ("source_channel_id") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "send_packet" DROP COLUMN "src_channel_id"`)
        await db.query(`ALTER TABLE "send_packet" ADD CONSTRAINT "FK_5ea77435330a4843da773415b2e" FOREIGN KEY ("source_channel_id") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "send_packet" ALTER COLUMN "source_channel_id" SET NOT NULL`)
        await db.query(`ALTER TABLE "send_packet" DROP CONSTRAINT "FK_5ea77435330a4843da773415b2e"`)
    }
}
