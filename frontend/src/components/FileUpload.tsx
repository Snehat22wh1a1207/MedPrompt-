'use client';
import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface FileUploadProps {
  onFile: (file: File) => void;
  selectedFile: File | null;
}

export default function FileUpload({ onFile, selectedFile }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-teal-400'
        }`}
      >
        <div className="text-4xl mb-3">📄</div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">
          Drag & drop your file here or <span className="text-teal-600">browse</span>
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Supports PDF, JPG, PNG, JPEG (max 10MB)
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.bmp,.tiff,.dcm"
        className="hidden"
        onChange={handleChange}
      />
      {selectedFile && (
        <div className="mt-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg flex items-center gap-3">
          <span className="text-2xl">📎</span>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
      )}
    </div>
  );
}
