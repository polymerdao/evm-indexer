module.exports = class Data1717718568315 {
    name = 'Data1717718568315'

    async up(db) {
        await db.query(`CREATE UNIQUE INDEX "IDX_5083dcfc906a1053cd70bea046" ON "packet" ("send_packet_id", "recv_packet_id", "write_ack_packet_id", "ack_packet_id") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_5083dcfc906a1053cd70bea046"`)
    }
}
