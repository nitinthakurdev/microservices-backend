import { AuthModel } from "@auth/models/auth.schema";
import { loginSchema } from "@auth/schemes/signin";
import { getAuthUserByEmail, getAuthUserByUsername, signToken } from "@auth/service/auth.service";
import { BadRequestError, IAuthDocument, isEmail } from "@nitinthakurdev/jobber-package";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import { omit } from "lodash";

export const read = async (req:Request,res:Response):Promise<void> =>{
const { error } = await Promise.resolve(loginSchema.validate(req.body));
    if (error?.details) {
        throw new BadRequestError(error.details[0].message, "SignIn read() method error")
    };

    const {username,password} = req.body;
    const isValidEmail:boolean = isEmail(username);
    const existUser: IAuthDocument = isValidEmail ? await  getAuthUserByEmail(username) : await getAuthUserByUsername(username);
    
    if (!existUser) {
        throw new BadRequestError("Invalid credentials", "SignIn read() method error")
    }

    const passwordMatch:boolean = await AuthModel.prototype.comparePassword(password, existUser.password as string);

    if (!passwordMatch) {
        throw new BadRequestError("Invalid credentials", "SignIn read() method error")
    }

    const userJwt:string = signToken(existUser.id!,existUser.email!,existUser.username!);

    const userData = omit(existUser ,["password"]);

    res.status(StatusCodes.OK).json({
            message:"User login successfully ",
            user:userData,
            token:userJwt
        })

}