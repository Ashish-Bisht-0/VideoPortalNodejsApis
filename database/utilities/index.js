const login_model = require("../models/login_model");
const video_model = require("../models/video_model");

const Models = {login_model,video_model};


const getOneDocument = async (model_name,queryObj)=>{
   return await Models[model_name].findOne(queryObj).exec();
}


const insertNewDocument = async(model_name,newObj)=>{
   let new_doc = new Models[model_name](newObj);
   return await new_doc.save();
}

const updateOneDocument = async (model_name,updateQuery,setQuery)=>{
    return await Models[model_name].findOneAndUpdate(updateQuery,{$set:setQuery},{new:true});
}


const deleteOneDocument = async (model_name,deleteQuery)=>{
    return await Models[model_name].deleteOne(deleteQuery);
}

module.exports={getOneDocument,insertNewDocument,updateOneDocument,deleteOneDocument};