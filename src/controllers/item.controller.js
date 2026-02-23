import Item from "../models/item.model.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";

 export const addItem = async (req, res) => {
  try {
    const userId = req.user._id;
 const {
  title,
  category,
  pricePerDay,
  deposit,
  description,
  condition,
  minDays,
  maxDays,
  city,
  address,
  pincode,
  coverIndex,
} = req.body;


 if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const cover = Number(coverIndex) || 0;
    const uploadedImages = [];

    for (let i = 0; i < req.files.length; i++) {
      const result = await cloudinary.uploader.upload(
        req.files[i].path,
        { folder: "borrowhub/items" }
      );

      uploadedImages.push({
        url: result.secure_url,
        isCover: cover === i,
      });
    }

    

    const item = await Item.create({
  title,
  category,
  pricePerDay,     // 🔥
  deposit,         // 🔥
  description,
  condition,
  minDays,
  maxDays,
  location: {
  city,
  address,
  pincode,
},

  images: uploadedImages,
  owner: req.user._id,
  status: "available",
});



   

    return res.status(201).json({
      success: true,
      message: "Item added successfully",
      item,
    });

  } 
  
  
  
    catch (error) {
  console.error("❌ ADD ITEM ERROR:", error);

  return res.status(500).json({
    success: false,
    message: error.message, // 🔥 YE LINE SAB FIX KAREGI
  });
  }
};

 export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({
      owner: req.user._id,
    });

    res.json({
      success: true,
      items,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
  

 


 export const getBorrowedItems = async (req, res) => {
  const items = await Item.find({
    borrowedBy: req.user._id,
    status: "borrowed",
  })
    .populate("owner", "name");

  res.json({ items });
};



  export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id)
      .populate("owner", "name rating");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔹 similar items (same category, except current)
    const suggestions = await Item.find({
      category: item.category,
      _id: { $ne: item._id },
      status: "available",
    }).limit(6);

    res.json({
      item,
      suggestions,
    });
  } catch (err) {
    console.error("getItemById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// saare avaliable items 
  export const getAllItems = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {
      status: "available",
    };

    // 🔍 SEARCH BY TITLE OR CATEGORY
    if (search) {
      filter.$or = [
        {
          title: { $regex: search, $options: "i" },    // item name
        },
        {
          category: { $regex: search, $options: "i" }, // category
        },
      ];
    }

    const items = await Item.find(filter);

    res.json({
      success: true,
      items,
    });
  } catch (err) {
    console.error("getAllItems error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



   export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      category,
      description,
      condition,
      minDays,
      maxDays,
      pricePerDay,
      deposit,
      city,
      address,
      pincode,
      coverIndex,
    } = req.body;

    let updateData = {
      title,
      category,
      description,
      condition,
      minDays,
      maxDays,
      pricePerDay,
      deposit,
      location: { city, address, pincode },
    };

    // 🔥 IF NEW IMAGES SENT
    if (req.files && req.files.length > 0) {
      const cover = Number(coverIndex) || 0;
      const uploadedImages = [];

      for (let i = 0; i < req.files.length; i++) {
        const result = await cloudinary.uploader.upload(
          req.files[i].path,
          { folder: "borrowhub/items" }
        );

        uploadedImages.push({
          url: result.secure_url,
          isCover: cover === i,
        });
      }

      updateData.images = uploadedImages;
    }
    //update ke liye

    const updatedItem = await Item.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({ success: true, item: updatedItem });
  } catch (err) {
    console.error("updateItem error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const borrowItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    const item = await Item.findById(id);

    if (!item || item.status === "borrowed") {
      return res.status(400).json({ message: "Item not available" });
    }

    item.status = "borrowed";
    item.borrowedBy = req.user._id;
    item.borrowFrom = startDate;
    item.borrowTo = endDate;

    await item.save();

    res.json({
      success: true,
      message: "Item borrowed successfully",
      item,
    });
  } catch (err) {
    res.status(500).json({ message: "Borrow failed" });
  }
};

export const getLentOutItems = async (req, res) => {
  const items = await Item.find({
    owner: req.user._id,
    status: "borrowed",
  })
    .populate("borrowedBy", "name")
    .populate("owner", "name");

  res.json({ items });
};


export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔐 owner check
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({ message: "Server error" });
  }
};





  



