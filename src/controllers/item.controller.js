// // import Item from "../models/item.model.js";
// // import cloudinary from "../utils/cloudinary.js";
// // import mongoose from "mongoose";

// //  export const addItem = async (req, res) => {
// //   try {
// //     const userId = req.user._id;
// //  const {
// //   title,
// //   category,
// //   pricePerDay,
// //   deposit,
// //   description,
// //   condition,
// //   minDays,
// //   maxDays,
// //   city,
// //   address,
// //   pincode,
// //   coverIndex,
// // } = req.body;


// //  if (!req.files || req.files.length === 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "At least one image is required",
// //       });
// //     }

// //     const cover = Number(coverIndex) || 0;
// //     const uploadedImages = [];

// //     for (let i = 0; i < req.files.length; i++) {
// //       const result = await cloudinary.uploader.upload(
// //         req.files[i].path,
// //         { folder: "borrowhub/items" }
// //       );

// //       uploadedImages.push({
// //         url: result.secure_url,
// //         isCover: cover === i,
// //       });
// //     }

    

// //     const item = await Item.create({
// //   title,
// //   category,
// //   pricePerDay,     // 🔥
// //   deposit,         // 🔥
// //   description,
// //   condition,
// //   minDays,
// //   maxDays,
// //   location: {
// //   city,
// //   address,
// //   pincode,
// // },

// //   images: uploadedImages,
// //   owner: req.user._id,
// //   status: "available",
// // });



   

// //     return res.status(201).json({
// //       success: true,
// //       message: "Item added successfully",
// //       item,
// //     });

// //   } 
  
  
  
// //     catch (error) {
// //   console.error("❌ ADD ITEM ERROR:", error);

// //   return res.status(500).json({
// //     success: false,
// //     message: error.message, // 🔥 YE LINE SAB FIX KAREGI
// //   });
// //   }
// // };

// //  export const getMyItems = async (req, res) => {
// //   try {
// //     const items = await Item.find({
// //       owner: req.user._id,
// //     });

// //     res.json({
// //       success: true,
// //       items,
// //     });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };
  

 


// //  export const getBorrowedItems = async (req, res) => {
// //   const items = await Item.find({
// //     borrowedBy: req.user._id,
// //     status: "borrowed",
// //   })
// //     .populate("owner", "name");

// //   res.json({ items });
// // };



// //   export const getItemById = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const item = await Item.findById(id)
// //       .populate("owner", "name rating");

// //     if (!item) {
// //       return res.status(404).json({ message: "Item not found" });
// //     }

// //     // 🔹 similar items (same category, except current)
// //     const suggestions = await Item.find({
// //       category: item.category,
// //       _id: { $ne: item._id },
// //       status: "available",
// //     }).limit(6);

// //     res.json({
// //       item,
// //       suggestions,
// //     });
// //   } catch (err) {
// //     console.error("getItemById error:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };



// // // saare avaliable items 
// //   export const getAllItems = async (req, res) => {
// //   try {
// //     const { search } = req.query;

// //     let filter = {
// //       status: "available",
// //     };

// //     // 🔍 SEARCH BY TITLE OR CATEGORY
// //     if (search) {
// //       filter.$or = [
// //         {
// //           title: { $regex: search, $options: "i" },    // item name
// //         },
// //         {
// //           category: { $regex: search, $options: "i" }, // category
// //         },
// //       ];
// //     }

// //     const items = await Item.find(filter);

// //     res.json({
// //       success: true,
// //       items,
// //     });
// //   } catch (err) {
// //     console.error("getAllItems error:", err);
// //     res.status(500).json({
// //       success: false,
// //       message: "Server error",
// //     });
// //   }
// // };



// //    export const updateItem = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const {
// //       title,
// //       category,
// //       description,
// //       condition,
// //       minDays,
// //       maxDays,
// //       pricePerDay,
// //       deposit,
// //       city,
// //       address,
// //       pincode,
// //       coverIndex,
// //     } = req.body;

// //     let updateData = {
// //       title,
// //       category,
// //       description,
// //       condition,
// //       minDays,
// //       maxDays,
// //       pricePerDay,
// //       deposit,
// //       location: { city, address, pincode },
// //     };

// //     // 🔥 IF NEW IMAGES SENT
// //     if (req.files && req.files.length > 0) {
// //       const cover = Number(coverIndex) || 0;
// //       const uploadedImages = [];

// //       for (let i = 0; i < req.files.length; i++) {
// //         const result = await cloudinary.uploader.upload(
// //           req.files[i].path,
// //           { folder: "borrowhub/items" }
// //         );

// //         uploadedImages.push({
// //           url: result.secure_url,
// //           isCover: cover === i,
// //         });
// //       }

// //       updateData.images = uploadedImages;
// //     }
// //     //update ke liye

// //     const updatedItem = await Item.findByIdAndUpdate(id, updateData, {
// //       new: true,
// //     });

// //     res.json({ success: true, item: updatedItem });
// //   } catch (err) {
// //     console.error("updateItem error:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

// // export const borrowItem = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { startDate, endDate } = req.body;

// //     const item = await Item.findById(id);

// //     if (!item || item.status === "borrowed") {
// //       return res.status(400).json({ message: "Item not available" });
// //     }

