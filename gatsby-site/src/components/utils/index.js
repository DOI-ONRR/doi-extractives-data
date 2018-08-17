export const getSlug = (name) => {
	return Slugify(name, {lower:true, remove: /[$*_+~.()'"!\:@,]/g}).replace('-and-','-');
}