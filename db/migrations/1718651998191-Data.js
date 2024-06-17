module.exports = class Data1718651998191 {
    name = 'Data1718651998191'

    async up(db) {
        await db.query(`ALTER TABLE "send_packet" ADD "packet_data_sender" text`)
        await db.query(`ALTER TABLE "send_packet" ADD "uch_event_sender" text`)
        await db.query(`CREATE INDEX "IDX_ce88c75cf57a72b72c798f1a50" ON "send_packet" ("source_port_address") `)
        await db.query(`CREATE INDEX "IDX_a43ee030819914626cc4cbdf6c" ON "send_packet" ("src_channel_id") `)
        await db.query(`CREATE INDEX "IDX_bcfcabf86e08ff022c2693b1b6" ON "send_packet" ("packet") `)
        await db.query(`CREATE INDEX "IDX_c936ca50837754efb144173dc2" ON "send_packet" ("packet_data_sender") `)
        await db.query(`CREATE INDEX "IDX_299c8e7dc5a9ef6bee2d80b880" ON "send_packet" ("uch_event_sender") `)
        await db.query(`CREATE INDEX "IDX_d0773028996495e2589ee12a04" ON "recv_packet" ("dest_port_address") `)
        await db.query(`CREATE INDEX "IDX_bc65501e3f845deb6148efc648" ON "recv_packet" ("dest_channel_id") `)
    }

    async down(db) {
        await db.query(`ALTER TABLE "send_packet" DROP COLUMN "packet_data_sender"`)
        await db.query(`ALTER TABLE "send_packet" DROP COLUMN "uch_event_sender"`)
        await db.query(`DROP INDEX "public"."IDX_ce88c75cf57a72b72c798f1a50"`)
        await db.query(`DROP INDEX "public"."IDX_a43ee030819914626cc4cbdf6c"`)
        await db.query(`DROP INDEX "public"."IDX_bcfcabf86e08ff022c2693b1b6"`)
        await db.query(`DROP INDEX "public"."IDX_c936ca50837754efb144173dc2"`)
        await db.query(`DROP INDEX "public"."IDX_299c8e7dc5a9ef6bee2d80b880"`)
        await db.query(`DROP INDEX "public"."IDX_d0773028996495e2589ee12a04"`)
        await db.query(`DROP INDEX "public"."IDX_bc65501e3f845deb6148efc648"`)
    }
}