// //     item.status = "borrowed";
// //     item.borrowedBy = req.user._id;
// //     item.borrowFrom = startDate;
// //     item.borrowTo = endDate;

// //     await item.save();

// //     res.json({
// //       success: true,
// //       message: "Item borrowed successfully",
// //       item,
// //     });
// //   } catch (err) {
// //     res.status(500).json({ message: "Borrow failed" });
// //   }
// // };

// //  // backend/controllers/item.controller.js

// // export const getLentOutItems = async (req, res) => {
// //   try {
// //     const items = await Item.find({
// //       owner: req.user._id,
// //       // 👇 Change: Ab ye 'borrowed' AUR 'reserved' dono layega
// //       status: { $in: ["borrowed", "reserved"] }, 
// //     })
// //       .populate("borrowedBy", "name phone address")
// //       .populate("owner", "name");

// //     res.json({ items });
// //   } catch (err) {
// //     console.error("getLentOutItems error:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };


// // export const deleteItem = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const item = await Item.findById(id);

// //     if (!item) {
// //       return res.status(404).json({ message: "Item not found" });
// //     }

// //     // 🔐 owner check
// //     if (item.owner.toString() !== req.user._id.toString()) {
// //       return res.status(403).json({ message: "Not authorized" });
// //     }

// //     await item.deleteOne();

// //     res.json({
// //       success: true,
// //       message: "Item deleted successfully",
// //     });
// //   } catch (err) {
// //     console.error("Delete item error:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };



 
// // export const getItemsNearMe = async (req, res) => {
// //   try {
// //     const { lng, lat } = req.query;

// //     // Validation: Agar location nahi mili, to normal items bhej do
// //     if (!lng || !lat) {
// //        const items = await Item.find().sort({ createdAt: -1 }); // Newest first fallback
// //        return res.status(200).json({ success: true, items });
// //     }

// //     // 🔥 AGGREGATION PIPELINE (The Magic)
// //     const items = await Item.aggregate([
// //       {
// //         $geoNear: {
// //           near: { 
// //             type: "Point", 
// //             coordinates: [parseFloat(lng), parseFloat(lat)] 
// //           },
// //           distanceField: "distance", // Output me ek nayi field aayegi 'distance' (meters me)
// //           spherical: true,
// //           // maxDistance: 10000 hataya taaki SARE items dikhein
// //         }
// //       },
// //       {
// //         $match: { status: "available" } // Sirf Available items dikhana
// //       }
// //     ]);

// //     res.status(200).json({ success: true, count: items.length, items });

// //   } catch (err) {
// //     console.error("GeoNear Error:", err);
// //     res.status(500).json({ message: "Server Error" });
// //   }
// // };






































  

// // import Item from "../models/item.model.js";
// // import cloudinary from "../utils/cloudinary.js";
// // import mongoose from "mongoose";


// // export const addItem = async (req, res) => {
// //   try {
// //     const {
// //       title, category, pricePerDay, deposit, description,
// //       condition, minDays, maxDays,
// //       city, address, pincode, // 🔥 Ye Manual Address hai (Text)
// //       coverIndex,
// //       latitude, longitude // 🔥 Ye Automatic GPS Location hai
// //     } = req.body;

// //     // Image Validation
// //     if (!req.files || req.files.length === 0) {
// //       return res.status(400).json({ success: false, message: "At least one image is required" });
// //     }

// //     // 1. Image Upload Logic
// //     const cover = Number(coverIndex) || 0;
// //     const uploadedImages = [];
// //     for (let i = 0; i < req.files.length; i++) {
// //       const result = await cloudinary.uploader.upload(req.files[i].path, { folder: "borrowhub/items" });
// //       uploadedImages.push({ url: result.secure_url, isCover: cover === i });
// //     }

// //     // 2. Location Logic (GPS)
// //     // Agar automatic location aayi hai to use karo, varna 0,0 (Default)
// //     let geoLocation = { type: "Point", coordinates: [0, 0] };
    
// //     if (latitude && longitude && latitude !== "0") {
// //         geoLocation = { 
// //             type: "Point", 
// //             coordinates: [parseFloat(longitude), parseFloat(latitude)] // Mongo me [Lng, Lat] hota hai
// //         };
// //     }

// //     // 3. Create Item (Schema ke hisab se data map kiya)
// //     const item = await Item.create({
// //       title, category, pricePerDay, deposit, description, condition, minDays, maxDays,
      
// //       // 🔥 FIX: Manual Address ko Root fields me daalo
// //       city, 
// //       address, 
// //       pincode,

// //       // 🔥 FIX: Automatic GPS ko location field me daalo
// //       location: geoLocation,

// //       images: uploadedImages,
// //       owner: req.user._id,
// //       status: "available",
// //     });

// //     res.status(201).json({ success: true, message: "Item added successfully", item });

// //   } catch (error) {
// //     console.error("❌ ADD ITEM ERROR:", error);
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };
 
 
// // export const getMyItems = async (req, res) => {
// //   try {
// //     const items = await Item.find({
// //       owner: req.user._id,
// //     });

// //     res.json({
// //       success: true,
// //       items,
// //     });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };

