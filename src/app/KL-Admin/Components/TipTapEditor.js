"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link as LinkIcon, ImageIcon, Palette
} from 'lucide-react';
import { useCallback, useEffect } from 'react';

const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize ? element.style.fontSize.replace(/['"]+/g, '') : null,
        renderHTML: attributes => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setFontSize: fontSize => ({ commands }) => {
        return commands.setMark(this.name, { fontSize });
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().setMark(this.name, { fontSize: null }).removeEmptyTextStyle().run();
      },
    };
  },
});

const MenuBar = ({ editor }) => {
  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
            method: 'POST',
            body: formData,
          });
          if (response.ok) {
            const data = await response.json();
            const imageUrl = `${process.env.NEXT_PUBLIC_Files_URL}/${data.filename}`;
            editor.chain().focus().setImage({ src: imageUrl }).run();
          } else {
            console.error("Image upload failed");
            alert("Failed to upload image.");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Error uploading image.");
        }
      }
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    
    // cancelled
    if (url === null) {
      return;
    }
    
    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const Button = ({ onClick, isActive, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
    >
      {children}
    </button>
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-100 border-b border-gray-300 sticky top-0 z-10 rounded-t-lg">
      <Button onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
        <Bold size={18} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
        <Italic size={18} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
        <UnderlineIcon size={18} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
        <Strikethrough size={18} />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      
      <select
        className="p-1 border border-gray-300 rounded text-sm bg-white cursor-pointer"
        onChange={(e) => {
          if (e.target.value === "") {
             editor.chain().focus().unsetFontSize().run();
          } else {
             editor.chain().focus().setFontSize(e.target.value).run();
          }
        }}
        value={editor.getAttributes('textStyle')?.fontSize || ""}
        title="Font Size"
      >
        <option value="">Size</option>
        {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72].map(size => (
          <option key={size} value={`${size}pt`}>{size}</option>
        ))}
      </select>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
        <Heading1 size={18} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
        <Heading2 size={18} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3">
        <Heading3 size={18} />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <Button onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
        <AlignLeft size={18} />
      </Button>
      <Button onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
        <AlignCenter size={18} />
      </Button>
      <Button onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
        <AlignRight size={18} />
      </Button>
      <Button onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Align Justify">
        <AlignJustify size={18} />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <Button onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
        <List size={18} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
        <ListOrdered size={18} />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <Button onClick={setLink} isActive={editor.isActive('link')} title="Link">
        <LinkIcon size={18} />
      </Button>
      <Button onClick={addImage} isActive={false} title="Image">
        <ImageIcon size={18} />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <div className="relative flex items-center group">
        <Palette size={18} className="text-gray-700 mx-1" />
        <input
          type="color"
          onInput={event => editor.chain().focus().setColor(event.target.value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-6 h-6 p-0 border-0 cursor-pointer rounded"
          title="Text Color"
        />
      </div>
    </div>
  );
};

export default function TipTapEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      FontSize,
      Color,
      Underline,
      Image.configure({
        inline: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none w-full h-full min-h-[350px]',
      },
    },
  });

  // Keep content in sync if value is changed externally (e.g. loading data)
  useEffect(() => {
    if (editor && value && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="flex flex-col border border-gray-300 rounded-lg overflow-hidden bg-white h-full">
      <MenuBar editor={editor} />
      
      <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: '350px' }}>
        <EditorContent editor={editor} className="tiptap-content h-full text-black" />
      </div>
      
      {/* Embedded CSS for ProseMirror content */}
      <style dangerouslySetInnerHTML={{__html: `
        .tiptap-content {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 11pt; /* Standard Word font size */
        }
        .tiptap-content .ProseMirror {
          outline: none;
        }
        .tiptap-content p {
          margin-bottom: 1em;
          line-height: 1.15;
        }
        .tiptap-content h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; line-height: 1.2; }
        .tiptap-content h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; line-height: 1.3; }
        .tiptap-content h3 { font-size: 1.17em; font-weight: bold; margin-bottom: 0.5em; line-height: 1.4; }
        .tiptap-content ul { list-style-type: disc; padding-left: 2em; margin-bottom: 1em; }
        .tiptap-content ol { list-style-type: decimal; padding-left: 2em; margin-bottom: 1em; }
        .tiptap-content img { max-width: 100%; height: auto; display: block; margin: 1em 0; }
        .tiptap-content a { color: #0563c1; text-decoration: underline; cursor: pointer; }
        
        /* TipTap overrides for text-align */
        .tiptap-content [style*="text-align: right"] { text-align: right; }
        .tiptap-content [style*="text-align: center"] { text-align: center; }
        .tiptap-content [style*="text-align: justify"] { text-align: justify; }
      `}} />
    </div>
  );
}
