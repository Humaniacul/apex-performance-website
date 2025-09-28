# Assets Folder

## Required Assets

Replace these placeholder files with actual production assets:

### Images
- `bg-carbon.png` - Carbon fiber texture (200x200px minimum, tileable)
- `car-hero.jpg` - Main hero car image (1920x1080px minimum)
- `apex-hypercar.glb` - 3D car model file

### Recommended Image Specifications

#### Carbon Fiber Texture (`bg-carbon.png`)
- Size: 400x400px or 512x512px
- Format: PNG with transparency support
- Tileable: Pattern should seamlessly repeat
- Style: Dark carbon fiber weave texture
- Usage: Background texture overlay (via CSS)

#### Hero Car Image (`car-hero.jpg`)
- Size: 1920x1080px minimum (16:9 aspect ratio)
- Format: WEBP preferred, JPG fallback
- Quality: High resolution for Retina displays
- Content: Front 3/4 view of hypercar on dark background
- Usage: Hero section fallback image

#### 3D Model (`apex-hypercar.glb`)
- Format: glTF 2.0 binary (.glb)
- Size: <10MB for web performance
- Textures: PBR materials included
- Animations: Optional (idle rotation)
- Usage: Interactive 3D model viewer

## Image Optimization

All images should be:
1. Compressed for web delivery
2. Available in multiple formats (WEBP, AVIF, JPG/PNG)
3. Sized appropriately for responsive breakpoints
4. Optimized for Core Web Vitals (LCP)