// // export const getBorrowedItems = async (req, res) => {
// //   const items = await Item.find({
// //     borrowedBy: req.user._id,
// //     status: "borrowed",
// //   }).populate("owner", "name");

// //   res.json({ items });
// // };

// // export const getItemById = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const item = await Item.findById(id).populate("owner", "name rating");

// //     if (!item) {
// //       return res.status(404).json({ message: "Item not found" });
// //     }

// //     // 🔹 similar items (same category, except current)
// //     const suggestions = await Item.find({
// //       category: item.category,
// //       _id: { $ne: item._id },
// //       status: "available",
// //     }).limit(6);

// //     res.json({
// //       item,
// //       suggestions,
// //     });
// //   } catch (err) {
// //     console.error("getItemById error:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

// // // saare avaliable items
// // export const getAllItems = async (req, res) => {
// //   try {
// //     const { search } = req.query;

// //     let filter = {
// //       status: "available",
// //     };

// //     // 🔍 SEARCH BY TITLE OR CATEGORY
// //     if (search) {
// //       filter.$or = [
// //         {
// //           title: { $regex: search, $options: "i" }, // item name
// //         },
// //         {
// //           category: { $regex: search, $options: "i" }, // category
// //         },
// //       ];
// //     }

// //     const items = await Item.find(filter);

// //     res.json({
// //       success: true,
// //       items,
// //     });
// //   } catch (err) {
// //     console.error("getAllItems error:", err);
// //     res.status(500).json({
// //       success: false,
// //       message: "Server error",
// //     });
// //   }
// // };

// //  export const updateItem = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const {
// //       title, category, description, condition, minDays, maxDays, pricePerDay, deposit,
// //       city, address, pincode,
// //       coverIndex, latitude, longitude
// //     } = req.body;

// //     let updateData = {
// //       title, category, description, condition, minDays, maxDays, pricePerDay, deposit,
// //       city, address, pincode // 🔥 Update me bhi root pe rakho
// //     };

// //     // Location update
// //     if (latitude && longitude) {
// //         updateData.location = {
// //             type: "Point",
// //             coordinates: [parseFloat(longitude), parseFloat(latitude)]
// //         };
// //     }

// //     // Image update logic (Same as before)
// //     if (req.files && req.files.length > 0) {
// //         // ... (Image upload code waisa hi rahega)
// //         // ...
// //     }

// //     const updatedItem = await Item.findByIdAndUpdate(id, updateData, { new: true });
// //     res.json({ success: true, item: updatedItem });

// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

// // export const borrowItem = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { startDate, endDate } = req.body;

// //     const item = await Item.findById(id);

// //     if (!item || item.status === "borrowed") {
// //       return res.status(400).json({ message: "Item not available" });
// //     }

// //     item.status = "borrowed";
// //     item.borrowedBy = req.user._id;
// //     item.borrowFrom = startDate;
// //     item.borrowTo = endDate;

// //     await item.save();

// //     res.json({
// //       success: true,
// //       message: "Item borrowed successfully",
// //       item,
// //     });
// //   } catch (err) {
// //     res.status(500).json({ message: "Borrow failed" });
// //   }
// // };

// // export const getLentOutItems = async (req, res) => {
// //   try {
// //     const items = await Item.find({
// //       owner: req.user._id,
// //       status: { $in: ["borrowed", "reserved"] },
// //     })
// //       .populate("borrowedBy", "name phone address")
// //       .populate("owner", "name");

// //     res.json({ items });
// //   } catch (err) {
// //     console.error("getLentOutItems error:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

// // export const deleteItem = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const item = await Item.findById(id);

// //     if (!item) {
// //       return res.status(404).json({ message: "Item not found" });
// //     }

// //     // 🔐 owner check
// //     if (item.owner.toString() !== req.user._id.toString()) {
// //       return res.status(403).json({ message: "Not authorized" });
// //     }

// //     await item.deleteOne();

// //     res.json({
// //       success: true,
// //       message: "Item deleted successfully",
// //     });
// //   } catch (err) {
// //     console.error("Delete item error:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

 
 

// // // ✅ 1. Helper Function: Do points ke beech ki doori nikalne ka Formula (Haversine)
// // function calculateDistance(lat1, lon1, lat2, lon2) {
// //   const toRad = (value) => (value * Math.PI) / 180;
// //   const R = 6371000; // Earth radius in meters

// //   const dLat = toRad(lat2 - lat1);
// //   const dLon = toRad(lon2 - lon1);
  
// //   const a =
// //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
// //     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
// //     Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
// //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// //   return R * c; // Result in meters
// // }

// // // ✅ 2. Controller
// // export const getItemsNearMe = async (req, res) => {
// //   try {
// //     const { lng, lat } = req.query;
// //     console.log("📍 User Location:", { lng, lat });

// //     // Step A: Database se SAARE items le aao (Jo available hain)
// //     // .lean() zaroori hai taaki hum result me 'distance' add kar sakein
// //     let items = await Item.find({ status: "available" }).lean().sort({ createdAt: -1 });

// //     // Step B: Agar User ke paas location hai, to Math lagao
// //     if (lng && lat && lng !== "null" && lat !== "null" && lng !== "0") {
// //       const userLat = parseFloat(lat);
// //       const userLng = parseFloat(lng);

