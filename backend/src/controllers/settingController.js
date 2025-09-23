import Setting from "../models/Setting.js";

export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne();
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting(req.body);
    } else {
      settings.set(req.body);
    }
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
