import knexConfig from "../knexfile";
import Knex from "knex";
const knex = Knex(knexConfig);

export interface Employee {
  id?: number;
  name: string;
  email: string;
  position: string;
  salary: number;
  photo?: string;
}

const tableName = "employees";

export const getAllEmployees = () => knex<Employee>(tableName).select("*");

export const getEmployeeById = (id: number) =>
  knex<Employee>(tableName).where({ id }).first();

export const createEmployee = (data: Employee) =>
  knex<Employee>(tableName).insert(data);

export const updateEmployee = (id: number, data: Employee) =>
  knex<Employee>(tableName).where({ id }).update(data);

export const deleteEmployee = (id: number) =>
  knex<Employee>(tableName).where({ id }).del();
