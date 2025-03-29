"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";

const CategoryManager = () => {
  const { getToken } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryType, setNewCategoryType] = useState("regular");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();

      if (editingCategory) {
        // Update category on the server
        await axios.put(
          `/api/categories/${editingCategory._id}`,
          {
            name: newCategory,
            type: newCategoryType,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update local state
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === editingCategory._id
              ? { ...cat, name: newCategory, type: newCategoryType }
              : cat
          )
        );
        toast.success("Category updated successfully");
      } else {
        // Create new category
        const response = await axios.post(
          "/api/categories",
          {
            name: newCategory,
            type: newCategoryType,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Add new category to local state
        setCategories((prev) => [...prev, response.data]);
        toast.success("Category added successfully");
      }

      // Reset form
      setNewCategory("");
      setNewCategoryType("regular");
      setEditingCategory(null);
    } catch (error) {
      toast.error(error.response?.data?.error || "Operation failed");
    }
  };

  const deleteCategory = async () => {
    try {
      const token = await getToken();
      await axios.delete(`/api/categories/${selectedCategoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Category deleted successfully");

      // Remove the deleted category from local state
      setCategories((prev) => prev.filter((cat) => cat._id !== selectedCategoryId));
    } catch (error) {
      toast.error(error.response?.data?.error || "Delete failed");
    } finally {
      setConfirmVisible(false);
    }
  };

  const categoryTypes = [
    { label: "Regular", value: "regular" },
    { label: "Offer", value: "offer" },
    { label: "Featured", value: "featured" },
    { label: "Banner", value: "banner" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>

      {/* Form for creating/updating categories */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="p-2 border rounded-lg"
            required
          />
          <Dropdown
            value={newCategoryType}
            options={categoryTypes}
            onChange={(e) => setNewCategoryType(e.value)}
            placeholder="Select a Category Type"
            className="w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {editingCategory ? "Update" : "Add"} Category
          </button>
        </div>
      </form>

      {/* Category list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center"
          >
            <div>
              <span className="font-medium">{category.name}</span>
              <span className="ml-2 text-sm text-gray-500">({category.type})</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingCategory(category);
                  setNewCategory(category.name);
                  setNewCategoryType(category.type);
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setSelectedCategoryId(category._id);
                  setConfirmVisible(true);
                }}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation dialog for deletion */}
      <ConfirmDialog
        visible={confirmVisible}
        onHide={() => setConfirmVisible(false)}
        accept={deleteCategory}
        header="Confirm Deletion"
        message="Are you sure you want to delete this category?"
        acceptLabel="Delete"
        rejectLabel="Cancel"
      />
    </div>
  );
};

export default CategoryManager;
