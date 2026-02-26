 



import Item from "../models/item.model.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";

// 🌍 DISTANCE CALCULATOR FORMULA (Sirf UI pe text dikhane ke liye use hoga ab)
const getDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Dharti ka radius kilometers mein
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance Kilometers mein aayega
};

export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({
      owner: req.user._id,
    })
    .populate("borrowedBy", "name phone address _id"); 

    res.json({
      success: true,
      items,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBorrowedItems = async (req, res) => {
  try {
    const items = await Item.find({
      borrowedBy: req.user._id,
      status: { $in: ["borrowed", "reserved"] } 
    })
    .populate("owner", "name phone address _id"); 

    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id)
      .populate("owner", "name rating");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const suggestions = await Item.find({
      category: item.category,
      _id: { $ne: item._id },
      status: "available",
    }).limit(6);

    res.json({
      success: true,
      item,
      suggestions,
    });
  } catch (err) {
    console.error("getItemById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔥 YAHAN HUA HAI ASLI JADOO (getAllItems)
 export const getAllItems = async (req, res) => {
  try {
    const { search, lat, lng } = req.query; 
    let filter = { status: "available" };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },       // Naam se dhoondhega (eg: "DSLR")
        { category: { $regex: search, $options: "i" } },    // Category se dhoondhega (eg: "Electronics")
        { city: { $regex: search, $options: "i" } },        // Root City se dhoondhega (eg: "Goa")
        { "location.city": { $regex: search, $options: "i" } } // Location object ke andar wali City
      ];
    }

    // 🔥 SAFETY LOCK: Check karo ki lat/lng valid numbers hain, "undefined" ya "null" text nahi
    const isLocValid = lat && lng && lat !== "undefined" && lng !== "undefined" && lat !== "null" && lng !== "null";

    // 🗺️ The ZOMATO Magic: Database level Geospatial Search
    if (isLocValid) {
      filter.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)] // [Longitude, Latitude]
          },
          $maxDistance: 15000 // 📏 MAXIMUM 15 KM ki doori wale hi dikhenge
        }
      };
    }

    // Database khud filter aur SORT karke dega sabse paas wale!
    let items = await Item.find(filter).lean(); 

    // Sirf UI pe "500 m dur" likhne ke liye loop chalayenge
    if (isLocValid) {
      const userLat = Number(lat);
      const userLng = Number(lng);

      // Ek aur check ki convert hone ke baad valid Number bane hain ya nahi
      if (!isNaN(userLat) && !isNaN(userLng)) {
        items = items.map(item => {
          let distanceText = "";
          let itemLat, itemLng;
          
          // 🔥 Old DB vs New DB format check
          if (item.location?.coordinates && item.location.coordinates.length === 2) {
            itemLng = item.location.coordinates[0];
            itemLat = item.location.coordinates[1];
          } else if (item.location?.lat && item.location?.lng) {
            itemLat = item.location.lat;
            itemLng = item.location.lng;
          }
          
          if (itemLat && itemLng) {
            const distKm = getDistance(userLat, userLng, itemLat, itemLng);
            
            // 🔥 Yahan NaN ko permanently block kar diya
            if (distKm !== null && !isNaN(distKm)) {
              if (distKm < 1) {
                distanceText = `${Math.round(distKm * 1000)} m away`; 
              } else {
                distanceText = `${distKm.toFixed(1)} km away`; 
              }
            }
          }
          
          return { ...item, distance: distanceText }; 
        });
      }
    }

    res.json({ success: true, items });
  } catch (err) {
    console.error("getAllItems error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, category, description, condition, minDays, maxDays,
      pricePerDay, deposit, city, address, pincode, coverIndex, lat, lng
    } = req.body;

    let updateData = {
      title, category, description, condition, minDays, maxDays,
      pricePerDay, deposit,
      location: {
        type: "Point",
        coordinates: [Number(lng) || 0, Number(lat) || 0],
        city,
        address,
        pincode,
        lat: Number(lat) || null,
        lng: Number(lng) || null
      }
    };

    if (req.files && req.files.length > 0) {
      const cover = Number(coverIndex) || 0;
      const uploadedImages = [];
      for (let i = 0; i < req.files.length; i++) {
        const result = await cloudinary.uploader.upload(req.files[i].path, { folder: "borrowhub/items" });
        uploadedImages.push({ url: result.secure_url, isCover: cover === i });
      }
      updateData.images = uploadedImages;
    }

    const item = await Item.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ success: true, item });
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
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
  try {
    const items = await Item.find({
      owner: req.user._id,
      status: { $in: ["borrowed", "reserved"] } 
    })
      .populate("borrowedBy", "name _id idProof profilePic address phone") 
      .populate("owner", "name phone");

    res.json({ items });
  } catch (error) {
    console.error("Lent Items Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

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

export const addItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      title, category, pricePerDay, deposit, description, condition,
      minDays, maxDays, city, address, pincode, coverIndex, lat, lng
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required" });
    }

    const cover = Number(coverIndex) || 0;
    const uploadedImages = [];

    for (let i = 0; i < req.files.length; i++) {
      const result = await cloudinary.uploader.upload(req.files[i].path, { folder: "borrowhub/items" });
      uploadedImages.push({ url: result.secure_url, isCover: cover === i });
    }
 
    const item = await Item.create({
      title, category, pricePerDay, deposit, description, condition, minDays, maxDays,
      city, address, pincode, 
      location: {
        type: "Point",
        coordinates: [Number(lng) || 0, Number(lat) || 0],
        city: city,      
        address: address,    
        pincode: pincode
      },
      images: uploadedImages,
      owner: req.user._id,
      status: "available",
    });

    return res.status(201).json({ success: true, message: "Item added successfully", item });
  } catch (error) {
    console.error("❌ ADD ITEM ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};