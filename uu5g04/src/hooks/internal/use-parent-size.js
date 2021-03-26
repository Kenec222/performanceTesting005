import { useRef, useElementSize } from "uu5g05";

function useParentSize(params) {
  const { ref, width, height } = useElementSize(params);

  const componentRef = useRef();
  if (componentRef.current == null) {
    const spanRefFn = (spanRef) => ref(spanRef ? spanRef.parentNode : spanRef);
    componentRef.current = function Observer(props) {
      return <span ref={spanRefFn} hidden />;
    };
  }

  return { Resizer: componentRef.current, width, height };
}

export { useParentSize };
export default useParentSize;