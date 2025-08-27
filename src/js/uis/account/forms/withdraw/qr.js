export default class QRScanner {
	constructor(config, video, canvas, resultElement) {
			// DOM elements
			this.video = video || document.createElement('video');
			this.canvas = canvas || document.createElement('canvas');
			this.resultElement = resultElement || document.createElement('p');
			
			// Canvas context
			this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
			
			// Scanner state
			this.scanning = false;
			this.stream = null;
			
			// Scanner settings
			this.settings = {
					scanRegion: {
							x: 0.2,  // 20% from left
							y: 0.2,  // 20% from top
							width: 0.6,  // 60% of width
							height: 0.6  // 60% of height
					},
					threshold: 128,  // Threshold for binary image conversion
					...config
			};

			// Bind methods to instance
			this.scanFrame = this.scanFrame.bind(this);
	}

	async start() {
			try {
					this.stream = await navigator.mediaDevices.getUserMedia({
							video: {
									facingMode: 'environment',
									width: { ideal: 640 },
									height: { ideal: 480 }
							}
					});

					this.video.srcObject = this.stream;
					await this.video.play();

					// Set canvas dimensions
					this.canvas.width = this.video.videoWidth;
					this.canvas.height = this.video.videoHeight;

					// Start scanning
					this.scanning = true;
					this.scanFrame();
					
					this.resultElement.textContent = 'Scanner started';
			} catch (err) {
					console.error('Error starting scanner:', err);
					this.resultElement.textContent = 'Error starting scanner: ' + err.message;
			}
	}

	stop() {
			this.scanning = false;
			if (this.stream) {
					this.stream.getTracks().forEach(track => track.stop());
					this.stream = null;
			}
			this.resultElement.textContent = 'Scanner stopped';
	}

	scanFrame() {
			if (!this.scanning) return;

			if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
					// Draw video frame to canvas
					this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
					
					// Get image data from scan region
					const scanRegion = this.settings.scanRegion;
					const imageData = this.ctx.getImageData(
							this.canvas.width * scanRegion.x,
							this.canvas.height * scanRegion.y,
							this.canvas.width * scanRegion.width,
							this.canvas.height * scanRegion.height
					);

					// Process image
					this.processImage(imageData);
					
					// Detect patterns
					const patterns = this.findPatterns(imageData);
					
					// Update result
					if (patterns.length > 0) {
							this.resultElement.textContent = 'Potential QR code detected! Position: ' + 
									JSON.stringify(patterns[0]);
					} else {
							this.resultElement.textContent = 'Scanning...';
					}
			}

			// Continue scanning
			requestAnimationFrame(this.scanFrame);
	}

	processImage(imageData) {
			const data = imageData.data;
			for (let i = 0; i < data.length; i += 4) {
					const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
					const binary = avg > this.settings.threshold ? 255 : 0;
					data[i] = data[i + 1] = data[i + 2] = binary;
			}
			return imageData;
	}

	findPatterns(imageData) {
			const patterns = [];
			const data = imageData.data;
			const width = imageData.width;
			const height = imageData.height;

			for (let y = 0; y < height - 7; y++) {
					for (let x = 0; x < width - 7; x++) {
							if (this.checkFinderPattern(data, x, y, width)) {
									patterns.push({ x, y });
							}
					}
			}

			return patterns;
	}

	checkFinderPattern(data, startX, startY, width) {
			const centerX = startX + 3;
			const centerY = startY + 3;
			
			const centerIndex = (centerY * width + centerX) * 4;
			if (data[centerIndex] !== 0) return false;

			let black = 0;
			let white = 0;

			for (let x = startX; x < startX + 7; x++) {
					const idx = (centerY * width + x) * 4;
					if (data[idx] === 0) black++;
					else white++;
			}

			return black >= 3 && white >= 2;
	}

	// Add event handling capabilities
	addEventListener(eventName, callback) {
			this.eventListeners = this.eventListeners || {};
			this.eventListeners[eventName] = this.eventListeners[eventName] || [];
			this.eventListeners[eventName].push(callback);
	}

	removeEventListener(eventName, callback) {
			if (this.eventListeners && this.eventListeners[eventName]) {
					this.eventListeners[eventName] = 
							this.eventListeners[eventName].filter(cb => cb !== callback);
			}
	}

	emit(eventName, data) {
			if (this.eventListeners && this.eventListeners[eventName]) {
					this.eventListeners[eventName].forEach(callback => callback(data));
			}
	}
}

// Initialize scanner
const qrScanner = new QRScanner({
	// Optional configuration
	scanRegion: {
			x: 0.2,
			y: 0.2,
			width: 0.6,
			height: 0.6
	},
	threshold: 128
});