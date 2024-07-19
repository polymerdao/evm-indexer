module.exports = class Data1721346886946 {
    name = 'Data1721346886946'

    async up(db) {
        await db.query(`CREATE TABLE "transaction" ("id" character varying NOT NULL, "transaction_hash" text NOT NULL, "block_number" numeric NOT NULL, "block_timestamp" numeric NOT NULL, "chain_id" integer NOT NULL, "from" text NOT NULL, "to" text, "value" numeric NOT NULL, "gas" numeric NOT NULL, "gas_price" numeric, "max_fee_per_gas" numeric, "max_priority_fee_per_gas" numeric, "gas_used" numeric NOT NULL, "cumulative_gas_used" numeric NOT NULL, "transaction_type" integer NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_d86c9069481cdeb4adb7199b86" ON "transaction" ("transaction_hash") `)
        await db.query(`CREATE INDEX "IDX_2d99bb5a0ab5fb8cf8b746eb39" ON "transaction" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_bf7f889412fc52430b609e70b4" ON "transaction" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_45d29ac87dac85293d3c4ab6bd" ON "transaction" ("chain_id") `)
        await db.query(`CREATE INDEX "IDX_290df3897fac99713afb5f3d7a" ON "transaction" ("from") `)
        await db.query(`CREATE INDEX "IDX_1713783ebe978fa2ae9654e4bb" ON "transaction" ("to") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "transaction"`)
        await db.query(`DROP INDEX "public"."IDX_d86c9069481cdeb4adb7199b86"`)
        await db.query(`DROP INDEX "public"."IDX_2d99bb5a0ab5fb8cf8b746eb39"`)
        await db.query(`DROP INDEX "public"."IDX_bf7f889412fc52430b609e70b4"`)
        await db.query(`DROP INDEX "public"."IDX_45d29ac87dac85293d3c4ab6bd"`)
        await db.query(`DROP INDEX "public"."IDX_290df3897fac99713afb5f3d7a"`)
        await db.query(`DROP INDEX "public"."IDX_1713783ebe978fa2ae9654e4bb"`)
    }
}