// //       items = items.map((item) => {
// //         // Check: Kya Item ke paas location hai?
// //         if (item.location && item.location.coordinates && item.location.coordinates.length === 2) {
// //           const itemLng = item.location.coordinates[0];
// //           const itemLat = item.location.coordinates[1];

// //           // 🔥 Javascript se Distance nikalo
// //           const dist = calculateDistance(userLat, userLng, itemLat, itemLng);
          
// //           return { ...item, distance: dist }; // Item me distance add kar diya
// //         } 
        
// //         // Agar item ki location nahi hai to
// //         return { ...item, distance: null };
// //       });

// //       // Step C: Paas wale upar, door wale neeche sort karo
// //       // (Jinka distance null hai unhe sabse last me phek do)
// //       items.sort((a, b) => {
// //         if (a.distance === null) return 1;
// //         if (b.distance === null) return -1;
// //         return a.distance - b.distance;
// //       });
      
// //       console.log("✅ Calculated distance for all items using JS");
// //     }

// //     // Step D: Result bhejo
// //     res.status(200).json({ success: true, count: items.length, items });

// //   } catch (err) {
// //     console.error("Server Error:", err);
// //     res.status(500).json({ message: "Server Error" });
// //   }
// // };

















// // import Item from "../models/item.model.js";
// // import cloudinary from "../utils/cloudinary.js";
// // import mongoose from "mongoose";


// // export const addItem = async (req, res) => {
// //   try {
// //     const {
// //       title, category, pricePerDay, deposit, description,
// //       condition, minDays, maxDays,
// //       city, address, pincode, 
// //       coverIndex,
// //       latitude, longitude 
// //     } = req.body;

// //     // Image Validation
// //     if (!req.files || req.files.length === 0) {
// //       return res.status(400).json({ success: false, message: "At least one image is required" });
// //     }

// //     // 1. Image Upload Logic
// //     const cover = Number(coverIndex) || 0;
// //     const uploadedImages = [];
// //     for (let i = 0; i < req.files.length; i++) {
// //       const result = await cloudinary.uploader.upload(req.files[i].path, { folder: "borrowhub/items" });
// //       uploadedImages.push({ url: result.secure_url, isCover: cover === i });
// //     }

// //     // 2. Location Logic (GPS)
// //     let geoLocation = { type: "Point", coordinates: [0, 0] };
    
// //     if (latitude && longitude && latitude !== "0") {
// //         geoLocation = { 
// //             type: "Point", 
// //             coordinates: [parseFloat(longitude), parseFloat(latitude)] 
// //         };
// //     }

// //     // 3. Create Item
// //     const item = await Item.create({
// //       title, category, pricePerDay, deposit, description, condition, minDays, maxDays,
// //       city, address, pincode,
// //       location: geoLocation,
// //       images: uploadedImages,
// //       owner: req.user._id,
// //       status: "available",
// //     });

// //     res.status(201).json({ success: true, message: "Item added successfully", item });

// //   } catch (error) {
// //     console.error("❌ ADD ITEM ERROR:", error);
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };
 
// // export const getMyItems = async (req, res) => {
// //   try {
// //     const items = await Item.find({
// //       owner: req.user._id,
// //     });

// //     res.json({
// //       success: true,
// //       items,
// //     });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };

// //  // backend/controllers/item.controller.js

// // export const getBorrowedItems = async (req, res) => {
// //   try {
// //     const items = await Item.find({
// //       borrowedBy: req.user._id,
// //       // 🔥 FIX: Ab ye 'reserved' items bhi layega (Jo Ticket ke liye chahiye)
// //       status: { $in: ["borrowed", "reserved"] }, 
// //     }).populate("owner", "name");

// //     res.json({ success: true, items });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };

// // export const getItemById = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const item = await Item.findById(id).populate("owner", "name rating");

// //     if (!item) {
// //       return res.status(404).json({ success: false, message: "Item not found" });
// //     }

// //     // 🔹 similar items
// //     const suggestions = await Item.find({
// //       category: item.category,
// //       _id: { $ne: item._id },
// //       status: "available",
// //     }).limit(6);

// //     // 🔥🔥 CRITICAL FIX: 'success: true' add kiya 🔥🔥
// //     res.json({
// //       success: true, // Frontend yahi dhoond raha tha
// //       item,
// //       suggestions,
// //     });

// //   } catch (err) {
// //     console.error("getItemById error:", err);
// //     res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };

// // export const getAllItems = async (req, res) => {
// //   try {
// //     const { search } = req.query;

// //     let filter = {
// //       status: "available",
// //     };

// //     if (search) {
// //       filter.$or = [
// //         { title: { $regex: search, $options: "i" } }, 
// //         { category: { $regex: search, $options: "i" } },
// //       ];
// //     }

// //     const items = await Item.find(filter);

// //     res.json({
// //       success: true,
// //       items,
// //     });
// //   } catch (err) {
// //     console.error("getAllItems error:", err);
// //     res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };

// // export const updateItem = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const {
// //       title, category, description, condition, minDays, maxDays, pricePerDay, deposit,
// //       city, address, pincode,
// //       coverIndex, latitude, longitude
// //     } = req.body;

