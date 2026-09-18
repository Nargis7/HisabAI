import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Package, Trash2, Tag, IndianRupee, Layers } from 'lucide-react';
import { Product } from '../../types';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSaveProduct: (updated: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSaveProduct,
  onDeleteProduct
}) => {
  const [name, setName] = useState('');
  const [hindiName, setHindiName] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState<number>(0);
  const [unit, setUnit] = useState('kg');
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [minAlertThreshold, setMinAlertThreshold] = useState<number>(5);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setHindiName(product.hindiName || '');
      setCategory(product.category || 'General');
      setStock(product.stock || 0);
      setUnit(product.unit || 'kg');
      setSellingPrice(product.sellingPrice || 0);
      setCostPrice(product.costPrice || 0);
      setMinAlertThreshold(product.minAlertThreshold || 5);
      setIsConfirmingDelete(false);
    }
  }, [product, isOpen]);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const numStock = Number(stock) || 0;
    const numThreshold = Number(minAlertThreshold) || 5;

    const updated: Product = {
      ...product,
      name: name.trim(),
      hindiName: hindiName.trim() || undefined,
      category: category.trim() || 'General',
      stock: numStock,
      unit,
      sellingPrice: Number(sellingPrice) || 0,
      costPrice: Number(costPrice) || 0,
      minAlertThreshold: numThreshold,
      status: numStock <= 0 ? 'out_of_stock' : numStock <= numThreshold ? 'low' : 'healthy'
    };

    onSaveProduct(updated);
    onClose();
  };

  const handleDelete = () => {
    onDeleteProduct(product.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Product"
      subtitle={`Update inventory details, pricing, and reorder levels for ${product.name}`}
      maxWidth="md"
    >
      {isConfirmingDelete ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Delete "{product.name}" from inventory?</span>
          </div>
          <p className="text-xs text-rose-700 leading-relaxed">
            This will remove this product from your shop catalog and stock records.
          </p>
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={handleDelete}
            >
              Yes, Delete Product
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fortune Sunflower Oil 1L"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Regional / Hindi Name
              </label>
              <input
                type="text"
                value={hindiName}
                onChange={(e) => setHindiName(e.target.value)}
                placeholder="e.g. फार्च्यून तेल"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Cooking Oil, Staples, Spices"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Current Stock
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              >
                <option value="kg">kg</option>
                <option value="litres">litres</option>
                <option value="pouches">pouches</option>
                <option value="packets">packets</option>
                <option value="bags">bags</option>
                <option value="units">units</option>
                <option value="tins">tins</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Selling Price (₹)
              </label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Low Stock Alert Threshold
              </label>
              <input
                type="number"
                value={minAlertThreshold}
                onChange={(e) => setMinAlertThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <div className="flex gap-2">
              <Button type="button" variant="outline" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
