import { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { RequestParams } from "../lib/types/request-params.js";
import ky from "ky";
import { server } from "../index.js";

const opts = {
	handler: async function(request: FastifyRequest, reply: FastifyReply) {
		const { nickname } = request.params as RequestParams;
		
		const url = `${server.config.SKIN_ELY_URL}/${nickname}.png`;
		
		try {
			const response = await ky.get(url)
			
			if (response.status === 404) {
				throw new Error('Image not found');
			}
			
			reply.header('Content-Type', response.headers.get('content-type'));
			
			const buffer = Buffer.from(await response.arrayBuffer());
			
			reply.status(200).send(buffer);
		} catch (error) {
			server.log.error('Error downloading image', error);
			
			reply.status(500).send('Error downloading image');
		}
	}
}

const getSkinRoute: FastifyPluginCallback = function(
	instance: FastifyInstance, options: FastifyPluginOptions, done: () => void) {
	instance.get('/get-skin/:nickname', opts);
	
	done();
};

export default getSkinRoute;