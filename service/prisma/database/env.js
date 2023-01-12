"use strict";

// pwd = ../../
// create .env file if not exists

// comment out the current existing key "DATABASE_URL" in .env file
// on next line, add the following line
// 1
// # local test db
// 2
// DATABASE_URL="mongodb://root:password@localhost:27017/main?authSource=admin"

const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "../../.env");

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, "");
}

const _comment =
  "# --------------------------------------------------------------------------------";

const _content = `
# local test db (this line was added by prisma/database/env.js)
DATABASE_URL="mongodb://root:password@localhost:27017/main?authSource=admin"`;

const env = fs.readFileSync(envPath, "utf-8");

if (env.includes(_content)) {
  return;
} else {
  const envLines = env.split("\n");
  const existing = envLines.some((line) => line.startsWith("DATABASE_URL"));

  if (existing) {
    const newEnv = envLines
      .map((line) => {
        if (line.startsWith("DATABASE_URL")) {
          // comment out the existing line
          return "# " + line;
        } else {
          return line;
        }
      })
      .join("\n");

    fs.writeFileSync(envPath, newEnv);
  }

  // append the new content
  fs.appendFileSync(envPath, `\n\n${_comment}` + _content + `\n${_comment}\n`);
}
