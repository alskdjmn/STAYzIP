/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ExampleChipsProps {
  chips: string[];
  onSelect: (chip: string) => void;
}

export const ExampleChips: React.FC<ExampleChipsProps> = ({ chips, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-6">
      {chips.map((chip, i) => (
        <button
          key={i}
          onClick={() => onSelect(chip)}
          className="px-4 py-2 bg-white border border-gray-100 rounded-full shadow-sm text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all"
        >
          {chip}
        </button>
      ))}
    </div>
  );
};
