const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  description: String,
  taxApplicability: { type: Boolean },
  tax: { type: Number },
  category: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
});

subCategorySchema.pre('save', async function(next) {
  if (this.taxApplicability === undefined || this.tax === undefined) {
    const category = await mongoose.model('Category').findById(this.category);
    if (!category) throw new Error('Category not found');
    
    if (this.taxApplicability === undefined) {
      this.taxApplicability = category.taxApplicability;
    }
    if (this.tax === undefined) {
      this.tax = category.tax;
    }
  }
  next();
});

module.exports = mongoose.model('SubCategory', subCategorySchema);