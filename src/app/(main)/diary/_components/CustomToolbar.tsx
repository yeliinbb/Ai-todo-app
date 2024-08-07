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

const colors = ["red", "green", "blue", "orange", "violet", "yellow", "black", "pink"];

const CustomToolbar: React.FC<CustomToolbarProps> = ({ quillRef }) => {
  const [showPalette, setShowPalette] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#000000");

  const handleAlign = (align: string) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.format("align", align);
    }
  };
  const handleBold = () => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const currentBold = quill.getFormat().bold;
      quill.format("bold", !currentBold);
    }
  };

  const handleItalic = () => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const currentItalic = quill.getFormat().italic;
      quill.format("italic", !currentItalic);
    }
  };
  const handleUnderline = () => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const currentUnderline = quill.getFormat().underline;
      quill.format("underline", !currentUnderline);
    }
  };
  const handleImage = () => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.addEventListener("change", () => {
        const file = input.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const base64Image = reader.result as string;
            quill.insertEmbed(quill.getSelection()?.index || 0, "image", base64Image);
          };
          reader.readAsDataURL(file);
        }
      });
      input.click();
    }
  };
  const handleColorChange = (color: string) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.format("color", color);
    }
  };
  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    handleColorChange(newColor);
  };

  const handleList = (value: string) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const currentList = quill.getFormat().list;
      quill.format("list", currentList === value ? false : value);
    }
  };
  const handleShowPalette = () => {
    setShowPalette(!showPalette);
  };

  return (
    <div id="toolbar">
      <div className="ql-formats">
        <div className="w-[32px] h-[32px] relative">
          <QuillToolbarIconImage onClick={handleImage} />
        </div>
        <div className="w-[32px] h-[32px] relative">
          <QuillToolbarIconBold onClick={handleBold} />
        </div>
        <div className="w-[32px] h-[32px] relative">
          <QuillToolbarIconItalic onClick={handleItalic} />
        </div>
        <div className="w-[32px] h-[32px] relative">
          <QuillToolbarIconUnderline onClick={handleUnderline} />
        </div>
        <div className="ql-textcolor w-[32px] h-[32px] relative">
          <QuillToolbarIconTextColor onClick={handleShowPalette} />
          <div className={`color-palette ${showPalette ? "off" : "on"}`}>
            {showPalette && (
              <div className="color-palette">
                <input
                  type="color"
                  value={color}
                  onChange={handleColorInputChange}
                  title="Select color"
                  className="color-picker"
                />
              </div>
            )}
            {/* {colors.map((color) => (
              <button
                key={color}
                className="color-swatch"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
                title={color}
              />
            ))} */}
          </div>
        </div>
        <div className="ql-textcolor w-[32px] h-[32px] relative">
          <QuillToolbarIconTextAlignLeft onClick={() => handleAlign("")} />
        </div>
        <div className="ql-textcolor w-[32px] h-[32px] relative">
          <QuillToolbarIconTextAlignCenter onClick={() => handleAlign("center")} />
        </div>
        <div className="ql-textcolor w-[32px] h-[32px] relative">
          <QuillToolbarIconTextAlignRight onClick={() => handleAlign("right")} />
        </div>
        <div className="ql-textcolor w-[32px] h-[32px] relative">
          <QuillToolbarIconLIst onClick={() => handleList("ordered")} />
        </div>
      </div>
    </div>
  );
};

export default CustomToolbar;
