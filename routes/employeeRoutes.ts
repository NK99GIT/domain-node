import express from "express";
import multer from "multer";
import path from "path";
import * as EmployeeController from "../controllers/employeeController";
const router = express.Router();


// Multer setup for photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/", EmployeeController.getEmployees);
router.get("/:id", EmployeeController.getEmployee);
router.post("/", upload.single("photo"), EmployeeController.createEmployee);
router.put("/:id", upload.single("photo"), EmployeeController.updateEmployee);
router.delete("/:id", EmployeeController.deleteEmployee);

export default router;
