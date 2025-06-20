import { IMAGES } from '../config/constants';

export function getImageURL() {
	return IMAGES[Math.floor(Math.random() * IMAGES.length)];
}
