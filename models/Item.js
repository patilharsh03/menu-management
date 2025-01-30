const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  description: String,
  taxApplicability: { type: Boolean, required: true },
  tax: { 
    type: Number,
    required: function() { return this.taxApplicability; }
  },
  baseAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }
});

itemSchema.pre('save', function(next) {
  this.totalAmount = this.baseAmount - this.discount;
  next();
});

itemSchema.pre('validate', function(next) {
  if (!this.category && !this.subCategory) {
    next(new Error('Item must belong to either a category or sub-category'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Item', itemSchema);