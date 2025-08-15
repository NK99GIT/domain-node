import { Request, Response } from "express";
import * as EmployeeModel from "../models/employeeModel";
import path from "path";
import fs from "fs";

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await EmployeeModel.getAllEmployees();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", error: err });
  }
};

export const getEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await EmployeeModel.getEmployeeById(Number(req.params.id));
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee", error: err });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { name, email, position, salary } = req.body;
    const photo = req.file ? req.file.filename : undefined;

    const newEmployee = { name, email, position, salary: Number(salary), photo };
    const [id] = await EmployeeModel.createEmployee(newEmployee);
    res.status(201).json({ id, ...newEmployee });
  } catch (err) {
    res.status(500).json({ message: "Error creating employee", error: err });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { name, email, position, salary } = req.body;
    const id = Number(req.params.id);

    const existing = await EmployeeModel.getEmployeeById(id);
    if (!existing) return res.status(404).json({ message: "Employee not found" });

    // Delete old photo if new photo uploaded
    if (req.file && existing.photo) {
      const oldPath = path.join(__dirname, "../uploads", existing.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updatedEmployee = {
      name,
      email,
      position,
      salary: Number(salary),
      photo: req.file ? req.file.filename : existing.photo,
    };

    await EmployeeModel.updateEmployee(id, updatedEmployee);
    res.json({ id, ...updatedEmployee });
  } catch (err) {
    res.status(500).json({ message: "Error updating employee", error: err });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const existing = await EmployeeModel.getEmployeeById(id);
    if (!existing) return res.status(404).json({ message: "Employee not found" });

    // Delete photo
    if (existing.photo) {
      const oldPath = path.join(__dirname, "../uploads", existing.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await EmployeeModel.deleteEmployee(id);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting employee", error: err });
  }
};
