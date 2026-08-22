const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number']
  },
  role: {
    type: String,
    enum: ['farmer', 'buyer', 'seller', 'both', 'admin'],
    default: 'farmer',
    required: true
  },
  profileImage: {
    type: String,
    default: null
  },
  farmDetails: {
    farmName: {
      type: String,
      trim: true
    },
    location: {
      address: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    farmSize: {
      value: Number,
      unit: {
        type: String,
        enum: ['acres', 'hectares', 'sqft', 'sqm'],
        default: 'acres'
      }
    },
    farmType: {
      type: String,
      enum: ['residential', 'commercial', 'community', 'rooftop', 'vertical'],
      default: 'residential'
    },
    soilType: {
      type: String,
      enum: ['clay', 'sandy', 'loamy', 'peaty', 'chalky', 'silty']
    }
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    units: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      weather: {
        type: Boolean,
        default: true
      },
      irrigation: {
        type: Boolean,
        default: true
      },
      disease: {
        type: Boolean,
        default: true
      },
      market: {
        type: Boolean,
        default: false
      }
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


// Indexes
userSchema.index({ email: 1 });
userSchema.index({ 'farmDetails.location.coordinates': '2dsphere' });

// Virtual for full address
userSchema.virtual('fullAddress').get(function () {
  if (!this.farmDetails.location) return null;
  const loc = this.farmDetails.location;
  return `${loc.address}, ${loc.city}, ${loc.state}, ${loc.country}`;
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash password if it has been modified
  if (!this.isModified('password')) {
    return next();
  }

  // Hash password with cost of 10
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Update passwordChangedAt when password is modified
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Update lastLogin on each login
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = Date.now();
  await this.save({ validateBeforeSave: false });
};

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Generate email verification token
userSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

  this.emailVerificationToken = bcrypt.hashSync(verificationToken, 10);
  this.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return verificationToken;
};

// Generate password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  this.passwordResetToken = bcrypt.hashSync(resetToken, 10);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Static method to get user statistics
userSchema.statics.getUserStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$subscription.plan',
        count: { $sum: 1 }
      }
    }
  ]);
  return stats;
};

const migrateUserRoles = async () => {
  await User.updateMany(
    { role: { $exists: false } },
    { $set: { role: 'farmer' } }
  );
  console.log('User roles migrated');
};
const User = mongoose.model('User', userSchema);

module.exports = User;