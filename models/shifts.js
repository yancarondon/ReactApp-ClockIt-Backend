const mongoose = require("mongoose");

const shiftSchema = mongoose.Schema({
    user: { type: String },
    clockIn: { type: Date, required: true },
    clockOut: { type: Date, required: true },
    breakStart: { type: Date },
    breakEnd: { type: Date },
});

const Shift = mongoose.model("shift", shiftSchema);

module.exports = Shift;
