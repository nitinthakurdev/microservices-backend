import { create } from "@auth/controller/signup";
import {Router} from "express";

const router:Router = Router();

export function authRouter():Router{
    router.post("/sign-up",create)
    return router;
}



