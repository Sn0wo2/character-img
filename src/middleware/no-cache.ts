export const noCacheMiddleware = async (
	request: Request,
	next: (req: Request) => Promise<Response>
) => {
	const response = await next(request);

	response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
	response.headers.set('Pragma', 'no-cache');
	response.headers.set('Expires', '0');

	return response;
};
