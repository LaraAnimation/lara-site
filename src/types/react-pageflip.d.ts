declare module "react-pageflip" {
  import type { CSSProperties, ReactNode, Ref } from "react";

  type FlipEvent = { data: number };
  type OrientationEvent = { data: "portrait" | "landscape" };
  type InitEvent = { data: { page: number; mode: "portrait" | "landscape" } };

  type HTMLFlipBookProps = {
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    width: number;
    height: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
    startPage?: number;
    renderOnlyPageLengthChange?: boolean;
    onFlip?: (e: FlipEvent) => void;
    onChangeOrientation?: (e: OrientationEvent) => void;
    onChangeState?: (e: FlipEvent) => void;
    onInit?: (e: InitEvent) => void;
    onUpdate?: (e: InitEvent) => void;
    ref?: Ref<unknown>;
  };

  const HTMLFlipBook: (props: HTMLFlipBookProps) => JSX.Element;
  export default HTMLFlipBook;
}
