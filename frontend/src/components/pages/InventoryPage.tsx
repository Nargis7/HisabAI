import React, { useState } from 'react';
import { Package, Search, Plus, AlertTriangle, CheckCircle2, ArrowUpDown, Filter, Edit2, RotateCw, Trash2, XCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';
import { EmptyState } from '../common/EmptyState';
import { Product } from '../../types';
import { EditProductModal } from '../modals/EditProductModal';

interface InventoryPageProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onUpdateProduct?: (product: Product) => void;
  onDeleteProduct?: (id: string) => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  products,
  onAddProduct,
  onUpdateStock,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form state
  const [newProductName, setNewProductName] = useState('');
  const [newProductHindi, setNewProductHindi] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Staples & Grains');
  const [newProductStock, setNewProductStock] = useState(20);
  const [newProductUnit, setNewProductUnit] = useState('kg');
  const [newProductPrice, setNewProductPrice] = useState(50);
  const [newProductThreshold, setNewProductThreshold] = useState(5);

  // Summary counts calculated from real data
  const totalCount = products.length;
  const lowStockCount = products.filter((p) => p.status === 'low').length;
  const outOfStockCount = products.filter((p) => p.status === 'out_of_stock').length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.hindiName && p.hindiName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'low') return p.status === 'low';
    if (filter === 'out') return p.status === 'out_of_stock';
    return true;
  });

  const handleCreateNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const stockNum = Number(newProductStock) || 0;
    const threshNum = Number(newProductThreshold) || 5;

    const created: Product = {
      id: `prod-${Date.now()}`,
      name: newProductName.trim(),
      hindiName: newProductHindi.trim() || undefined,
      category: newProductCategory,
      stock: stockNum,
      unit: newProductUnit,
      costPrice: Math.round(newProductPrice * 0.8),
      sellingPrice: Number(newProductPrice) || 0,
      minAlertThreshold: threshNum,
      status: stockNum <= 0 ? 'out_of_stock' : stockNum <= threshNum ? 'low' : 'healthy'
    };

    onAddProduct(created);
    setIsAddModalOpen(false);
    // Reset form
    setNewProductName('');
    setNewProductHindi('');
    setNewProductStock(20);
    setNewProductPrice(50);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Inventory & Stock Memory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time stock awareness, low replenishment alerts, and item pricing.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
        >
          Add Product
        </Button>
      </div>

      {/* Summary metric cards calculated from real data */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <MetricCard
          icon={<Package className="w-4 h-4" />}
          title="Total Products"
          value={String(totalCount)}
          subtitle={totalCount > 0 ? `${totalCount} catalog items registered` : 'No items recorded yet'}
        />

        <MetricCard
          icon={<AlertTriangle className="w-4 h-4" />}
          title="Low Stock Alerts"
          value={String(lowStockCount)}
          subtitle={
            lowStockCount > 0
              ? `${lowStockCount} items below alert threshold`
              : 'All stocks above threshold'
          }
          tone="amber"
        />

        <MetricCard
          icon={<XCircle className="w-4 h-4" />}
          title="Out of Stock"
          value={String(outOfStockCount)}
          subtitle={
            outOfStockCount > 0
              ? `${outOfStockCount} items completely out of stock`
              : 'No items out of stock'
          }
          tone="rose"
        />
      </div>

      {/* Table Container or Empty State */}
      {products.length === 0 ? (
        <EmptyState
          icon={<Package className="w-6 h-6 text-indigo-600" />}
          title="No products in store inventory yet"
          description="Build your store catalog. Record commodities, packaged items, and unit prices so stock deducts automatically during counter sales."
          actionLabel="+ Add First Product"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Search & Filter Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search product or category..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              {(
                [
                  { id: 'all', label: `All Items (${products.length})` },
                  { id: 'low', label: `Low Stock (${lowStockCount})` },
                  { id: 'out', label: `Out of Stock (${outOfStockCount})` }
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    filter === f.id
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory List Table */}
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No products found matching "{searchQuery}".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-200">
                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Product Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Stock Level</th>
                    <th className="px-4 py-3">Selling Price</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Quick Restock / Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        <div className="font-semibold text-sm text-slate-900">{p.name}</div>
                        {p.hindiName && (
                          <div className="text-[11px] text-slate-400">{p.hindiName}</div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold font-mono text-slate-900">
                        {p.stock} <span className="font-normal text-slate-500 text-[11px]">{p.unit}</span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900 font-mono">
                        ₹{p.sellingPrice}
                        <span className="text-[10px] text-slate-400 font-normal">/{p.unit}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge
                          status={
                            p.status === 'healthy'
                              ? 'Healthy'
                              : p.status === 'low'
                              ? 'Low Stock'
                              : 'Out of Stock'
                          }
                          size="sm"
                        />
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            title="Add 10 units"
                            onClick={() => onUpdateStock(p.id, p.stock + 10)}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition-colors"
                          >
                            +10 Restock
                          </button>
                          <button
                            title="Edit Product"
                            onClick={() => setEditingProduct(p)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-slate-200 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add New Product</h3>
            <p className="text-xs text-slate-500 mb-4">Register new store item in HisabAI inventory memory.</p>

            <form onSubmit={handleCreateNewProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MDH Chana Masala 100g"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Regional / Hindi Name</label>
                  <input
                    type="text"
                    placeholder="e.g. चना मसाला"
                    value={newProductHindi}
                    onChange={(e) => setNewProductHindi(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit</label>
                  <select
                    value={newProductUnit}
                    onChange={(e) => setNewProductUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
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
                  <label className="block font-semibold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alert Threshold</label>
                  <input
                    type="number"
                    min="0"
                    value={newProductThreshold}
                    onChange={(e) => setNewProductThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" fullWidth>
                  Save to Inventory
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && onUpdateProduct && onDeleteProduct && (
        <EditProductModal
          isOpen={Boolean(editingProduct)}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
          onSaveProduct={(updated) => {
            onUpdateProduct(updated);
            setEditingProduct(null);
          }}
          onDeleteProduct={(id) => {
            onDeleteProduct(id);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};
