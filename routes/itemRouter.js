import express from 'express';
import { getAllItems, saveItem, searchItem } from '../controllers/itemController.js';

const itemRouter = express.Router();

itemRouter.get("/",getAllItems);
itemRouter.post("/",saveItem);
itemRouter.get("/:name",searchItem);

export default itemRouter;