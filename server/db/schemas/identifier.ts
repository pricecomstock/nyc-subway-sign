import sequelize from "sequelize";
import { nanoid } from "nanoid";
const { DataTypes } = sequelize;

export const identifierSchema = {
  id: {
    type: DataTypes.STRING(21),
    defaultValue: nanoid,
    primaryKey: true,
  },
  referrer: {
    type: DataTypes.STRING,
    defaultValue: "",
    validate: {
      len: [0, 255] as [number, number],
    },
  },
  width: {
    type: DataTypes.NUMBER,
    validate: {
      isInt: true,
    },
  },
  height: {
    type: DataTypes.NUMBER,
    validate: {
      isInt: true,
    },
  },
  originalIp: {
    type: DataTypes.STRING,
    validate: {
      isIP: true,
    },
  },
  userAgent: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 255] as [number, number],
    },
  },
};