// //     let updateData = {
// //       title, category, description, condition, minDays, maxDays, pricePerDay, deposit,
// //       city, address, pincode 
// //     };

// //     if (latitude && longitude) {
// //         updateData.location = {
// //             type: "Point",
// //             coordinates: [parseFloat(longitude), parseFloat(latitude)]
// //         };
// //     }

// //     if (req.files && req.files.length > 0) {
// //        // Image update logic skipped for brevity as requested, assume handled
// //     }

// //     const updatedItem = await Item.findByIdAndUpdate(id, updateData, { new: true });
// //     res.json({ success: true, item: updatedItem });

// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

// // export const borrowItem = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { startDate, endDate } = req.body;

// //     const item = await Item.findById(id);

// //     if (!item || item.status === "borrowed") {
// //       return res.status(400).json({ success: false, message: "Item not available" });
// //     }

// //     item.status = "borrowed";
// //     item.borrowedBy = req.user._id;
// //     item.borrowFrom = startDate;
// //     item.borrowTo = endDate;

// //     await item.save();

// //     res.json({
// //       success: true,
// //       message: "Item borrowed successfully",
// //       item,
// //     });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: "Borrow failed" });
// //   }
// // };

// // export const getLentOutItems = async (req, res) => {
// //   try {
// //     const items = await Item.find({
// //       owner: req.user._id,
// //       status: { $in: ["borrowed", "reserved"] },
// //     })
// //       .populate("borrowedBy", "name phone address")
// //       .populate("owner", "name");

// //     // 🔥 FIX: Added success: true
// //     res.json({ success: true, items });
// //   } catch (err) {
// //     console.error("getLentOutItems error:", err);
// //     res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };

// // export const deleteItem = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const item = await Item.findById(id);

// //     if (!item) return res.status(404).json({ message: "Item not found" });

// //     if (item.owner.toString() !== req.user._id.toString()) {
// //       return res.status(403).json({ message: "Not authorized" });
// //     }

// //     await item.deleteOne();

// //     res.json({ success: true, message: "Item deleted successfully" });
// //   } catch (err) {
// //     console.error("Delete item error:", err);
// //     res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };

// // // Helper Function
// // function calculateDistance(lat1, lon1, lat2, lon2) {
// //   const toRad = (value) => (value * Math.PI) / 180;
// //   const R = 6371000; 
// //   const dLat = toRad(lat2 - lat1);
// //   const dLon = toRad(lon2 - lon1);
// //   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
// //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// //   return R * c; 
// // }

// // export const getItemsNearMe = async (req, res) => {
// //   try {
// //     const { lng, lat } = req.query;
// //     console.log("📍 User Location:", { lng, lat });

// //     let items = await Item.find({ status: "available" }).lean().sort({ createdAt: -1 });

// //     if (lng && lat && lng !== "null" && lat !== "null" && lng !== "0") {
// //       const userLat = parseFloat(lat);
// //       const userLng = parseFloat(lng);

// //       items = items.map((item) => {
// //         if (item.location && item.location.coordinates && item.location.coordinates.length === 2) {
// //           const itemLng = item.location.coordinates[0];
// //           const itemLat = item.location.coordinates[1];
// //           const dist = calculateDistance(userLat, userLng, itemLat, itemLng);
// //           return { ...item, distance: dist }; 
// //         } 
// //         return { ...item, distance: null };
// //       });

// //       items.sort((a, b) => {
// //         if (a.distance === null) return 1;
// //         if (b.distance === null) return -1;
// //         return a.distance - b.distance;
// //       });
// //     }

// //     res.status(200).json({ success: true, count: items.length, items });

// //   } catch (err) {
// //     console.error("Server Error:", err);
// //     res.status(500).json({ success: false, message: "Server Error" });
// //   }
// // };




























// import Item from "../models/item.model.js";
// import cloudinary from "../utils/cloudinary.js";
// import mongoose from "mongoose";

// export const addItem = async (req, res) => {
//   try {
//     const {
//       title, category, pricePerDay, deposit, description,
//       condition, minDays, maxDays,
//       city, address, pincode, 
//       coverIndex,
//       latitude, longitude 
//     } = req.body;

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ success: false, message: "At least one image is required" });
//     }

//     const cover = Number(coverIndex) || 0;
//     const uploadedImages = [];
//     for (let i = 0; i < req.files.length; i++) {
//       const result = await cloudinary.uploader.upload(req.files[i].path, { folder: "borrowhub/items" });
//       uploadedImages.push({ url: result.secure_url, isCover: cover === i });
//     }

//     let geoLocation = { type: "Point", coordinates: [0, 0] };
//     if (latitude && longitude && latitude !== "0") {
//         geoLocation = { 
//             type: "Point", 
//             coordinates: [parseFloat(longitude), parseFloat(latitude)] 
//         };
//     }

//     const item = await Item.create({
//       title, category, pricePerDay, deposit, description, condition, minDays, maxDays,
//       city, address, pincode,
//       location: geoLocation,
//       images: uploadedImages,
//       owner: req.user._id,
//       status: "available",
//     });

//     res.status(201).json({ success: true, message: "Item added successfully", item });

