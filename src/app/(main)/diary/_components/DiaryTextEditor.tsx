"use client";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Delta, Sources } from "quill";
import { UnprivilegedEditor } from "react-quill";

const RichTextEditor: React.FC = () => {
  const [value, setValue] = useState<string>("");

  const handleChange = (content: string, delta: Delta, source: Sources, editor: UnprivilegedEditor): void => {
    setValue(editor.getHTML());
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"]
    ]
  };

  const formats = [
    "header",
    "font",
    "list",
    "bullet",
    "bold",
    "italic",
    "underline",
    "color",
    "background",
    "align",
    "link",
    "image"
  ];

  return (
    <div>
      <ReactQuill value={value} onChange={handleChange} modules={modules} formats={formats} />
      <div>
        <h3>Preview</h3>
        <div dangerouslySetInnerHTML={{ __html: value }} />
      </div>
    </div>
  );
};

export default RichTextEditor;
