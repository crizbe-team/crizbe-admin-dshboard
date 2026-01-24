'use client';

import React, { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// ---------------------------
// Mouse tracking hook
// ---------------------------
interface MousePos {
    x: number;
    y: number;
}

function useMousePosition(): MousePos {
    const [mousePosition, setMousePosition] = useState<MousePos>({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    return mousePosition;
}

// ---------------------------
// Types
// ---------------------------
interface ImageParticlesProps extends ComponentPropsWithoutRef<'div'> {
    images: string[]; // required: sprite URLs
    className?: string;
    quantity?: number; // number of sprites
    staticity?: number; // higher = slower attraction to cursor
    ease?: number; // lower = snappier follow
    size?: number; // base sprite size in px (each will jitter around this)
    refresh?: boolean; // re-seed sprites when toggled
    vx?: number; // global drift X
    vy?: number; // global drift Y
    rotate?: boolean; // enable rotation
    rotationSpeedRange?: [number, number]; // degrees per frame (min, max)
    alphaEdgeFade?: boolean; // fade near edges
    preserveAspect?: 'contain' | 'cover' | 'stretch'; // how to fit image to sprite box
}

type SpriteImage = {
    el: HTMLImageElement;
    w: number;
    h: number;
};

type Sprite = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number; // square box for drawing (width or height baseline)
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
    imgIndex: number; // index into loaded images array
    rotation: number; // radians
    rotationSpeed: number; // radians per frame
};

// ---------------------------
// Utils
// ---------------------------
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const degToRad = (deg: number) => (deg * Math.PI) / 180;

const remapValue = (value: number, start1: number, end1: number, start2: number, end2: number) => {
    const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
};

function loadImages(urls: string[]): Promise<SpriteImage[]> {
    const jobs = urls.map(
        (url) =>
            new Promise<SpriteImage>((resolve, reject) => {
                const img = new Image();
                // If images are same-origin (e.g., in /public), CORS line is not required.
                // Keep it for flexibility; remove if it causes any issues with local files.
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve({ el: img, w: img.naturalWidth, h: img.naturalHeight });
                img.onerror = reject;
                img.src = url;
            })
    );
    return Promise.all(jobs);
}

function fitSize(
    mode: 'contain' | 'cover' | 'stretch',
    targetW: number,
    targetH: number,
    srcW: number,
    srcH: number
) {
    if (mode === 'stretch') {
        return { dw: targetW, dh: targetH };
    }
    const srcRatio = srcW / srcH;
    const targetRatio = targetW / targetH;

    if (mode === 'contain') {
        if (srcRatio > targetRatio) {
            // wider than target
            const dw = targetW;
            const dh = targetW / srcRatio;
            return { dw, dh };
        } else {
            const dh = targetH;
            const dw = targetH * srcRatio;
            return { dw, dh };
        }
    } else {
        // cover
        if (srcRatio > targetRatio) {
            // wider than target -> height fits, width overflows
            const dh = targetH;
            const dw = targetH * srcRatio;
            return { dw, dh };
        } else {
            const dw = targetW;
            const dh = targetW / srcRatio;
            return { dw, dh };
        }
    }
}

// ---------------------------
// Component
// ---------------------------
export const ImageParticles: React.FC<ImageParticlesProps> = ({
    images,
    className = '',
    quantity = 100,
    staticity = 60,
    ease = 40,
    size = 36,
    refresh = false,
    vx = 0.02,
    vy = 0.01,
    rotate = false,
    rotationSpeedRange = [-0.2, 0.2],
    alphaEdgeFade = true,
    preserveAspect = 'contain',
    ...props
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    const spritesRef = useRef<Sprite[]>([]);
    const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const rafID = useRef<number | null>(null);
    const resizeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [loadedImages, setLoadedImages] = useState<SpriteImage[] | null>(null);
    const mousePos = useMousePosition();

    // Load sprite images
    useEffect(() => {
        let cancelled = false;
        if (!images || images.length === 0) {
            setLoadedImages([]);
            return;
        }
        loadImages(images)
            .then((imgs) => !cancelled && setLoadedImages(imgs))
            .catch(() => !cancelled && setLoadedImages([]));
        return () => {
            cancelled = true;
        };
    }, [images]);

    // Init canvas and animation when images are ready or core params change
    useEffect(() => {
        if (!loadedImages) return;
        if (canvasRef.current) ctxRef.current = canvasRef.current.getContext('2d');

        initCanvas();
        startAnimation();

        const handleResize = () => {
            if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
            resizeTimeout.current = setTimeout(() => {
                initCanvas();
            }, 200);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            if (rafID.current != null) cancelAnimationFrame(rafID.current);
            if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
            window.removeEventListener('resize', handleResize);
        };
        // Re-init when quantity/size or images change
    }, [loadedImages, quantity, size]);

    // Update mouse relative to canvas center
    useEffect(() => {
        onMouseMove();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mousePos.x, mousePos.y]);

    // External refresh
    useEffect(() => {
        if (refresh) initCanvas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    const initCanvas = () => {
        setupCanvas();
        if (loadedImages) seedSprites(quantity, loadedImages);
        drawFrame(); // avoid blank flash
    };

    const setupCanvas = () => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!container || !canvas || !ctx) return;

        canvasSize.current.w = container.offsetWidth;
        canvasSize.current.h = container.offsetHeight;

        canvas.width = Math.max(1, Math.floor(canvasSize.current.w * dpr));
        canvas.height = Math.max(1, Math.floor(canvasSize.current.h * dpr));
        canvas.style.width = `${canvasSize.current.w}px`;
        canvas.style.height = `${canvasSize.current.h}px`;

        // Reset transform to CSS pixels
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seedSprites = (count: number, imgs: SpriteImage[]) => {
        const { w, h } = canvasSize.current;
        const arr: Sprite[] = [];
        for (let i = 0; i < count; i++) {
            // jitter size a bit for visual variety
            const jitter = Math.random() * 0.6 + 0.7; // 0.7x .. 1.3x
            const spriteSize = size * jitter;
            const targetAlpha = parseFloat((Math.random() * 0.6 + 0.2).toFixed(2));
            const [minDeg, maxDeg] = rotationSpeedRange;
            const rotationSpeedDeg = rotate ? Math.random() * (maxDeg - minDeg) + minDeg : 0;
            const rotationSpeedRad = degToRad(rotationSpeedDeg);

            arr.push({
                x: Math.random() * w,
                y: Math.random() * h,
                translateX: 0,
                translateY: 0,
                size: spriteSize,
                alpha: 0,
                targetAlpha,
                dx: (Math.random() - 0.5) * 0.15,
                dy: (Math.random() - 0.5) * 0.15,
                magnetism: 0.1 + Math.random() * 4,
                imgIndex: Math.floor(Math.random() * Math.max(1, imgs.length)),
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: rotationSpeedRad,
            });
        }
        spritesRef.current = arr;
    };

    const onMouseMove = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const { w, h } = canvasSize.current;
        const x = mousePos.x - rect.left - w / 2;
        const y = mousePos.y - rect.top - h / 2;
        const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
        if (inside) {
            mouse.current.x = x;
            mouse.current.y = y;
        }
    };

    const clearCtx = () => {
        const ctx = ctxRef.current;
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
    };

    const step = () => {
        const arr = spritesRef.current;
        const { w, h } = canvasSize.current;

        for (let i = arr.length - 1; i >= 0; i--) {
            const s = arr[i];

            // Alpha based on proximity to edges (optional)
            if (alphaEdgeFade) {
                const edgeDistances = [
                    s.x + s.translateX - s.size / 2,
                    w - (s.x + s.translateX) - s.size / 2,
                    s.y + s.translateY - s.size / 2,
                    h - (s.y + s.translateY) - s.size / 2,
                ];
                const closestEdge = Math.min(...edgeDistances);
                const remapClosest = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
                if (remapClosest > 1) {
                    s.alpha = clamp(s.alpha + 0.02, 0, s.targetAlpha);
                } else {
                    s.alpha = s.targetAlpha * remapClosest;
                }
            } else {
                // fade in to targetAlpha
                s.alpha = clamp(s.alpha + 0.02, 0, s.targetAlpha);
            }

            // Motion & magnetism
            s.x += s.dx + vx;
            s.y += s.dy + vy;
            const denom = ease || 1;
            s.translateX += (mouse.current.x / (staticity / s.magnetism) - s.translateX) / denom;
            s.translateY += (mouse.current.y / (staticity / s.magnetism) - s.translateY) / denom;

            // Rotation
            if (rotate) s.rotation += s.rotationSpeed;

            // Respawn when out of bounds
            if (s.x < -s.size || s.x > w + s.size || s.y < -s.size || s.y > h + s.size) {
                const jitter = Math.random() * 0.6 + 0.7;
                const spriteSize = size * jitter;
                const targetAlpha = parseFloat((Math.random() * 0.6 + 0.2).toFixed(2));
                const [minDeg, maxDeg] = rotationSpeedRange;
                const rotationSpeedDeg = rotate ? Math.random() * (maxDeg - minDeg) + minDeg : 0;
                const rotationSpeedRad = degToRad(rotationSpeedDeg);

                arr[i] = {
                    x: Math.random() * w,
                    y: Math.random() * h,
                    translateX: 0,
                    translateY: 0,
                    size: spriteSize,
                    alpha: 0,
                    targetAlpha,
                    dx: (Math.random() - 0.5) * 0.15,
                    dy: (Math.random() - 0.5) * 0.15,
                    magnetism: 0.1 + Math.random() * 4,
                    imgIndex:
                        loadedImages && loadedImages.length > 0
                            ? Math.floor(Math.random() * loadedImages.length)
                            : 0,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: rotationSpeedRad,
                };
            }
        }
    };

    const drawSprite = (s: Sprite) => {
        const ctx = ctxRef.current;
        if (!ctx || !loadedImages || loadedImages.length === 0) return;
        const img = loadedImages[s.imgIndex];
        if (!img) return;

        const drawX = s.x + s.translateX;
        const drawY = s.y + s.translateY;

        // Fit the image within an s.size x s.size box based on preserveAspect
        const { dw, dh } = fitSize(preserveAspect, s.size, s.size, img.w, img.h);

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.translate(drawX, drawY);
        if (rotate) {
            ctx.rotate(s.rotation);
        }
        // Center the image
        ctx.drawImage(img.el, -dw / 2, -dh / 2, dw, dh);
        ctx.restore();
    };

    const drawFrame = () => {
        const ctx = ctxRef.current;
        if (!ctx) return;
        // Keep transform consistent each frame (CSS pixel coordinates)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        clearCtx();
        const arr = spritesRef.current;
        for (let i = 0; i < arr.length; i++) drawSprite(arr[i]);
    };

    const animate = () => {
        step();
        drawFrame();
        rafID.current = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
        if (rafID.current != null) cancelAnimationFrame(rafID.current);
        rafID.current = requestAnimationFrame(animate);
    };

    return (
        <div
            className={cn('pointer-events-none', className)}
            ref={containerRef}
            aria-hidden="true"
            {...props}
        >
            <canvas ref={canvasRef} className="size-full" />
        </div>
    );
};
