module.exports = class Data1721924207047 {
    name = 'Data1721924207047'

    async up(db) {
        await db.query(`CREATE INDEX "IDX_f702d8ab77e40da621977ffe11" ON "send_packet" ("sequence") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_f702d8ab77e40da621977ffe11"`)
    }
}
