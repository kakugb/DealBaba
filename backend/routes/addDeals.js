const express = require('express');
const upload = require('../config/multer.js'); 
const { getAllFiles, getFileById, updateFile, deleteFile ,addDeal,getFileByuserId,requestDiscount,approveDiscount,getDiscountRequests, getDiscountRequestByDealId } = require('../controllers/addDealsController.js');

const router = express.Router();


router.post('/add-deal', upload.single('image'), addDeal);

router.get('/deal/:id', getFileById);

router.get('/dealbyUserId/:userId', getFileByuserId);

router.get('/getAll', getAllFiles);


router.get('/getById/:id', getFileById);


router.put('/update/:id', upload.single('image'), updateFile);


router.delete('/delete/:id', deleteFile);

router.post('/requestDiscount',requestDiscount)

router.put('/approvedDiscount/:requestId', approveDiscount);

router.get('/discountRequests', getDiscountRequests);

router.get('/getDiscountDealStatus',getDiscountRequestByDealId)

module.exports = router;
