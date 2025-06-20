import { getImageURL } from '../img';

export const getImageHandler = async (request: Request): Promise<Response> => {
	const url = getImageURL();

	const headers = url ? { 'Location': url } : undefined;
	const status = url ? 302 : 404;

	return new Response(null, {
		status,
		headers
	});
};
