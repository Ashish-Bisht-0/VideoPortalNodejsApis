const { getOneDocument, insertNewDocument, updateOneDocument, deleteOneDocument } = require("../database/utilities/index")

async function getContentProperties(req, res) {
    const requestedProperties = req.query.properties;
    console.log(requestedProperties);
    const id = req.params["id"];

    try {
        const data = await getOneDocument("video_model", { ContentID: id });
        let custom_data = {};
        if (data) {
            if (requestedProperties !== undefined) {
                const requestedPropertiesList = requestedProperties.split(",");
                for (const key of requestedPropertiesList) {
                    if (key in data)
                        custom_data[key] = data[key];
                }
            }
            else {
                custom_data = data;
            }
            res.status(200).json({ "data": custom_data, "user": req.session.userId, "role": req.session.role })
            return;
        }
        else {
            res.status(404).json("Not Found")
            return;
        }
    } catch (error) {
        console.log(error);
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
        data["LastUpdatedBy"] = req.session.userId;
        data["LastUpdated"] = Date.now();
        await insertNewDocument("video_model", data);
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
        data.new_data["LastUpdatedBy"] = req.session.userId;
        data.new_data["LastUpdated"] = Date.now();
        const update_data = await updateOneDocument("video_model", { ContentID: data.ContentID }, data.new_data);
        console.log("Updated Successfully...");
        res.status(200).json(update_data);
        return
    } catch (error) {
        console.log(error)
        res.status(500).json("Internal Server Error")
        return
    }
}


async function deleteContentProperties(req, res) {
    if (req.session.role !== "admin") {
        res.status(401).json("Unauthorized");
        return;
    }
    const data = req.body;
    if (!("ContentID" in data)) {
        return res.status(400).json("Invalid Body");
    }
    try {
        await deleteOneDocument("video_model", data)
        console.log("Deleted Successfully...");
        res.status(200).json(`Content ID ${data["ContentID"]} Deleted Successfully`);
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
    deleteContentProperties,
};
