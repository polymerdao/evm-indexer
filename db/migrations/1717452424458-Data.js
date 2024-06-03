module.exports = class Data1717452424458 {
    name = 'Data1717452424458'

    async up(db) {
        await db.query(`ALTER TABLE "stat" ADD "version" text`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "stat" DROP COLUMN "version"`)
    }
}
