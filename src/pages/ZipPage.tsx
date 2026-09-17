/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Package, Zap } from 'lucide-react';
import { Inventory } from '../components/Inventory';
import { RoomManager } from '../components/RoomManager';
import { QuickAddModal } from '../components/QuickAddModal';
import { InventoryItem, InventoryCategory, UserProfile } from '../types';
import { User } from 'firebase/auth';

interface ZipPageProps {
  user: User;
  userProfile: UserProfile | null;
  inventoryItems: InventoryItem[];
  onAddInventoryItem: (name: string, category: InventoryCategory, quantity?: number) => void;
  onRemoveInventoryItem: (id: string) => void;
}

export const ZipPage: React.FC<ZipPageProps> = ({
  user,
  userProfile,
  inventoryItems,
  onAddInventoryItem,
  onRemoveInventoryItem
}) => {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">ZIP (방 & 서랍장)</h1>
        <p className="text-gray-500 text-lg">나의 그룹 방과 서랍장을 관리해보세요.</p>
      </div>

      <div className="space-y-12 max-w-2xl mx-auto">
        {/* Room Manager Section */}
        <section>
          <RoomManager 
            user={user} 
            userProfile={userProfile} 
          />
        </section>

        {/* Inventory Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">나의 서랍장</h3>
            </div>
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-600 rounded-xl font-bold text-sm transition-all border border-blue-100"
            >
              <Zap className="w-4 h-4" />
              <span>빠른 등록</span>
            </button>
          </div>
          <Inventory
            items={inventoryItems}
            onAddItem={onAddInventoryItem}
            onRemoveItem={onRemoveInventoryItem}
          />
        </section>
      </div>

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddItem={onAddInventoryItem}
        existingItems={inventoryItems}
      />
    </div>
  );
};
