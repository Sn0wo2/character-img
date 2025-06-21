import { getImageHandler } from './handler/image';
import { corsMiddleware } from './middleware/cors';
import { noCacheMiddleware } from './middleware/no-cache';

type Middleware = (
	request: Request,
	next: (request: Request) => Promise<Response>
) => Promise<Response>;

function compose(...middlewares: Middleware[]) {
	return async function(request: Request): Promise<Response> {
		let index = -1;

		const dispatch = async (i: number, req: Request): Promise<Response> => {
			if (i <= index) {
				throw new Error('next() called multiple times');
			}
			index = i;

			const middleware = middlewares[i];

			if (middleware) {
				return middleware(req, (nextRequest) => dispatch(i + 1, nextRequest ?? req));
			}

			return new Response('Not Found', { status: 404 });
		};

		return dispatch(0, request);
	};
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return compose(
			corsMiddleware,
			noCacheMiddleware,
			getImageHandler
		)(request);
	}
} satisfies ExportedHandler<Env>;
