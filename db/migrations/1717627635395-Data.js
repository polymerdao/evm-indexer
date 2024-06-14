module.exports = class Data1717627635395 {
    name = 'Data1717627635395'

    async up(db) {
        await db.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_4949ad24cb11b19cede6d7c3932"`)
        await db.query(`DROP INDEX "public"."IDX_4949ad24cb11b19cede6d7c393"`)
        await db.query(`ALTER TABLE "channel" DROP CONSTRAINT "UQ_4949ad24cb11b19cede6d7c3932"`)
        await db.query(`ALTER TABLE "channel" DROP COLUMN "cp_channel_id"`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_4949ad24cb11b19cede6d7c3932" FOREIGN KEY ("cp_channel_id") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`CREATE UNIQUE INDEX "IDX_4949ad24cb11b19cede6d7c393" ON "channel" ("cp_channel_id") `)
        await db.query(`ALTER TABLE "channel" ADD CONSTRAINT "UQ_4949ad24cb11b19cede6d7c3932" UNIQUE ("cp_channel_id")`)
        await db.query(`ALTER TABLE "channel" ADD "cp_channel_id" character varying`)
    }
}
