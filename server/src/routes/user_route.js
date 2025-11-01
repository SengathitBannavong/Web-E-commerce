import express from "express";
import { create_user, delete_user, get_all_users, get_user_by_id } from "../controllers/user_controller.js";

const user_router = express.Router();

user_router.get("/view-all-users", get_all_users);
user_router.get("/view-user/:id", get_user_by_id);          // url sent pass parameter
user_router.get("/view-user", get_user_by_id);              // url sent pass query  
user_router.delete("/delete-user/:id/:auth", delete_user);  // url sent pass parameter
user_router.delete("/delete-user", delete_user);            // url sent pass query
user_router.post("/create-user", create_user);


export { user_router };
