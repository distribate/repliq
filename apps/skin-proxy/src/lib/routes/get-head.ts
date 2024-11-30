import { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import ky from "ky";
import { Buffer } from "buffer";
import { RequestParams } from '#lib/types/request-params';
import { server } from '#index';

const opts = {
	handler: async function(request: FastifyRequest, reply: FastifyReply) {
		const { nickname } = request.params as RequestParams;
		
		const url = `${server.config.SKIN_HEAD_ELY_URL}/${nickname.toLowerCase()}.png&scale=18.9&renderFace=1`;
		
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

const getHeadRoute: FastifyPluginCallback = function(
	instance: FastifyInstance, options: FastifyPluginOptions, done: () => void) {
	instance.get('/get-head/:nickname', opts);
	
	done();
};

export default getHeadRoute;