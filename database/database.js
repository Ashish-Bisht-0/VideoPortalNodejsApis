const mongoose = require("mongoose");
const { mongo_uri } = require("../config/config");

        mongoose.connect(mongo_uri);
        const db_connection = mongoose.connection;
       
        // const password = await bcrypt.hash("abc123", 10); // Specify the number of salt rounds
        // const user1 = new loginModel({
        //   username : "TestUser1",
        //   password: password,
        //   role: "admin"
        // });
        // const user2 = new loginModel({
        //     username : "TestUser2",
        //     password: password,
        //     role: "nonadmin"
        //   });
        // await user1.save();
        // await user2.save();

        // const sampleJob = new video_info({
        //     ContentID: "testId123", SubTitle: "testsub", AudioTrack: "track1",
        //     Dash: { RootFolder: "Folder1", Manifest: "manifest1" }, HLS: { RootFolder: "f2", Manifest: "manifest2" },
        //     DRM: { ResourceURL: "url1", KeyID: "key123" }, LastUpdatedBy: "testuser", Quality: ["HD", "ATMOS"]
        // });
        // await sampleJob.save().then(() => console.log("Done Successfully")).catch(err => console.log(err));
        
module.exports = {db_connection}