import Image from 'next/image';

interface Props {
  src?: string;
  alt: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
  style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
  width?: number;
  height?: number;
  fill?: boolean;
}

export const ProductImage = ({
  src,
  alt,
  className,
  style,
  width,
  height,
  fill,
}: Props) => {

  const localSrc = ( src )
    ? src.startsWith('http')
      ? src
      : `/products/${ src }`
    : '/imgs/placeholder.jpg';

  if (fill) {
    return (
      <Image
        src={ localSrc }
        alt={ alt }
        fill
        className={ className }
        style={ style }
      />
    );
  }

  return (
    <Image
      src={ localSrc }
      width={ width }
      height={ height }
      alt={ alt }
      className={ className }
      style={ style }
    />
  );
};
