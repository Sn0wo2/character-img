import { getImageHandler } from './handler/image';
import { corsMiddleware } from './middleware/cors';

function compose(middleware: Array<(req: Request, next: (req: Request) => Promise<Response>) => Promise<Response>>) {
	return function(request: Request): Promise<Response> {
		let index = -1;

		async function dispatch(i: number, req: Request): Promise<Response> {
			if (i <= index) throw new Error('next() called multiple times');
			index = i;
			let fn = middleware[i];
			if (i === middleware.length) fn = getImageHandler;
			if (!fn) throw new Error('No middleware or handler');
			return fn(req, (r) => dispatch(i + 1, r));
		}

		return dispatch(0, request);
	};
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const handler = compose([
			corsMiddleware
		]);
		return handler(request);
	}
} satisfies ExportedHandler<Env>;
