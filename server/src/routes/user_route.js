import express from "express";
import {
  create_user,
  delete_user,
  get_user,
} from "../controllers/user_controller.js";

const user_router = express.Router();
// get all user and handle get user by query param
user_router.get("/", get_user);
// get user by id
user_router.get("/:id", get_user);
// delete user
user_router.delete("/", delete_user);
user_router.delete("/:id/:auth", delete_user);
// create user
user_router.post("/", create_user);


export { user_router };
