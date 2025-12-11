const factory = require('./handlerFactory');
const SiteSetting = require('../models/siteSettingModel');

exports.getAllSiteSettings = factory.getAll(SiteSetting);
exports.getSiteSetting = factory.getOne(SiteSetting);
exports.createSiteSetting = factory.updateSite(SiteSetting);
exports.updateSiteSetting = factory.updateSite(SiteSetting);
exports.deleteSiteSetting = factory.deleteOne(SiteSetting);
