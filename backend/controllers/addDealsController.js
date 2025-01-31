const Deal = require('../models/addDealsModel.js');  
const cloudinary = require('../config/cloudinary.js');
const DiscountRequest = require('../models/discountRequest.js')
const User = require('../models/userModel.js')
const { Op } = require('sequelize');
const upload = require('../config/multer.js')
const fs = require('fs').promises;
const path = require('path');
const ftp = require('basic-ftp');

const ftpConfig = {
  host: '92.112.189.84', // Replace with your Hostinger FTP server address
  user: 'u500774472.dealbaba.com.au', // FTP username
  password: 'Amy@2023@2023', // FTP password
  secure: false, // Set to true if you want to use FTPS
  port: 21 // Default FTP port
};

exports.addDeal = async (req, res) => {
  try {
    const { shopName, dealName, discount, description, userId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const imageFile = req.file;
    const imageName = Date.now() + '-' + imageFile.originalname; // Create unique image name
    
    // Initialize FTP client
    const client = new ftp.Client();

    try {
      await client.access(ftpConfig);

      // Upload the image to the "images" folder on your Hostinger server
      await client.uploadFrom(imageFile.path, `/public_html/images/${imageName}`);

      // Image URL (Assuming your website's base URL)
      const imageUrl = `https://dealbaba.com.au/images/${imageName}`;

      // Create a new deal entry with image URL
      const newDeal = await Deal.create({
        userId,
        shopName,
        dealName,
        discount,
        image: imageUrl, // Save the image URL to DB
        description,
      });

      // Remove the local file after uploading it to FTP
      fs.unlink(imageFile.path, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('Temporary file deleted successfully');
        }
      });

      res.status(201).json({
        message: 'Deal added successfully!',
        deal: newDeal,
      });
    } catch (error) {
      console.error('FTP upload error:', error);
      res.status(500).json({ message: 'Failed to upload image to FTP', error });
    } finally {
      client.close();
    }

  } catch (error) {
    console.error('Error adding deal:', error);
    res.status(500).json({ message: 'Failed to add deal', error });
  }
};

// exports.addDeal = async (req, res) => {
//   try {
//     const { shopName, dealName, discount, description, userId } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ message: 'Image is required' });
//     }

//     const newDeal = await Deal.create({
//       userId,
//       shopName,
//       dealName,
//       discount,
//       image: req.file.filename, 
//       description,
//     });

//     res.status(201).json({
//       message: 'Deal added successfully!',
//       deal: newDeal,
//     });
//   } catch (error) {
//     console.error('Error adding deal:', error);
//     res.status(500).json({ message: 'Failed to add deal', error });
//   }
// };

exports.getAllFiles = async (req, res) => {
  try {
    const deals = await Deal.findAll({}); 
    res.status(200).json({ deals });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deals', error });
  }
};

exports.getFileById = async (req, res) => {
  const { id } = req.params;
  try {
    const deal = await Deal.findByPk(id); 
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    res.status(200).json({ deal });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deal', error });
  }
};

exports.getFileByuserId = async (req, res) => {
  const { userId } = req.params; 

  try {
    
    const deals = await Deal.findAll({ where: { userId } }); 
    if (deals.length === 0) {
      return res.status(404).json({ message: 'No deals found for this user' });
    }
    res.status(200).json({ deals }); 
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deals', error });
  }
};


exports.updateFile = async (req, res) => {
  const { id } = req.params;
  const { shopName, dealName, discount, description } = req.body;

  let image = req.file ? req.file.filename : null; 

  try {
    const deal = await Deal.findByPk(id); 
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    const fieldsToUpdate = {};
    let hasChanges = false;

    if (shopName && shopName !== deal.shopName) {
      fieldsToUpdate.shopName = shopName;
      hasChanges = true;
    }

    if (dealName && dealName !== deal.dealName) {
      fieldsToUpdate.dealName = dealName;
      hasChanges = true;
    }

    if (discount && discount !== deal.discount) {
      fieldsToUpdate.discount = discount;
      hasChanges = true;
    }

    if (description && description !== deal.description) {
      fieldsToUpdate.description = description;
      hasChanges = true;
    }

    // If there's an image, update it
    if (image && image !== deal.image) {
      // Delete old image from the server
      const oldImagePath = path.join(__dirname, `../uploads/${deal.image}`);
      try {
        await fs.unlink(oldImagePath); // Ensure old image is deleted
      } catch (err) {
        console.error(`Error deleting old image: ${err}`);
      }

      
      fieldsToUpdate.image = image;
      hasChanges = true;
    }

    if (!hasChanges) {
      return res.status(400).json({ message: 'No changes made to the deal' });
    }

    const [updated] = await Deal.update(fieldsToUpdate, { where: { id } });

    if (updated === 0) {
      return res.status(404).json({ message: 'Deal not found or no changes made' });
    }

    const updatedDeal = await Deal.findByPk(id);
    res.status(200).json({ message: 'Deal updated successfully', updatedDeal });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating deal', error });
  }
};



