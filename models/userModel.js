const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A name must be set'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'An email must be set'],
      unique: [true, 'Email alredy exist with an account...'],
      lowercase: true,
      validate: [validator.isEmail, 'Provide a valid email...'],
    },
    image: {
      type: String,
    },
    phone: {
      type: Number,
      required: [true, 'A phone number must be set'],
    },
    password: {
      type: String,
      required: [true, 'Password must be set'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Confirm Password must be set'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Confirm Password does not match Password',
      },
    },

    passseen: {
      type: String,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
      type: String,
      default: 'member',
      enum: {
        values: ['admin', 'editor', 'member'],
        message: 'Role is either ||admin|editor|member||',
      },
    },
    title: {
      type: String,
    },
    address: {
      type: String,
      trim: true,
      required: [true, 'An address must be set'],
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpiry: Date,
    expoPushToken: {
      type: String,
      required: false,
      description: 'Expo push token for notifications',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

userSchema.index({ name: 1 });

// Document middleware before find()
userSchema.pre(/^find/, function () {
  this.find({ active: { $ne: false } });
});

userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) return;
  this.passwordChangedAt = Date.now() - 1000;
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

// Document middleware for methods
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    console.log(this.passwordChangedAt, JWTTimestamp, changedTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
