declare module "embla-carousel-react" {
  import type { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
  const useEmblaCarousel: (
    options?: EmblaOptionsType
  ) => [(node: HTMLElement | null) => void, EmblaCarouselType | undefined];
  export default useEmblaCarousel;
  export type { EmblaOptionsType };
}
