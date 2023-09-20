const mongoose = require("mongoose");
const {db_connection} = require("../database");
const video_info_schema = new mongoose.Schema({
    ContentID: { type: String, unique: true, required: true,unmodifiable: true},
    SubTitle: { type: String },
    AudioTrack: { type: String, required: true },
    Dash:
    {
        RootFolder: { type: String },
        Manifest: { type: String }
    },
    HLS: {
        RootFolder: { type: String },
        Manifest: { type: String }
    },
    DRM:
    {
        ResourceURL: { type: String },
        KeyID: { type: String }
    },
    Quality: [{ type: String, enum: ["HDR", "HD", "ATMOS"] }],
    LastUpdated: { type: Date, default: Date.now },
    LastUpdatedBy: { type: String }
});

const video_info = db_connection.model("video_info_collection", video_info_schema);

module.exports = video_info;