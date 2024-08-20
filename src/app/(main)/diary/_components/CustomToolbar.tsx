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
import { useEffect, useState } from "react";
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

  // const handleFormat = (format: string, value: any) => {
  //   if (quillRef.current) {
  //     const quill = quillRef.current.getEditor();
  //     const currentFormat = quill.getFormat()[format];
  //     quill.format(format, currentFormat === value ? false : value);
  //   }
  // };

  const handleFormat = (format: string, value: any) => {

    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();

      if (format === "align") {
        // align 포맷이 이미지와 텍스트 모두에 적용됩니다.
        quill.format(format, value);
      } else {
        // 기존 포맷 처리
        const currentFormat = quill.getFormat()[format];
        quill.format(format, currentFormat === value ? false : value, 'silent');
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
                quill.setSelection(range.index + 1, 0);
              } else {
                const length = quill.getLength();
                quill.insertEmbed(length, "image", base64Image);
                quill.setSelection(length, 0);
              }
              const editorRoot = quill.root;
              const imgElements = editorRoot.querySelectorAll(`img[src="${base64Image}"]`);
              imgElements.forEach((element) => {
                const imgElement = element as HTMLImageElement;
                imgElement.style.borderRadius = "20px";
                imgElement.style.display = "inline-block";
                imgElement.style.boxSizing = "border-box";
                imgElement.style.border = "4px solid transparent";
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

  // useEffect(() => {
  //   // Handler for color input focus to prevent keyboard from appearing
  //   const handleFocus = (e: Event) => {
  //     if (e instanceof HTMLInputElement) {
  //       e.blur(); // Remove focus from the input field
  //     }
  //   };

  //   const colorPicker = document.querySelector(".color-picker") as HTMLInputElement;
  //   colorPicker?.addEventListener("focus", handleFocus);

  //   return () => {
  //     colorPicker?.removeEventListener("focus", handleFocus);
  //   };
  // }, []);

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
