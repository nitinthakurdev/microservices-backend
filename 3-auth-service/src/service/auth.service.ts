import { firstLetterUppercase, IAuthBuyerMessageDetails, IAuthDocument, lowerCase } from "@nitinthakurdev/jobber-package";
import { AuthModel } from "@auth/models/auth.schema"
import { Model, Op } from "sequelize";
import { publicDirectMessage } from "@auth/queues/auth.producer";
import { authChennel } from "@auth/server";
import { omit } from "lodash";
import { sign } from "jsonwebtoken";
import { config } from "@auth/config";


export const createAuthUser = async (data: IAuthDocument): Promise<IAuthDocument> => {
    const result: Model = await AuthModel.create(data);
    const messageDetail: IAuthBuyerMessageDetails = {
        username: result.dataValues.username!,
        email: result.dataValues.email!,
        profilePicture: result.dataValues.profilePicture!,
        country: result.dataValues.country!,
        createdAt: result.dataValues.createdAt!,
        type: "auth"
    };

    await publicDirectMessage(authChennel, 'jobber-buyer-update', 'user-buyer', JSON.stringify(messageDetail), "Buyer detail sent to buyer service");

    const userData: IAuthDocument = omit(result.dataValues, ["password"]) as IAuthDocument;
    return userData;
};

export const getAuthUserById = async (Id: number): Promise<IAuthDocument> => {
    const result: Model = await AuthModel.findOne({
        where: {
            id: Id
        },
        attributes: {
            exclude: ["password"]
        }
    }) as Model;
    return result.dataValues;
};


export const getAuthUserByUsernameAndEmail = async (username: string, email: string): Promise<IAuthDocument> => {
    const result: Model = await AuthModel.findOne({
        where: {
            [Op.or]: [{ username: firstLetterUppercase(username) }, { email: lowerCase(email) }]
        },
    }) as Model;
    return result?.dataValues;
};


export const getAuthUserByUsername = async (username: string): Promise<IAuthDocument> => {
    const result: Model = await AuthModel.findOne({
        where: { username: firstLetterUppercase(username) },
    }) as Model;
    return result?.dataValues;
};


export const getAuthUserByEmail = async (email: string): Promise<IAuthDocument> => {
    const result: Model = await AuthModel.findOne({
        where: { email: lowerCase(email) },
    }) as Model;
    return result?.dataValues;
};


export const getAuthUserByVerificationToken = async (token: string): Promise<IAuthDocument> => {
    const result: Model = await AuthModel.findOne({
        where: { emailVerificationToken: token },
        attributes: {
            exclude: ["password"]
        }
    }) as Model;
    return result.dataValues;
};

export const getAuthUserByPasswordToken = async (passwordResetToken: string): Promise<IAuthDocument> => {
    const result: Model = await AuthModel.findOne({
        where: {
            [Op.and]: [{ passwordResetToken }, { passwordResetExpires: { [Op.gt]: new Date() } }]
        },
        attributes: {
            exclude: ["password"]
        }
    }) as Model;
    return result.dataValues;
};


export const updateVerifyEmailField = async (id: number, emailVerified: number, emailVerificationToken: string): Promise<void> => {
    await AuthModel.update(
         {
            emailVerified,
            emailVerificationToken
        },
        {where: { id }},
    ) 
};


export const updatePasswordToken = async (id: number, token: string, tokenExp: Date): Promise<void> => {
    await AuthModel.update(
         {
            passwordResetToken:token,
            passwordResetExpires:tokenExp
        },
        {where: { id }},
    ) 
};


export const updatePassword = async (id: number, password: string,): Promise<void> => {
    await AuthModel.update(
         {
            password,
            passwordResetToken:"",
            passwordResetExpires:new Date()
        },
        {where: { id }},
    ) 
};


export const signToken  = (id: number, email: string,username:string): string => {
   return sign({id,email,username},config.JWT_TOKEN!)
};











