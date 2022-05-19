import { identifierSchema } from "./schemas/identifier.js";

import pkg from "sequelize";
const { Model, Sequelize } = pkg;

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db.sqlite",
  sync: { alter: true },
  logging: () => {},
});

export class Identifier extends Model {}
Identifier.init(identifierSchema, { sequelize });

sequelize.sync();