//   } catch (error) {
//     console.error("❌ ADD ITEM ERROR:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
 
// export const getMyItems = async (req, res) => {
//   try {
//     const items = await Item.find({
//       owner: req.user._id,
//     });

//     res.json({ success: true, items });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // 🔥 FIX 1: Ab 'Completed' items bhi dikhenge (History/Verdict dekhne ke liye)
// export const getBorrowedItems = async (req, res) => {
//   try {
//     const items = await Item.find({
//       borrowedBy: req.user._id,
//       status: { $in: ["borrowed", "reserved", "disputed_in_court", "completed"] }, 
//     }).populate("owner", "name");

//     res.json({ success: true, items });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// export const getItemById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const item = await Item.findById(id).populate("owner", "name rating");

//     if (!item) return res.status(404).json({ success: false, message: "Item not found" });

//     const suggestions = await Item.find({
//       category: item.category,
//       _id: { $ne: item._id },
//       status: "available",
//     }).limit(6);

//     res.json({ success: true, item, suggestions });

//   } catch (err) {
//     console.error("getItemById error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// export const getAllItems = async (req, res) => {
//   try {
//     const { search } = req.query;
//     let filter = { status: "available" };

//     if (search) {
//       filter.$or = [
//         { title: { $regex: search, $options: "i" } }, 
//         { category: { $regex: search, $options: "i" } },
//       ];
//     }

//     const items = await Item.find(filter);
//     res.json({ success: true, items });
//   } catch (err) {
//     console.error("getAllItems error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

//  export const updateItem = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // 1. Data Destructure
//     const {
//       title, category, description, condition, minDays, maxDays, pricePerDay, deposit,
//       city, address, pincode, 
//       coverIndex, latitude, longitude,
//       keptImages // 🔥 Frontend se aayi hui string (Purani images)
//     } = req.body;

//     const item = await Item.findById(id);
//     if (!item) return res.status(404).json({ success: false, message: "Item not found" });

//     // 🔐 Security Check
//     if (item.owner.toString() !== req.user._id.toString()) {
//         return res.status(403).json({ success: false, message: "Unauthorized action" });
//     }

//     // 2. Update Text Fields (Direct update karo taaki data miss na ho)
//     item.title = title || item.title;
//     item.category = category || item.category;
//     item.description = description || item.description;
//     item.condition = condition || item.condition;
//     item.minDays = minDays || item.minDays;
//     item.maxDays = maxDays || item.maxDays;
//     item.pricePerDay = pricePerDay || item.pricePerDay;
//     item.deposit = deposit || item.deposit;
    
//     // 🔥 Fix: Address fields ko direct update karo
//     item.city = city || item.city;
//     item.address = address || item.address;
//     item.pincode = pincode || item.pincode;

//     // 3. Update Location (GPS)
//     if (latitude && longitude && latitude !== "0" && longitude !== "0") {
//         item.location = {
//             type: "Point",
//             coordinates: [parseFloat(longitude), parseFloat(latitude)]
//         };
//     }

//     // 4. 🔥🔥 IMAGE LOGIC (Sabse Important) 🔥🔥
    
//     // Step A: Pehle purani images ko reset karo (jo user ne rakhi hain)
//     if (keptImages) {
//         try {
//             item.images = JSON.parse(keptImages);
//         } catch (e) {
//             console.error("Error parsing keptImages", e);
//         }
//     }

//     // Step B: Nayi images upload karke list me JOD DO
//     if (req.files && req.files.length > 0) {
//         for (let i = 0; i < req.files.length; i++) {
//             const result = await cloudinary.uploader.upload(req.files[i].path, { folder: "borrowhub/items" });
//             item.images.push({ 
//                 url: result.secure_url, 
//                 isCover: false 
//             });
//         }
//     }

//     // Step C: Cover Image Set karo (Final Array ke hisab se)
//     // Frontend final array ka index bhej raha hai
//     const finalCoverIndex = Number(coverIndex) || 0;
    
//     if (item.images.length > 0) {
//         item.images.forEach((img, index) => {
//             img.isCover = index === finalCoverIndex;
//         });
//     } else {
//         return res.status(400).json({ success: false, message: "Item must have at least one image." });
//     }

//     // 5. Save Changes
//     const updatedItem = await item.save();

//     res.json({ success: true, message: "Item updated successfully", item: updatedItem });

//   } catch (err) {
//     console.error("Update Item Error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
// export const borrowItem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { startDate, endDate } = req.body;

//     const item = await Item.findById(id);

//     if (!item || item.status === "borrowed") {
//       return res.status(400).json({ success: false, message: "Item not available" });
//     }

//     item.status = "borrowed";
//     item.borrowedBy = req.user._id;
//     item.borrowFrom = startDate;
//     item.borrowTo = endDate;

//     await item.save();

//     res.json({
//       success: true,
//       message: "Item borrowed successfully",
//       item,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Borrow failed" });
//   }
// };

// // 🔥 FIX 2: Owner ko bhi 'Completed' items dikhenge (Payout check karne ke liye)
// export const getLentOutItems = async (req, res) => {
//   try {
//     const items = await Item.find({
//       owner: req.user._id,
//       status: { $in: ["borrowed", "reserved", "disputed_in_court", "completed"] },
//     })
//       .populate("borrowedBy", "name phone address")
//       .populate("owner", "name");

