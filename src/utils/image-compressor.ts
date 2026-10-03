/**
 * Client-side Image Compression Utility using HTML5 Canvas
 * Prevents HTTP 413 (Payload Too Large / Entity Too Large) errors by resizing
 * high-resolution camera photos and compressing them before uploading.
 */

export interface ImageCompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    outputType?: string;
}

export async function compressImage(
    file: File,
    options: ImageCompressionOptions = {}
): Promise<File> {
    const {
        maxWidth = 1600,
        maxHeight = 1600,
        quality = 0.82,
        outputType = 'image/webp',
    } = options;

    // SVG or non-raster images don't need canvas compression
    if (!file.type.startsWith('image/') || file.type.includes('svg')) {
        return file;
    }

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                let { width, height } = img;

                // Scale down while preserving aspect ratio if dimensions exceed maximum bounds
                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(file);
                    return;
                }

                // Smooth image rendering quality
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            resolve(file);
                            return;
                        }

                        const nameWithoutExt =
                            file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                        const ext = outputType === 'image/webp' ? 'webp' : 'jpg';
                        const compressedFile = new File([blob], `${nameWithoutExt}.${ext}`, {
                            type: outputType,
                            lastModified: Date.now(),
                        });

                        // Only use compressed file if it's smaller than the original
                        resolve(compressedFile.size < file.size ? compressedFile : file);
                    },
                    outputType,
                    quality
                );
            };

            img.onerror = () => resolve(file);
        };

        reader.onerror = () => resolve(file);
    });
}

export async function compressImages(
    files: File[],
    options?: ImageCompressionOptions
): Promise<File[]> {
    return Promise.all(files.map((file) => compressImage(file, options)));
}
