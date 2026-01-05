import Fastify from "fastify";
import { env } from "./env.js";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";

export const buildServer = () => {
  const app = Fastify({
    logger: env.NODE_ENV === "production"
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  return app;
}