//     res.json({ success: true, items });
//   } catch (err) {
//     console.error("getLentOutItems error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// export const deleteItem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const item = await Item.findById(id);
//     if (!item) return res.status(404).json({ message: "Item not found" });

//     if (item.owner.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     await item.deleteOne();
//     res.json({ success: true, message: "Item deleted successfully" });
//   } catch (err) {
//     console.error("Delete item error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// function calculateDistance(lat1, lon1, lat2, lon2) {
//   const toRad = (value) => (value * Math.PI) / 180;
//   const R = 6371000; 
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; 
// }

// export const getItemsNearMe = async (req, res) => {
//   try {
//     const { lng, lat } = req.query;
//     let items = await Item.find({ status: "available" }).lean().sort({ createdAt: -1 });

//     if (lng && lat && lng !== "null" && lat !== "null" && lng !== "0") {
//       const userLat = parseFloat(lat);
//       const userLng = parseFloat(lng);

//       items = items.map((item) => {
//         if (item.location && item.location.coordinates && item.location.coordinates.length === 2) {
//           const itemLng = item.location.coordinates[0];
//           const itemLat = item.location.coordinates[1];
//           const dist = calculateDistance(userLat, userLng, itemLat, itemLng);
//           return { ...item, distance: dist }; 
//         } 
//         return { ...item, distance: null };
//       });

//       items.sort((a, b) => {
//         if (a.distance === null) return 1;
//         if (b.distance === null) return -1;
//         return a.distance - b.distance;
//       });
//     }
//     res.status(200).json({ success: true, count: items.length, items });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };



 import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import MyItemCard from "../components/MyItemCard";
import ItemGrid from "../components/ItemGrid";
import PenaltyApprovalModal from "../components/PenaltyApprovalModal";
import CompleteProfileModal from "../components/CompleteProfileModal"; 

const TABS = { ALL: "all", LENT: "lent", BORROWED: "borrowed" };

