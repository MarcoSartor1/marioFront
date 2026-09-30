import Image from '@/components/ui/image/StoreImage';

interface Props {
  src?: string;
  alt: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
  style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
}

export const ProductImage = ({
  src,
  alt,
  className,
  style,
  width,
  height,
  fill,
  sizes,
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
        sizes={sizes ?? "(max-width: 639px) 50vw, 25vw"}
        className={ className }
        style={ style }
      />
    );
  }

  return (
    <Image
      src={ localSrc }
      sizes={sizes}
      width={ width }
      height={ height }
      alt={ alt }
      className={ className }
      style={ style }
    />
  );
};
