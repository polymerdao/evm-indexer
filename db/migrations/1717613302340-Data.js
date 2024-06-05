module.exports = class Data1717613302340 {
    name = 'Data1717613302340'

    async up(db) {
        await db.query(`CREATE TABLE "channel_catch_up_error" ("id" character varying NOT NULL, "init_to_try_polymer_gas" integer NOT NULL, "init_to_confirm_polymer_gas" integer NOT NULL, "init_to_ack_polymer_gas" integer NOT NULL, CONSTRAINT "PK_efd4113be1b514928b05c7a6390" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "packet_catch_up_error" ("id" character varying NOT NULL, "send_to_recv_polymer_gas" integer NOT NULL, "send_to_ack_polymer_gas" integer NOT NULL, CONSTRAINT "PK_e228c867ac213c7b17ec6b1d353" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "channel" ADD "catchup_error_id" character varying`)
        await db.query(`ALTER TABLE "channel" ADD CONSTRAINT "UQ_d3d44ade5b42a220185027e46b7" UNIQUE ("catchup_error_id")`)
        await db.query(`ALTER TABLE "packet" ADD "catchup_error_id" character varying`)
        await db.query(`ALTER TABLE "packet" ADD CONSTRAINT "UQ_3098da566998b9eff83556a5ccf" UNIQUE ("catchup_error_id")`)
        await db.query(`CREATE UNIQUE INDEX "IDX_d3d44ade5b42a220185027e46b" ON "channel" ("catchup_error_id") `)
        await db.query(`CREATE UNIQUE INDEX "IDX_3098da566998b9eff83556a5cc" ON "packet" ("catchup_error_id") `)
        await db.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_d3d44ade5b42a220185027e46b7" FOREIGN KEY ("catchup_error_id") REFERENCES "channel_catch_up_error"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "packet" ADD CONSTRAINT "FK_3098da566998b9eff83556a5ccf" FOREIGN KEY ("catchup_error_id") REFERENCES "packet_catch_up_error"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "channel_catch_up_error"`)
        await db.query(`DROP TABLE "packet_catch_up_error"`)
        await db.query(`ALTER TABLE "channel" DROP COLUMN "catchup_error_id"`)
        await db.query(`ALTER TABLE "channel" DROP CONSTRAINT "UQ_d3d44ade5b42a220185027e46b7"`)
        await db.query(`ALTER TABLE "packet" DROP COLUMN "catchup_error_id"`)
        await db.query(`ALTER TABLE "packet" DROP CONSTRAINT "UQ_3098da566998b9eff83556a5ccf"`)
        await db.query(`DROP INDEX "public"."IDX_d3d44ade5b42a220185027e46b"`)
        await db.query(`DROP INDEX "public"."IDX_3098da566998b9eff83556a5cc"`)
        await db.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_d3d44ade5b42a220185027e46b7"`)
        await db.query(`ALTER TABLE "packet" DROP CONSTRAINT "FK_3098da566998b9eff83556a5ccf"`)
    }
}