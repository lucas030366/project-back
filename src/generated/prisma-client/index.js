"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "Client",
    embedded: false
  },
  {
    name: "Order",
    embedded: false
  },
  {
    name: "Status",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `${process.env["PRISMA_ENDPOINT"]}/${
    process.env["PRISMA_SERVICE"]
  }/${process.env["PRISMA_STAGE"]}`
});
exports.prisma = new exports.Prisma();
