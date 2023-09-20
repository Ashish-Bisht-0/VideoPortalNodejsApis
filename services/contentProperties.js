const { getOneDocument,getOneCustomDocument, insertNewDocument, updateOneDocument, deleteOneDocument } = require("../database/utilities/index")

async function getContentProperties(req, res) {
    //method:get
    // http://xyz/id/?properties=key1,key2..
    const requestedProperties = req.query.properties;
    const id = req.params["id"];

    try {
        if (requestedProperties !== undefined) {
            const requestedPropertiesString = requestedProperties.split(",").join(" ");
            const data = await getOneCustomDocument("video_model", { ContentID: id },requestedPropertiesString);
            if(data){
               return res.status(200).json({success:true, data, "user": req.session.userId, "role": req.session.role })
            }
            else{
               return res.status(404).json({success:false,message:"Not Found"})
            }
        }
        else {
            const data = await getOneDocument("video_model", { ContentID: id });
            if(data){
                return res.status(200).json({success:true, data, "user": req.session.userId, "role": req.session.role })
             }
             else{
                return res.status(404).json({success:false,message:"Not Found"})
             }
        }
    } catch (error) {
        console.log(error)
        console.log(error.name,error.code)
        res.status(500).json({success:false,message:error.message})
        return;
    }
}



async function createContentProperties(req, res) {

    // method:post
    // body:{
    //     ContentID:"xxxx",
    //     Dash:{
    //         Folder:""
    //         Manifest:""
    //     }
    // }

    if (req.session.role != "admin") {
        res.status(401).json({success:false,message:"Unauthorized"});
        return;
    }
    const data = req.body;
    try {
        data["LastUpdatedBy"] = req.session.userId;
        data["LastUpdated"] = Date.now();
        await insertNewDocument("video_model", data);
        res.status(200).json({success:true,message:"Data Inserted Successfully"});
        return
    } catch (error) {
        if(error.name=='MongoServerError' && error.code === 11000){
            return res.status(409).json({status:false,message:"Content ID already exists"});
        }else if(error.name=='ValidationError'){
            return res.status(400).json({status:false,message:`${error.name} Missing field(s) in the request body`})
        }
        console.log(error)
        console.log(error.name,error.code)
        res.status(500).json({success:false,message:error.message})
        return
    }
}

async function updateContentProperties(req, res) {

    // method:put
    // body:{
    //     ContentID:"xxxx",
    //     new_data:{
    //         key1:value1,
    //         key2:value2,
    //         .
    //         .
    //         .
    //     }
    // }


    if (req.session.role !== "admin") {
        res.status(401).json({success:false,message:"Unauthorized"});
        return;
    }
    const data = req.body;
    if(!("ContentID" in  data && "new_data" in data)){
        return res.status(400).json({status:false,message:"Missing field(s) in the request body"});
    }
    try {
        data.new_data["LastUpdatedBy"] = req.session.userId;
        data.new_data["LastUpdated"] = Date.now();
        const update_data = await updateOneDocument("video_model", { ContentID: data.ContentID }, data.new_data);
        res.status(200).json({success:true,data:update_data});
        return
    } catch (error) {
        console.log(error)
        console.log(error.name,error.code)
        if(error.name=='MongoServerError' && error.code === 11000){
            return res.status(409).json({status:false,message:"Content ID cannot be modified"});
        }
        res.status(500).json({success:false,message:error.message});
        return
    }
}


async function deleteContentProperties(req, res) {

    // method:delete
    // body={
    //     ContentID:"xxxx"
    // }

    if (req.session.role !== "admin") {
        res.status(401).json({success:false,message:"Unauthorized"});
        return;
    }
    const data = req.body;
    if (!("ContentID" in data)) {
        return res.status(400).json({success:false,message:"Invalid Request Body"});
    }
    try {
        let deleted_data = await  deleteOneDocument("video_model", {"ContentID":data["ContentID"]})
        console.log("Deleted Successfully...");
        if(deleted_data)
        return res.status(200).json({success:true,message:`Content ID ${data["ContentID"]} Deleted Successfully`,deleted_data});
        else
        return res.status(200).json({success:false,message:`Content ID ${data["ContentID"]} Not Found`});
    } catch (error) {
        console.log(error)
        console.log(error.name,error.code)
        res.status(500).json({success:false,message:error.message});
        return
    }
}

module.exports = {
    getContentProperties,
    createContentProperties,
    updateContentProperties,
    deleteContentProperties,
};
