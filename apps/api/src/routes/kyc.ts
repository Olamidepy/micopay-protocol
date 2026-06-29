import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/auth.middleware.js";

// Stub routes for A-4 (frontend KYC screen — Drips)
// These return the correct response shape without calling Etherfuse.
// Replace with real Etherfuse API calls once API key is available (A-2).

export async function kycRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post<{
    Body: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      curp: string;
      rfc: string;
      dateOfBirth: string;
      occupation: string;
      address: {
        street: string;
        city: string;
        region: string;
        postalCode: string;
      };
    };
  }>(
    "/defi/kyc/submit",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      const { curp, rfc } = request.body ?? {};
      if (!curp || curp.length !== 18) {
        return reply.status(400).send({ error: "CURP debe tener 18 caracteres" });
      }
      if (!rfc || rfc.length < 12) {
        return reply.status(400).send({ error: "RFC invalido" });
      }
      return reply.send({
        customerId: `stub-kyc-${Date.now()}`,
        status: "pending",
        note: "stub — Etherfuse API not connected yet",
      });
    }
  );

  fastify.post(
    "/defi/kyc/documents",
    { preHandler: [authMiddleware] },
    async (_request, reply) => {
      return reply.send({
        uploaded: true,
        message: "Documentos recibidos (stub)",
        note: "stub — Etherfuse API not connected yet",
      });
    }
  );

  // In sandbox, Etherfuse auto-approves KYC with fake data.
  // This stub mirrors that behavior so the frontend flow can be completed end-to-end.
  fastify.get(
    "/defi/kyc/status",
    { preHandler: [authMiddleware] },
    async (_request, reply) => {
      return reply.send({
        status: "approved",
        note: "stub — always approved, mirrors Etherfuse sandbox behavior",
      });
    }
  );
}
