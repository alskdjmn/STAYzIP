/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Search, X, Camera as CameraIcon, Image as ImageIcon } from 'lucide-react';
import { CameraModal } from './CameraModal';

interface SearchInputProps {
  onSearch: (query: string, image?: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, placeholder, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() || image) {
      onSearch(query.trim(), image || undefined);
      setQuery('');
      setImage(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto flex flex-col space-y-2">
        {image && (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-blue-500 shadow-md">
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full pl-10 pr-32 py-4 bg-white border border-gray-200 rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg placeholder:text-gray-400"
            placeholder={placeholder || '무엇이든 물어보세요...'}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
              title="카메라 촬영"
            >
              <CameraIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
              title="이미지 업로드"
            >
              <ImageIcon className="h-5 w-5" />
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              type="submit"
              disabled={!query.trim() && !image}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              질문
            </button>
          </div>
        </div>
      </form>

      {isCameraOpen && (
        <CameraModal
          onClose={() => setIsCameraOpen(false)}
          onCapture={(img) => {
            setImage(img);
            setIsCameraOpen(false);
          }}
        />
      )}
    </>
  );
};
