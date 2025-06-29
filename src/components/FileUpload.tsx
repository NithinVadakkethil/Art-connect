import React, { useState } from 'react';
import { Upload, X, Image, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  accept?: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  accept = "image/*",
  label,
  description,
  disabled = false
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
  };

  const removeFile = () => {
    onFileSelect(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
            dragOver
              ? 'border-indigo-500 bg-indigo-50'
              : disabled
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50 cursor-pointer'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="space-y-3">
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
              dragOver ? 'bg-indigo-100' : 'bg-gray-100'
            }`}>
              <Upload className={`h-6 w-6 ${
                dragOver ? 'text-indigo-600' : 'text-gray-400'
              }`} />
            </div>
            
            <div>
              <p className={`text-sm font-medium ${
                disabled ? 'text-gray-400' : 'text-gray-900'
              }`}>
                {dragOver ? 'Drop your file here' : 'Click to upload or drag and drop'}
              </p>
              {description && (
                <p className="text-xs text-gray-500 mt-1">{description}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {selectedFile.type.startsWith('image/') ? (
                  <Image className="h-8 w-8 text-green-600" />
                ) : (
                  <FileText className="h-8 w-8 text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={removeFile}
              disabled={disabled}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {selectedFile.type.startsWith('image/') && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="max-w-full h-32 object-cover rounded border"
              />
            </div>
          )}
          
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              File selected
            </span>
            <button
              type="button"
              onClick={() => document.getElementById('file-input')?.click()}
              disabled={disabled}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Change file
            </button>
          </div>
          
          <input
            id="file-input"
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;