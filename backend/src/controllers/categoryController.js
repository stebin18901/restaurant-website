import Category from "../models/Category.js";
import Item from "../models/Item.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    // For each category, fetch items
    const categoriesWithItems = await Promise.all(
      categories.map(async (cat) => {
        const items = await Item.find({ category: cat._id });
        return { ...cat.toObject(), items };
      })
    );

    res.json(categoriesWithItems);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });
    const category = await Category.create({ name, description, image });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: "Invalid data" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update category" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // Also delete all items in this category
    await Item.deleteMany({ category: id });
    await Category.findByIdAndDelete(id);
    res.json({ message: "Category and items deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
