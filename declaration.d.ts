// declarations.d.ts
declare module "react-slick" {
  import * as React from "react";

  export interface Settings {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
    arrows?: boolean;
    pauseOnHover?: boolean;
    initialSlide?: number;
    lazyLoad?: boolean;
    responsive?: Array<{ breakpoint: number; settings: Partial<Settings> }>;
  }

  export class Slider extends React.Component<Settings, any> {}
  export default Slider;
}
