const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema(
  {
    _id: {
      // type: String,
      type: mongoose.Schema.ObjectId,
      default: '6928dadea41f125163f091aa',
    },
    siteName: { type: String, default: 'OPTYXENON Groups' },
    contactEmail: { type: String, default: 'hello@optyxenon.com' },
    contactAddress: {
      type: String,
      default: 'Kotei Road, Kumasi, Ghana',
    },
    contactPhone: { type: String, default: '+233 (593) 354-286' },
    heroTitle: {
      type: String,
      default: "God's Speed in Technology and Innovation",
    },
    heroSubtitle: {
      type: String,
      default:
        'Secure by design. Intelligent by default. We engineer the systems that power modern enterprises.',
    },
    corePillars: [
      {
        title: String,
        description: String,
        icon: String,
      },
    ],
    services: [
      {
        category: String,
        title: String,
        description: String,
        features: [String],
        image: String,
      },
    ],
    leadership: [
      {
        name: String,
        role: String,
        bio: String,
        image: String,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

siteSettingSchema.pre('save', function () {
  this.constructor.findOneAndUpdate(
    { _id: '6928dadea41f125163f091aa' },
    { upsert: true, new: true },
  );
});

const SiteSetting = mongoose.model('SiteSetting', siteSettingSchema);

module.exports = SiteSetting;
