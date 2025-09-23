import Item from "../models/Item.js";

export const getItems = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    const items = await Item.find(filter).populate("category", "name");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createItem = async (req, res) => {
  try {
    const { name, price, ...rest } = req.body;
    if (!name || price == null) return res.status(400).json({ message: "Name & Price required" });
    const item = await Item.create({ name, price, ...rest });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: "Invalid data" });
  }
};

export const updateItem = async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update item" });
  }
};

export const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("category");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};