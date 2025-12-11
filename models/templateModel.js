const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    client: { type: String, required: true },
    category: {
      type: String,
      required: true,
    },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    metrics: { type: String },
    image: { type: String },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

projectSchema.pre(/^find/, function () {
  this.find({ active: { $ne: false } });
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
