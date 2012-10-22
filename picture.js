(function(global) {

	function picture() {}

	picture.version = '0.1';

	picture.load = function() {
		var versions, i, length, vLength, j;
		picture.elements = [];
		containers = document.getElementsByTagName('div');

		for (i=0, length=containers.length; i < length; i++) {
			if (containers[i].className.match(/picutrePolyfill/)) {
				picture.elements.push(
				{
					node: containers[i],
					alt: containers[i].getAttribute('data-alt'),
					id: 'picture' + (Math.round(Math.random() * 10000)),
					sources: []
				});
			}
		}
		for (i=0, length=picture.elements.length; i < length; i++) {
			versions = picture.elements[i].node.getElementsByTagName('div');
			for (j=0, vLength=versions.length; j<vLength; j++) {
				picture.elements[i].sources[j] = {
					srcset: versions[j].getAttribute('data-srcset'),
					media: versions[j].getAttribute('data-media') || false
				};
			}
		}
		console.log(picture.elements);
		picture.resize();
	};

	picture.loadImage = function(images) {
		var img;
		if (images.length) {
			for (var i = images.length - 1; i >= 0; i--) {
				if (!document.getElementById(images[i].id)) {
					img = new Image();
					img.alt = images[i].alt;
					img.id = images[i].id;
					img.onload = function() {
						console.log(this);
						document.body.appendChild(img);
						};
					img.src = images[i].src;
					console.log(img);
				} else {
					document.getElementById(images[i].id).src = images[i].src;
				}
			}
		}
	};

	picture.resize = function() {
		var images =[], i, j, media, sources, l, sl;
		for (i=0, l=picture.elements.length; i<l; i++) {
			sources = picture.elements[i].sources;
			for (j=0, sl=sources.length; j<sl; j++) {
				media = sources[j].media;
				if (!media || (global.matchMedia && global.matchMedia(media).matches)) {
					images[i] = {
						src: sources[j].srcset,
						alt: picture.elements[i].alt,
						id: picture.elements[i].id
					};
				}
			}
		}
		picture.loadImage(images);
	};

	if (global.picture) {
		throw new Error('picture object already defined');
	} else {
		global.picture = picture;
	}

	if (global.addEventListener) {	// modern browsers
		global.addEventListener('load', picture.load, false);
		global.addEventListener('resize', picture.resize, false);
	} else if (global.attachEvent) {	// lt IE9
		global.attachEvent('onload', picture.load);
	}

})(typeof window === 'undefined' ? this : window);
