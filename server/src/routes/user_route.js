import express from "express";
import {
  create_user,
  delete_user,
  get_user,
  update_user,
} from "../controllers/user_controller.js";

const user_router = express.Router();

user_router.get("/", get_user);
user_router.get("/:id", get_user);
user_router.post("/", create_user);
user_router.put("/:id", update_user);
user_router.delete("/:id", delete_user);


export { user_router };
