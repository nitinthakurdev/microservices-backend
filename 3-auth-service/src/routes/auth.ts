import { read } from "@auth/controller/signin";
import { create } from "@auth/controller/signup";
import {Router} from "express";

const router:Router = Router();

export function authRouter():Router{
    router.post("/sign-up",create);
    router.post("/sign-in",read);
    return router;
}



