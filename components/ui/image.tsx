import React, { useState } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  placeholder?: string; // blurred placeholder
  className?: string;
  style?: React.CSSProperties;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  placeholder,
  className,
  style,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
      className={className}
    >
      {/* Placeholder */}
      {placeholder && !loaded && (
        <img
          src={placeholder}
          alt="placeholder"
          style={{
            width: "100%",
            height: "100%",
            filter: "blur(20px)",
            transform: "scale(1.05)",
            position: "absolute",
            top: 0,
            left: 0,
            objectFit: "cover",
            transition: "opacity 0.3s",
          }}
        />
      )}

      {/* Main image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          display: "block",
        }}
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </div>
  );
};

export default Image;
