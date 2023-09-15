const video_info = require("../database/models/video_info");

async function getContentProperties(req, res) {
    const id = req.params["id"];
    try {
        const data = await  video_info.findOne({ ContentID: id });
        if (data) {
            // console.log(data)
            res.status(200).json({ data, "user": req.session.userId, "role": req.session.role })
            return;
        }
        else {
            res.status(404).json("Not Found")
            return;
        }
    } catch (error) {
        res.status(500).json("Internal Server Error")
        return;
    }
}

async function createContentProperties(req, res) {
    if (req.session.role != "admin") {
        res.status(401).json("Unauthorized");
        return;
    }
    const data = req.body;
    try {
        data["LastUpdatedBy"]=req.session.userId;
        data["LastUpdated"]=Date.now();
        const newJob = new  video_info(data);
        await newJob.save();
        console.log("Saved Successfully...");
        res.status(200).json("Data Inserted Successfully");
        return
    } catch (error) {
        console.log(error)
        res.status(500).json("Internal Server Error")
        return
    }
}

async function updateContentProperties(req, res) {
    if (req.session.role !== "admin") {
        res.status(401).json("Unauthorized");
        return;
    }
    const data = req.body;
    try {
        data.new_data["LastUpdatedBy"]=req.session.userId;
        data.new_data["LastUpdated"] = Date.now();
        console.log(data)
        const update_data = await  video_info.findOneAndUpdate({ ContentID: data.ContentID }, { $set: data.new_data }, { new: true });
        console.log("Updated Successfully...");
        res.status(200).json(update_data);
        return
    } catch (error) {
        console.log(error)
        res.status(500).json("Internal Server Error")
        return
    }
}

module.exports = {
    getContentProperties,
    createContentProperties,
    updateContentProperties,
};