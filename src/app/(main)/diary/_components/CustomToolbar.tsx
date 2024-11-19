"use client";
import QuillToolbarIconBold from "@/components/icons/diaries/QuillToolbarIconBold";
import QuillToolbarIconImage from "@/components/icons/diaries/QuillToolbarIconImage";
import QuillToolbarIconItalic from "@/components/icons/diaries/QuillToolbarIconItalic";
import QuillToolbarIconLIst from "@/components/icons/diaries/QuillToolbarIconLIst";
import QuillToolbarIconTextAlignCenter from "@/components/icons/diaries/QuillToolbarIconTextAlignCenter";
import QuillToolbarIconTextAlignLeft from "@/components/icons/diaries/QuillToolbarIconTextAlignLeft";
import QuillToolbarIconTextAlignRight from "@/components/icons/diaries/QuillToolbarIconTextAlignRight";
import QuillToolbarIconTextColor from "@/components/icons/diaries/QuillToolbarIconTextColor";
import QuillToolbarIconUnderline from "@/components/icons/diaries/QuillToolbarIconUnderline";
import { useState } from "react";
import ReactQuill from "react-quill";

interface CustomToolbarProps {
  quillRef: React.RefObject<ReactQuill>;
}

interface ToolbarButton {
  IconComponent: React.ComponentType<{ onClick: () => void }>;
  onClick: () => void;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ quillRef }) => {
  const [showPalette, setShowPalette] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#000000");

  const handleFormat = (format: string, value: any) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      if (format === "align") {
        quill.format(format, value);
      } else {
        const currentFormat = quill.getFormat()[format];
        quill.format(format, currentFormat === value ? false : value, "silent");
      }
    }
  };
  const handleImage = () => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.focus();
      setTimeout(() => {
        const range = quill.getSelection();
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");

        input.addEventListener("change", () => {
          const file = input.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              const base64Image = reader.result as string;
              if (range) {
                quill.insertEmbed(range.index, "image", base64Image);
                quill.insertText(range.index + 1, "\n");
                quill.setSelection(range.index + 2, 0);
              } else {
                const length = quill.getLength();
                quill.insertEmbed(length + 1, "image", base64Image);
                quill.setSelection(length + 1, 0);
              }
              const editorRoot = quill.root;
              const imgElements = editorRoot.querySelectorAll(`img[src="${base64Image}"]`);
              imgElements.forEach((element) => {
                const imgElement = element as HTMLImageElement;
                const parentNode = imgElement.parentNode as HTMLElement;
                parentNode.style.display = "block";
                imgElement.style.borderRadius = "20px";
                imgElement.style.display = "table";
                imgElement.style.boxSizing = "border-box";
                imgElement.style.border = "2px solid transparent";
                imgElement.style.cursor = "pointer";
              });
            };
            reader.readAsDataURL(file);
          }
        });

        input.click();
      }, 100);
    }
  };

  const toolbarButtons: ToolbarButton[] = [
    { IconComponent: QuillToolbarIconImage, onClick: handleImage },
    { IconComponent: QuillToolbarIconBold, onClick: () => handleFormat("bold", true) },
    { IconComponent: QuillToolbarIconItalic, onClick: () => handleFormat("italic", true) },
    { IconComponent: QuillToolbarIconUnderline, onClick: () => handleFormat("underline", true) },
    {
      IconComponent: QuillToolbarIconTextColor,
      onClick: () => setShowPalette(!showPalette)
    },
    { IconComponent: QuillToolbarIconTextAlignLeft, onClick: () => handleFormat("align", "") },
    { IconComponent: QuillToolbarIconTextAlignCenter, onClick: () => handleFormat("align", "center") },
    { IconComponent: QuillToolbarIconTextAlignRight, onClick: () => handleFormat("align", "right") },
    { IconComponent: QuillToolbarIconLIst, onClick: () => handleFormat("list", "ordered") }
  ];

  return (
    <div id="toolbar">
      <div className="ql-formats">
        {toolbarButtons.map(({ IconComponent, onClick }, index) => (
          <div key={index} className="ql-textcolor w-[32px] h-[32px] relative">
            <IconComponent onClick={onClick} />
            {IconComponent === QuillToolbarIconTextColor && showPalette && (
              <div className="color-palette">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    handleFormat("color", e.target.value);
                  }}
                  title="Select color"
                  className="color-picker"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomToolbar;
