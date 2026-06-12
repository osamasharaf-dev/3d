import { memo } from "react";

/**
 * Drop-in <img> replacement that auto-serves AVIF → WebP → original.
 *
 * Rules:
 *  - Local paths ending in .png / .jpg / .jpeg → wraps in <picture>
 *    with AVIF source (best compression) + WebP source (wide support)
 *  - Already-WebP local paths → adds only AVIF source
 *  - Already-AVIF, data: URIs, or external URLs → plain <img>, zero overhead
 *  - All standard <img> props are forwarded transparently
 *
 * Usage:
 *   <PictureImg src="/projects/hero.jpg" alt="…" className="…" />
 *   <PictureImg src={importedWebpAsset}  alt="…" />
 */

function toAvif(src) {
  if (typeof src === "string" && src.startsWith("/")) {
    return src.replace(/\.(png|jpe?g|webp)$/i, ".avif");
  }
  return null;
}

function toWebP(src) {
  if (typeof src === "string" && src.startsWith("/") && /\.(png|jpe?g)$/i.test(src)) {
    return src.replace(/\.(png|jpe?g)$/i, ".webp");
  }
  return null;
}

const PictureImg = memo(({ src, alt = "", className, style, ...rest }) => {
  const avifSrc = toAvif(src);
  const webpSrc = toWebP(src);

  if (!avifSrc && !webpSrc) {
    return (
      <img src={src} alt={alt} className={className} style={style} {...rest} />
    );
  }

  return (
    <picture>
      {avifSrc && <source type="image/avif" srcSet={avifSrc} />}
      {webpSrc && <source type="image/webp" srcSet={webpSrc} />}
      <img src={src} alt={alt} className={className} style={style} {...rest} />
    </picture>
  );
});

PictureImg.displayName = "PictureImg";
export default PictureImg;
