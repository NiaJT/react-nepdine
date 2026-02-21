import React, { useState } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean; // ✅ new prop
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties; // optional wrapper styling
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false, // default false
  placeholder,
  className,
  style,
  containerStyle,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: fill ? "100%" : width,
        height: fill ? "100%" : height,
        overflow: "hidden",
        ...containerStyle,
      }}
      className={className}
    >
      {/* Placeholder */}
      {placeholder && !loaded && (
        <img
          src={placeholder}
          alt="placeholder"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(20px)",
            transform: "scale(1.05)",
            transition: "opacity 0.3s",
          }}
        />
      )}

      {/* Main Image */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"} // ✅ use priority
        style={{
          position: fill ? "absolute" : "relative",
          inset: fill ? 0 : undefined,
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          display: "block",
          ...style,
        }}
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </div>
  );
};

export default Image;
