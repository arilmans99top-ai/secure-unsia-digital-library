const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },

    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true
    },

    loanDate: {
      type: Date,
      default: Date.now
    },

    returnDate: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: ["borrowed", "returned"],
      default: "borrowed"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Loan", loanSchema);