function MyItems() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.newOrder ? TABS.BORROWED : TABS.ALL);
  const [items, setItems] = useState([]);
  const [penaltyData, setPenaltyData] = useState(null);
  const [loading, setLoading] = useState(true);

  // User States
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [returnOtpMap, setReturnOtpMap] = useState({}); 

  const token = localStorage.getItem("token");

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let itemsUrl = "";
      if (activeTab === TABS.ALL) itemsUrl = "https://borrowhub-backend-1.onrender.com/api/items/my-items";
      else if (activeTab === TABS.LENT) itemsUrl = "https://borrowhub-backend-1.onrender.com/api/items/lent-out";
      else if (activeTab === TABS.BORROWED) itemsUrl = "https://borrowhub-backend-1.onrender.com/api/items/borrowed";

      const resItems = await fetch(itemsUrl, { headers: { Authorization: `Bearer ${token}` } });
      const dataItems = await resItems.json();
      
      const rawItems = dataItems.items || [];

      // Penalty check logic (Tera Purana Code - Safe)
      const mergedItems = rawItems.map((item) => {
        let penaltyObj = null;
        if (item.status === "disputed_in_court") {
            penaltyObj = { _id: item._id, status: "disputed", totalPenalty: item.mandate?.maxDeductibleAmount || 0, lenderComment: "Admin Case Active" };
        }
        return { ...item, penaltyRequest: penaltyObj };
      });
      setItems(mergedItems);

    } catch (err) { console.error("MyItems fetch error", err); } 
    finally { setLoading(false); }
  };

  // 🔥 SAFE FIX 1: TICKET LOGIC 
  // Ticket sirf tab dikhega jab status 'reserved' ho AUR main 'borrower' hu
  const activeTickets = items.filter(i => 
      i.status === "reserved" && 
      i.borrowedBy?._id === user?._id 
  );

  // 🔥 SAFE FIX 2: GRID LIST
  // Grid mein wo sab dikhega jo 'reserved' NAHI hai.
  // LEKIN agar main Lender hu, toh mujhe 'reserved' item bhi Grid mein dikhna chahiye (Tracking ke liye)
  const gridItems = items.filter(i => {
      // Rule A: Agar status 'borrowed', 'available' ya 'completed' hai -> Sabko dikhao
      if (i.status !== "reserved") return true;

      // Rule B: Agar status 'reserved' hai -> Sirf Owner (Lender) ko grid mein dikhao
      // (Kyunki Borrower ke paas upar Ticket hai, usko do baar dikhane ki zaroorat nahi)
      if (i.status === "reserved" && (i.owner === user?._id || i.owner?._id === user?._id)) {
          return true;
      }

      return false;
  });

  // 🔥 SAFE FIX 3: Profile Handler (Tera Purana Code)
  const handleProfileSaved = (updatedUser) => {
      setUser(updatedUser); 
      localStorage.setItem("user", JSON.stringify(updatedUser)); 
      setShowProfileModal(false);
      alert("✅ Verification Complete! OTP is now unlocked.");
  };

  const handleReturnClick = (itemId) => {
      const mockReturnOtp = itemId.slice(-4).toUpperCase();
      setReturnOtpMap(prev => ({ ...prev, [itemId]: mockReturnOtp }));
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        
        {/* 🔥🔥 SECTION 1: TICKETS (Sirf Borrower ke liye) 🔥🔥 */}
        {activeTickets.length > 0 && activeTickets.map(ticket => {
            const isVerified = user && user.address && user.idProof;

            return (
                <div key={ticket._id} className="card border-0 shadow-lg mb-3 overflow-hidden animate__animated animate__fadeInDown" 
                     style={{ background: "linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)", borderLeft: "6px solid #16a34a" }}>
                    <div className="card-body p-0">
                        <div className="row g-0 align-items-center">
                            <div className="col-4 col-md-2">
                                 {/* Image handling safe kar di */}
                                 <img src={ticket.images?.[0]?.url || ticket.images?.[0] || "https://via.placeholder.com/150"} alt="Item" style={{ width: "100%", height: "120px", objectFit: "cover" }} />
                            </div>
                            <div className="col-8 col-md-10 p-3">
                                <h5 className="text-success fw-bold mb-1">🎟️ Pickup Pending: {ticket.title}</h5>
                                
                                <div className="d-flex align-items-center gap-3 mt-2">
                                    <div className="bg-white px-3 py-2 rounded border border-success border-dashed min-w-[120px] text-center">
                                        <span className="small text-uppercase fw-bold text-muted d-block" style={{fontSize: "0.7rem"}}>Pickup OTP</span>
                                        
                                        {isVerified ? (
                                            <span className="h4 fw-bold text-success m-0 letter-spacing-1">{ticket.pickupOtp}</span>
                                        ) : (
                                            <button 
                                                className="btn btn-sm btn-success fw-bold py-1 px-2" 
                                                onClick={() => setShowProfileModal(true)}
                                            >
                                                🔓 Unlock OTP
                                            </button>
                                        )}
                                    </div>

                                    <div className="text-muted small" style={{lineHeight: "1.2"}}>
                                        {isVerified ? (
                                            <>👉 Show this OTP to Lender <br/> to start rental.</>
                                        ) : (
                                            <b className="text-danger">⚠️ Verify profile <br/> to see OTP.</b>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        })}

        {/* TABS */}
        <div className="d-flex gap-4 border-bottom pb-2">
          <Tab label="All Items" active={activeTab === TABS.ALL} onClick={() => setActiveTab(TABS.ALL)} />
          <Tab label="Lent Out" active={activeTab === TABS.LENT} onClick={() => setActiveTab(TABS.LENT)} />
          <Tab label="Borrowed" active={activeTab === TABS.BORROWED} onClick={() => setActiveTab(TABS.BORROWED)} />
        </div>

        <div className="mt-4">
            <h4 className="fw-bold">{activeTab === TABS.BORROWED ? "Items I Borrowed" : activeTab === TABS.LENT ? "Items I Lent" : "My Items"}</h4>
        </div>

        {loading && <div className="text-center mt-5"><div className="spinner-border text-success" /></div>}

        {!loading && gridItems.length === 0 && activeTickets.length === 0 && (
            <div className="text-center mt-5 text-muted">
                <p>No items found.</p>
            </div>
        )}

        {/* 🔥🔥 SECTION 2: GRID (Ab isme Borrowed Items bhi dikhenge) 🔥🔥 */}
        {!loading && gridItems.length > 0 && (
          <ItemGrid
            items={gridItems} 
            type={activeTab}
            renderItem={(item) => (
               <div key={item._id} className="position-relative">
                  <MyItemCard 
                    item={item} 
                    type={activeTab === TABS.ALL ? (item.owner === user?._id || item.owner?._id === user?._id ? "lent" : "borrowed") : activeTab} 
                    onRefresh={fetchData} 
                  />

                  {(item.status === "borrowed") && (
                      <div className="mt-2">
                          {!returnOtpMap[item._id] ? (
                              <button className="btn btn-dark w-100 fw-bold shadow-sm" onClick={() => handleReturnClick(item._id)}>↩️ Return Item</button>
                          ) : (
                              <div className="bg-warning bg-opacity-25 border border-warning rounded p-2 text-center animate__animated animate__flipInX">
                                  <small className="text-dark fw-bold d-block">Return OTP</small>
                                  <h3 className="m-0 fw-bold text-dark letter-spacing-2">{returnOtpMap[item._id]}</h3>
                              </div>
                          )}
                      </div>
                  )}
               </div>
            )}
          />
        )}
      </div>

      {penaltyData && <PenaltyApprovalModal request={penaltyData} onClose={() => setPenaltyData(null)} onResolved={() => { setPenaltyData(null); fetchData(); }} />}
      
      {showProfileModal && (
        <CompleteProfileModal 
            user={user} 
            onClose={() => setShowProfileModal(false)} 
            onSave={handleProfileSaved} 
        />
      )}
    </>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <div onClick={onClick} style={{ cursor: "pointer", paddingBottom: "8px", borderBottom: active ? "3px solid #16a34a" : "none", color: active ? "#16a34a" : "#555", fontWeight: 600 }}>
      {label}
    </div>
  );
}

export default MyItems;