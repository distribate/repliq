import {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import ky from "ky";
import { SKIN_ELY_URL } from '#shared/urls';
import { RequestParams } from '#types/request-params';

const opts = {
  handler: async function (request: FastifyRequest, reply: FastifyReply) {
    const { nickname } = request.params as RequestParams;

    const url = `${SKIN_ELY_URL}/${nickname}.png`;

    try {
      const response = await ky.get(url);
      const buffer = Buffer.from(await response.arrayBuffer());

      reply
        .header(
          "Content-Disposition",
          `attachment; filename=${nickname}-skin.png`,
        )
        .type("image/png")
        .send(buffer);
    } catch (e) {
      const error = e instanceof Error ? e.message : "Error fetching the skin file"
      reply.status(500).send(error);
    }
  },
};

const downloadSkinRoute: FastifyPluginCallback = function (
  instance: FastifyInstance, options: FastifyPluginOptions, done: () => void,
) {
  instance.get("/download-skin/:nickname", opts);
  done();
};

export default downloadSkinRoute;