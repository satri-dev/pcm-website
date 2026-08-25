"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useEffect, useState, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link2,
  Unlink,
  RemoveFormatting,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={[
        "inline-flex h-7 min-w-[30px] shrink-0 items-center justify-center rounded-md border px-[0.45rem] leading-none transition-colors duration-150",
        active
          ? "border-[var(--admin-line)] bg-white text-[var(--admin-brand)]"
          : "border-transparent bg-transparent text-[var(--admin-ink)] enabled:hover:border-[var(--admin-line)] enabled:hover:bg-[#e2e9f7]",
        disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start typing...",
}: RichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[120px] px-3 py-2",
        "data-placeholder": placeholder,
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  if (!editor) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--admin-line)] bg-[var(--admin-surface)]">
      {/* Toolbar — single line */}
      <div className="flex flex-nowrap items-center gap-[0.2rem] overflow-x-auto border-b border-[var(--admin-line)] bg-[#edf2fc] px-2 py-1.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold size={15} strokeWidth={2.5} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic size={15} strokeWidth={2.5} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon size={15} strokeWidth={2.5} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough size={15} strokeWidth={2.5} />
        </ToolbarButton>

        <div className="mx-1 h-[18px] w-px shrink-0 bg-[var(--admin-line)]" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <span className="text-[0.78rem] font-bold">H2</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <span className="text-[0.78rem] font-bold">H3</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive("paragraph") && !editor.isActive("heading")}
          title="Paragraph"
        >
          <span className="text-[0.9rem] leading-none">¶</span>
        </ToolbarButton>

        <div className="mx-1 h-[18px] w-px shrink-0 bg-[var(--admin-line)]" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet list"
        >
          <List size={15} strokeWidth={2.5} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered list"
        >
          <ListOrdered size={15} strokeWidth={2.5} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote size={15} strokeWidth={2.5} />
        </ToolbarButton>

        <div className="mx-1 h-[18px] w-px shrink-0 bg-[var(--admin-line)]" />

        <ToolbarButton
          onClick={() => setShowLinkInput(true)}
          active={editor.isActive("link")}
          title="Insert link"
        >
          <Link2 size={15} strokeWidth={2.5} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          title="Remove link"
        >
          <Unlink size={15} strokeWidth={2.5} />
        </ToolbarButton>

        <div className="mx-1 h-[18px] w-px shrink-0 bg-[var(--admin-line)]" />

        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          title="Clear formatting"
        >
          <RemoveFormatting size={15} strokeWidth={2.5} />
        </ToolbarButton>
      </div>

      {/* Link Input Popup */}
      {showLinkInput && (
        <div className="flex items-center gap-2 border-b border-[var(--admin-line)] bg-[var(--admin-surface-2)] p-3">
          <input
            type="url"
            placeholder="Enter URL..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setLink();
              }
              if (e.key === "Escape") {
                setShowLinkInput(false);
                setLinkUrl("");
              }
            }}
            autoFocus
            className="min-w-0 flex-1 rounded-md border border-[var(--admin-line)] bg-white px-2.5 py-1.5 text-[0.85rem] outline-none focus:border-[var(--admin-brand)]"
          />
          <button
            type="button"
            onClick={setLink}
            className="admin-btn admin-btn--primary admin-btn--sm"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setShowLinkInput(false);
              setLinkUrl("");
            }}
            className="admin-btn admin-btn--sm"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Editor Content */}
      <div className="bg-[var(--admin-surface)]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
