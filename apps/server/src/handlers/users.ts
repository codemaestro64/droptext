import type { FastifyReply, FastifyRequest } from "fastify";
// import { users } from "../db/schema.js";

export async function listUsersHandler(
  _req: FastifyRequest,
  reply: FastifyReply
) {
  //const db = getDb();

  // Example:
  // const result = await db.select().from(users);

  reply.send({
    data: [],
    message: "users fetched"
  });
}
