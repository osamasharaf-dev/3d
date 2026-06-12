import { memo } from "react";

/**
 * Drop-in replacement for <img> that serves WebP automatically.
 *
 * Rules:
 *  - Local paths ending in .png / .jpg / .jpeg  → adds a WebP <source>
 *  - Already-WebP or external URLs              → plain <img>, no overhead
 *  - All standard <img> props are forwarded transparently
 *
 * Usage:
 *   <PictureImg src="/projects/hero.jpg" alt="…" className="…" />
 *   <PictureImg src={importedWebpAsset}  alt="…" />   ← no-op wrapper
 */

function toWebP(src) {
  if (typeof src === "string" && src.startsWith("/") && /\.(png|jpe?g)$/i.test(src)) {
    return src.replace(/\.(png|jpe?g)$/i, ".webp");
  }
  return null;
}

const PictureImg = memo(({ src, alt = "", className, style, ...rest }) => {
  const webpSrc = toWebP(src);

  if (!webpSrc) {
    return (
      <img src={src} alt={alt} className={className} style={style} {...rest} />
    );
  }

  return (
    <picture>
      <source type="image/webp" srcSet={webpSrc} />
      <img src={src} alt={alt} className={className} style={style} {...rest} />
    </picture>
  );
});

PictureImg.displayName = "PictureImg";
export default PictureImg;
