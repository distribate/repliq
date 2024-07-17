import { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { RequestParams } from "../lib/types/request-params.js";
import { server } from "../index.js";
import ky from "ky";

const opts = {
	handler: async function(
		request: FastifyRequest,
		reply: FastifyReply
	) {
		const { nickname } = request.params as RequestParams;
		
		const url = `${server.config.SKIN_ELY_URL}/${nickname}.png`;
		
		try {
			const response = await ky.get(url);
			const buffer = Buffer.from(await response.arrayBuffer());
			
			reply
			.header('Content-Disposition', `attachment; filename=${nickname}-skin.png`)
			.type('image/png')
			.send(buffer);
		} catch (error) {
			reply.status(500).send('Error fetching the file');
		}
	}
}

const downloadSkinRoute: FastifyPluginCallback = function(
	instance: FastifyInstance, options: FastifyPluginOptions, done: () => void
) {
	instance.get('/download-skin/:nickname', opts);
	
	done();
};

export default downloadSkinRoute;