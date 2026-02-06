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



import Item from "../models/item.model.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";

export const addItem = async (req, res) => {
  try {
    const {
      title, category, pricePerDay, deposit, description,
      condition, minDays, maxDays,
      city, address, pincode, 
      coverIndex,
      latitude, longitude 
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

    let geoLocation = { type: "Point", coordinates: [0, 0] };
    if (latitude && longitude && latitude !== "0") {
        geoLocation = { 
            type: "Point", 
            coordinates: [parseFloat(longitude), parseFloat(latitude)] 
        };
    }

    const item = await Item.create({
      title, category, pricePerDay, deposit, description, condition, minDays, maxDays,
      city, address, pincode,
      location: geoLocation,
      images: uploadedImages,
      owner: req.user._id,
      status: "available",
    });

    res.status(201).json({ success: true, message: "Item added successfully", item });

  } catch (error) {
    console.error("❌ ADD ITEM ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
 
export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({
      owner: req.user._id,
    });

    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔥 FIX 1: Ab 'Completed' items bhi dikhenge (History/Verdict dekhne ke liye)
 // 🔥 FIX: 'reserved' status add kiya taaki ticket dikhe
export const getBorrowedItems = async (req, res) => {
  try {
    const items = await Item.find({
      borrowedBy: req.user._id,
      // 'reserved' zaroori hai tabhi ticket dikhega
      status: { $in: ["borrowed", "reserved", "disputed_in_court", "completed"] }, 
    }).populate("owner", "name")
     // 👇👇 YE WALI LINE SABSE ZAROORI HAI 👇👇
    .populate("borrowedBy", "name address idProof");

    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id).populate("owner", "name rating");

    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    const suggestions = await Item.find({
      category: item.category,
      _id: { $ne: item._id },
      status: "available",
    }).limit(6);

    res.json({ success: true, item, suggestions });

  } catch (err) {
    console.error("getItemById error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = { status: "available" };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } }, 
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const items = await Item.find(filter);
    res.json({ success: true, items });
  } catch (err) {
    console.error("getAllItems error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

 export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Data Destructure
    const {
      title, category, description, condition, minDays, maxDays, pricePerDay, deposit,
      city, address, pincode, 
      coverIndex, latitude, longitude,
      keptImages // 🔥 Frontend se aayi hui string (Purani images)
    } = req.body;

    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    // 🔐 Security Check
    if (item.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized action" });
    }

    // 2. Update Text Fields (Direct update karo taaki data miss na ho)
    item.title = title || item.title;
    item.category = category || item.category;
    item.description = description || item.description;
    item.condition = condition || item.condition;
    item.minDays = minDays || item.minDays;
    item.maxDays = maxDays || item.maxDays;
    item.pricePerDay = pricePerDay || item.pricePerDay;
    item.deposit = deposit || item.deposit;
    
    // 🔥 Fix: Address fields ko direct update karo
    item.city = city || item.city;
    item.address = address || item.address;
    item.pincode = pincode || item.pincode;

    // 3. Update Location (GPS)
    if (latitude && longitude && latitude !== "0" && longitude !== "0") {
        item.location = {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
        };
    }

    // 4. 🔥🔥 IMAGE LOGIC (Sabse Important) 🔥🔥
    
    // Step A: Pehle purani images ko reset karo (jo user ne rakhi hain)
    if (keptImages) {
        try {
            item.images = JSON.parse(keptImages);
        } catch (e) {
            console.error("Error parsing keptImages", e);
        }
    }

    // Step B: Nayi images upload karke list me JOD DO
    if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
            const result = await cloudinary.uploader.upload(req.files[i].path, { folder: "borrowhub/items" });
            item.images.push({ 
                url: result.secure_url, 
                isCover: false 
            });
        }
    }

    // Step C: Cover Image Set karo (Final Array ke hisab se)
    // Frontend final array ka index bhej raha hai
    const finalCoverIndex = Number(coverIndex) || 0;
    
    if (item.images.length > 0) {
        item.images.forEach((img, index) => {
            img.isCover = index === finalCoverIndex;
        });
    } else {
        return res.status(400).json({ success: false, message: "Item must have at least one image." });
    }

    // 5. Save Changes
    const updatedItem = await item.save();

    res.json({ success: true, message: "Item updated successfully", item: updatedItem });

  } catch (err) {
    console.error("Update Item Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const borrowItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    const item = await Item.findById(id);

    if (!item || item.status === "borrowed") {
      return res.status(400).json({ success: false, message: "Item not available" });
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
    res.status(500).json({ success: false, message: "Borrow failed" });
  }
};

// 🔥 FIX 2: Owner ko bhi 'Completed' items dikhenge (Payout check karne ke liye)
export const getLentOutItems = async (req, res) => {
  try {
    const items = await Item.find({
      owner: req.user._id,
      status: { $in: ["borrowed", "reserved", "disputed_in_court", "completed"] },
    })
      // 👇👇 YAHAN CHANGE KIYA HAI: idProof aur profilePic add kiya 👇👇
      .populate("borrowedBy", "name phone address idProof profilePic")
      .populate("owner", "name");

    res.json({ success: true, items });
  } catch (err) {
    console.error("getLentOutItems error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await item.deleteOne();
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000; 
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

 export const getItemsNearMe = async (req, res) => {
  try {
    const { lng, lat, search } = req.query; // 👈 1. 'search' param yahan pakdo
    console.log("📍 Search Query Received:", search);

    // 2. Base filter: Sirf available items
    let filter = { status: "available" };

    // 3. 🔥 SEARCH LOGIC: Agar search word aaya hai toh filter update karo
    if (search && search.trim() !== "") {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // 4. Pehle filtered items database se nikalo
    let items = await Item.find(filter).lean().sort({ createdAt: -1 });

    // 5. Distance Calculation (Tera purana logic)
    if (lng && lat && lng !== "null" && lat !== "null" && lng !== "0") {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      items = items.map((item) => {
        if (item.location && item.location.coordinates && item.location.coordinates.length === 2) {
          const itemLng = item.location.coordinates[0];
          const itemLat = item.location.coordinates[1];
          const dist = calculateDistance(userLat, userLng, itemLat, itemLng);
          return { ...item, distance: dist }; 
        } 
        return { ...item, distance: null };
      });

      // Door wale niche, paas wale upar
      items.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    res.status(200).json({ success: true, count: items.length, items });

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};