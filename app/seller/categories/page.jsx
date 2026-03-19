"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";

const categoryTypes = [
  { label: "Regular", value: "regular" },
  { label: "Offer", value: "offer" },
  { label: "Featured", value: "featured" },
  { label: "Banner", value: "banner" },
];

const typeBadge = {
  regular: "bg-gray-100 text-gray-700",
  offer: "bg-orange-100 text-orange-700",
  featured: "bg-yellow-100 text-yellow-700",
  banner: "bg-blue-100 text-blue-700",
};

const CategoryManager = () => {
  const { getToken } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryType, setNewCategoryType] = useState("regular");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = await getToken();
      if (editingCategory) {
        await axios.put(`/api/categories/${editingCategory._id}`, { name: newCategory, type: newCategoryType }, { headers: { Authorization: `Bearer ${token}` } });
        setCategories((prev) => prev.map((cat) => cat._id === editingCategory._id ? { ...cat, name: newCategory, type: newCategoryType } : cat));
        toast.success("Category updated");
      } else {
        const response = await axios.post("/api/categories", { name: newCategory, type: newCategoryType }, { headers: { Authorization: `Bearer ${token}` } });
        setCategories((prev) => [...prev, response.data]);
        toast.success("Category added");
      }
      setNewCategory("");
      setNewCategoryType("regular");
      setEditingCategory(null);
    } catch (error) {
      toast.error(error.response?.data?.error || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCategory = async () => {
    try {
      const token = await getToken();
      await axios.delete(`/api/categories/${selectedCategoryId}`, { headers: { Authorization: `Bearer ${token}` } });
      setCategories((prev) => prev.filter((cat) => cat._id !== selectedCategoryId));
      toast.success("Category deleted");
    } catch (error) {
      toast.error(error.response?.data?.error || "Delete failed");
    } finally {
      setConfirmVisible(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setNewCategory(cat.name);
    setNewCategoryType(cat.type);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setNewCategory("");
    setNewCategoryType("regular");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 px-3 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Categories</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} categories total</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            {editingCategory ? "✏️ Edit Category" : "➕ Add New Category"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Name *</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Beef, Lamb, Poultry..."
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none text-sm transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Type</label>
              <Dropdown
                value={newCategoryType}
                options={categoryTypes}
                onChange={(e) => setNewCategoryType(e.value)}
                placeholder="Select type"
                className="w-full text-sm"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {isSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Add Category"}
              </button>
              {editingCategory && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Category list */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800">All Categories</h2>
            <span className="text-xs text-gray-400">{categories.length} items</span>
          </div>
          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-sm">No categories yet. Add your first one above.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <div key={cat._id} className="flex items-center justify-between px-4 sm:px-6 py-3.5 hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-600 text-xs font-bold">{cat.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{cat.name}</p>
                      <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mt-0.5 ${typeBadge[cat.type] || typeBadge.regular}`}>
                        {cat.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => { setSelectedCategoryId(cat._id); setConfirmVisible(true); }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        visible={confirmVisible}
        onHide={() => setConfirmVisible(false)}
        accept={deleteCategory}
        header="Confirm Deletion"
        message="Are you sure you want to delete this category? This cannot be undone."
        acceptLabel="Delete"
        rejectLabel="Cancel"
      />
    </div>
  );
};

export default CategoryManager;