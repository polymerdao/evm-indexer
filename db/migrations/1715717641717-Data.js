module.exports = class Data1715717641717 {
    name = 'Data1715717641717'

    async up(db) {
        await db.query(`CREATE TABLE "stat" ("id" character varying NOT NULL, "name" text NOT NULL, "val" integer NOT NULL, "chain_id" integer NOT NULL, CONSTRAINT "PK_132de903d366f4c06cd586c43c0" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "stat"`)
    }
}
