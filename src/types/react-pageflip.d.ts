declare module "react-pageflip" {
  import type { CSSProperties, ReactNode, Ref } from "react";

  type FlipEvent = { data: number };

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
    onChangeOrientation?: (e: FlipEvent) => void;
    onChangeState?: (e: FlipEvent) => void;
    onInit?: (e: FlipEvent) => void;
    onUpdate?: (e: FlipEvent) => void;
    ref?: Ref<unknown>;
  };

  const HTMLFlipBook: (props: HTMLFlipBookProps) => JSX.Element;
  export default HTMLFlipBook;
}
