import React, { useEffect, useRef, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import ReactQuill from 'react-quill-new';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [editorValue, setEditorValue] = useState(value || '');
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setTimeout(() => {
        const toolbars = document.querySelectorAll('.ql-toolbar');
        toolbars.forEach((toolbar, index) => {
          if (index > 0) toolbar.remove();
        });
      }, 100);
    }
  }, []);

  return (
    <div className="relative">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={(content) => {
          setEditorValue(content);
          onChange(content);
        }}
        modules={{
          toolbar: [
            [{ font: [] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ size: ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            ['clean'],
          ],
        }}
        placeholder="Write a detailed product description here..."
        className="bg-transparent border border-gray-700 text-white rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
        style={{ minHeight: '250px' }}
      />

      <style>{`
        .ql-toolbar {
          background: transparent;
          border: 1px solid #444;
          border-radius: 8px 8px 0 0;
        }

        .ql-container {
          background: transparent;
          border: 1px solid #444;
          border-top: none;
          border-radius: 0 0 8px 8px;
          color: white;
        }

        .ql-editor {
          color: white;
          min-height: 200px;
          padding: 12px;
        }

        .ql-editor.ql-blank::before {
          color: #aaa !important;
          font-style: normal;
        }

        .ql-picker-options {
          background: #333 !important;
          color: white !important;
        }

        .ql-picker-item {
          color: white !important;
        }

        .ql-stroke {
          stroke: white !important;
        }

        .ql-snow .ql-picker {
          color: white;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
