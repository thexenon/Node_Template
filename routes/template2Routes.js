const express = require('express');
const siteSettingController = require('../controllers/siteSettingController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(siteSettingController.getAllSiteSettings)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    siteSettingController.createSiteSetting,
  );

router
  .route('/:id')
  .get(siteSettingController.getSiteSetting)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    siteSettingController.updateSiteSetting,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    siteSettingController.deleteSiteSetting,
  );

module.exports = router;
