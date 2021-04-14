console.log('process.env.DATABASE_URL=> ', process.env.DATABASE_URL);
const isTsNode = !!process.env.TS_NODE;

module.exports = {
  "type": "postgres",
  "url": process.env.DATABASE_URL,
  "entities": [
    `${isTsNode ? "src": "dist"}/modules/**/infra/typeorm/entities/**/*.{ts,js}`
  ],
  "migrations": [
    `${isTsNode ? "src": "dist"}/shared/infra/typeorm/migrations/**/*.{ts,js}`
  ],
  "cli": {
    "migrationsDir": ["src/shared/infra/typeorm/migrations/"]
  }
}
