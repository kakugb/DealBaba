const Deal = require('../models/addDealsModel.js');  
const cloudinary = require('../config/cloudinary.js');
const DiscountRequest = require('../models/discountRequest.js')
const User = require('../models/userModel.js')
const { Op } = require('sequelize');

exports.addDeal = async (req, res) => {
  try {
    const { shopName, dealName, discount, description, userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

 
    const result = await cloudinary.uploader.upload(req.file.path);

    
    const newDeal = await Deal.create({  
      userId,
      shopName,
      dealName,
      discount,
      image: result.secure_url,
      description,
    });

    res.status(201).json({
      message: 'Deal added successfully!',
      deal: newDeal,
    });
  } catch (error) {
    console.error('Error adding deal:', error);
    res.status(500).json({ message: 'Failed to add deal', error });
  }
};

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
  const { userId } = req.params; // Destructure userId from params

  try {
    // Assuming you want to find deals related to the userId
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
    let imageUrl;
    let image = req.file ? req.file.path : null; 
  
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
  
      if (image && image !== deal.image) {
        if (deal.cloudinaryId) {
          await cloudinary.uploader.destroy(deal.cloudinaryId);
        }

        const uploadResult = await cloudinary.uploader.upload(image, {
          folder: 'Dealbaba', 
        });
  
        imageUrl = uploadResult.secure_url;
        fieldsToUpdate.image = imageUrl;
        fieldsToUpdate.cloudinaryId = uploadResult.public_id; 
        hasChanges = true;
      }
  
      if (!hasChanges) {
        return res.status(400).json({ message: 'No changes made to the deal' });
      }
  
  
      const [updated] = await Deal.update(fieldsToUpdate, {
        where: { id },
      });
  
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
    const deal = await Deal.findByPk(id);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    if (deal.cloudinaryId) {
      await cloudinary.uploader.destroy(deal.cloudinaryId);
    }

    await deal.destroy();

    res.status(200).json({ message: 'Deal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting deal', error });
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
    console.log(existingRequest)
    // Create a new discount request
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
  const { userId } = req.query; // Retrieve userId from query parameters

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required' });
  }

  try {
    // Find all deals created by the shopowner
    const deals = await Deal.findAll({
      where: {
        userId: userId // Match the userId (shopowner) to find deals created by this user
      }
    });

    if (deals.length === 0) {
      return res.status(404).json({ message: 'No deals found for this shopowner' });
    }

    // Get the IDs of all the deals created by the shopowner
    const dealIds = deals.map(deal => deal.id);

    // Find all discount requests where the dealId is one of the deals created by the shopowner
    const discountRequests = await DiscountRequest.findAll({
      where: {
        dealId: {
          [Op.in]: dealIds // Match the dealId with the IDs of deals created by the shopowner
        }
      },
      include: [
        {
          model: Deal,
          required: true,
          attributes: ['dealName','userId'], // Only select the dealName from the Deal model
        },
        {
          model: User,
          required: true,
          attributes: ['name', 'phoneNumber', 'isVerified'], // Only select the necessary fields from the User model
        }
      ],
      attributes: ['id', 'isApproved'], // Only select the necessary fields from the DiscountRequest model
    });

    if (discountRequests.length === 0) {
      return res.status(404).json({ message: 'No discount requests found for the shopowner\'s deals' });
    }

    // Return the discount requests
    res.status(200).json({
      message: 'Discount requests retrieved successfully',
      discountRequests
    });

  } catch (error) {
    console.error('Error retrieving discount requests:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to retrieve discount requests', error: error.message });
  }
};


// controllers/discountController.js

exports.approveDiscount = async (req, res) => {
  const { requestId } = req.params; // Get the discount request ID from the URL parameter
  const { shopOwnerId } = req.body; // Get the shopOwnerId from the request body

  try {
    // Find the discount request by its ID, including related Deal and User models
    const discountRequest = await DiscountRequest.findByPk(requestId, {
      include: [Deal, User] // Include related Deal and User to check if the shopowner owns the deal
    });

    if (!discountRequest) {
      // If no discount request is found, return a 404 response
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
  const { dealId } = req.query; // Access 'dealId' from the query string
  console.log('Deal ID from query:', dealId); // Log the 'dealId' to ensure it's correct

  try {
    // Querying directly using 'dealId'
    const discountRequest = await DiscountRequest.findOne({
      where: { dealId },
    });

    if (!discountRequest) {
      return res.status(404).json({ message: 'Discount request not found' });
    }

    // Return the 'isApproved' status
    res.json({ isApproved: discountRequest.isApproved });
  } catch (error) {
    console.error('Error fetching discount request:', error);
    res.status(500).json({ message: 'Error fetching discount request', error });
  }
};



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