const multer = require("multer");
const path = require("path");


const storage=multer.diskStorage({
    destination:(_req,file,cb)=>cb(null,process.env.UPLOAD_DIR || "./uploads"),
    filename: (_req,file,cb)=>cb(null,Date.now() + "-"+file.originalname)

});

const fileFilter = (_req,file,cb)=>{
    const ok = file.mimetype ==="application/pdf";
    cb(ok ? null:new Error("only pdf allowed"),ok);
};

exports.uploadPDF=multer({storage,fileFilter});