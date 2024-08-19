import { forwardRef, useImperativeHandle, useRef } from "react";
import ReactQuill, { ReactQuillProps } from "react-quill";
import type  Quill  from "quill";

export interface QuillInstance {
  getEditor: () => Quill;
}
const ReactQuillWithRef = forwardRef<QuillInstance, ReactQuillProps>((props, ref) => {
  const quillRef = useRef<ReactQuill>(null);

  useImperativeHandle(ref, () => ({
    getEditor: () => {
      if (quillRef.current) {
        return quillRef.current.getEditor();
      }
      throw new Error("Quill instance is not available");
    }
  }));

  return <ReactQuill ref={quillRef} {...props} />;
});
ReactQuillWithRef.displayName = "ReactQuillWithRef";
export default ReactQuillWithRef;