exports.deleteFile = async (req, res) => {
  const { id } = req.params;

  try {
   
    await DiscountRequest.destroy({ where: { dealId: id } });

    const deal = await Deal.findByPk(id);
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }


    if (deal.image) {
      const imagePath = path.join(__dirname, `../uploads/${deal.image}`);
      try {
        
        const fileExists = await fs.stat(imagePath);
        if (fileExists) {
          await fs.unlink(imagePath); 
          console.log(`Image deleted: ${imagePath}`);
        } else {
          console.warn(`Image does not exist: ${imagePath}`);
        }
      } catch (err) {
        console.error(`Error deleting image file: ${err}`);
      }
    }

   
    await deal.destroy();
    res.status(200).json({ message: "Deal deleted successfully" });

  } catch (error) {
    console.error("Error deleting deal:", error);
    res.status(500).json({ message: "Error deleting deal", error });
  }
};
  


exports.requestDiscount = async (req, res) => {
  const { userId,dealId } = req.body; 

  try {
   
    const existingRequest = await DiscountRequest.findOne({
      where: { userId, dealId }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You have already requested a discount for this deal.' });
    }
    const discountRequest = await DiscountRequest.create({
      userId,
      dealId
    });

    res.status(201).json({
      message: 'Discount request submitted successfully!',
      discountRequest
    });
  } catch (error) {
    console.error('Error requesting discount:', error);
    res.status(500).json({ message: 'Failed to request discount' });
  }
};




exports.getDiscountRequests = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required' });
  }

  try {
   
    const deals = await Deal.findAll({
      where: {
        userId: userId 
      }
    });

    if (deals.length === 0) {
      return res.status(404).json({ message: 'No deals found for this shopowner' });
    }

    const dealIds = deals.map(deal => deal.id);

    const discountRequests = await DiscountRequest.findAll({
      where: {
        dealId: {
          [Op.in]: dealIds 
        }
      },
      include: [
        {
          model: Deal,
          required: true,
          attributes: ['dealName','userId'], 
        },
        {
          model: User,
          required: true,
          attributes: ['name', 'phoneNumber', 'isVerified'], 
        }
      ],
      attributes: ['id', 'isApproved'], 
    });

    if (discountRequests.length === 0) {
      return res.status(404).json({ message: 'No discount requests found for the shopowner\'s deals' });
    }

    res.status(200).json({
      message: 'Discount requests retrieved successfully',
      discountRequests
    });

  } catch (error) {
    console.error('Error retrieving discount requests:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to retrieve discount requests', error: error.message });
  }
};




exports.approveDiscount = async (req, res) => {
  const { requestId } = req.params; 
  const { shopOwnerId } = req.body; 

  try {
    const discountRequest = await DiscountRequest.findByPk(requestId, {
      include: [Deal, User] 
    });

    if (!discountRequest) {
     
      return res.status(404).json({ message: 'Discount request not found' });
    }

    const deal = discountRequest.Deal;
    if (deal.userId !== shopOwnerId) {
      return res.status(403).json({ message: 'You are not authorized to approve this discount.' });
    }

    discountRequest.isApproved = true; 

    await discountRequest.save();

    res.status(200).json({
      message: 'Discount request approved successfully!',
      discountRequest
    });
  } catch (error) {
    
    console.error('Error approving discount:', error);
    res.status(500).json({ message: 'Failed to approve discount', error: error.message });
  }
};


exports.getDiscountRequestByDealId = async (req, res) => {
  const { userId,dealId } = req.query; 
 

  try {
    const discountRequest = await DiscountRequest.findOne({
      where: { dealId, userId },
    });
  
    const isApproved = discountRequest ? discountRequest.isApproved : false; 
  
    res.json({ isApproved });
  } catch (error) {
    console.error('Error fetching discount request:', error);
    res.status(500).json({ message: 'Error fetching discount request', error });
  }
  

}

exports.DiscountVisibility = async (req, res) => {
  const { id, userId } = req.body;

  try {
    const deal = await Deal.findByPk(id);

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    if (deal.userId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    deal.isVisibleToOwner = !deal.isVisibleToOwner; 
    await deal.save();

    res.status(200).json({
      message: `Discount visibility updated successfully.`,
      isVisibleToOwner: deal.isVisibleToOwner,
    });
  } catch (error) {
    console.error('Error toggling visibility:', error);
    res.status(500).json({ message: 'Failed to update visibility', error });
  }
};