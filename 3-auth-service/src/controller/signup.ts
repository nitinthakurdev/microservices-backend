import { signupSchema } from "@auth/schemes/signup"
import { createAuthUser, getAuthUserByUsernameAndEmail, signToken } from "@auth/service/auth.service";
import { BadRequestError, firstLetterUppercase, IAuthDocument, IEmailMessageDetails, lowerCase, uploads } from "@nitinthakurdev/jobber-package";
import { UploadApiResponse } from "cloudinary";
import { v4 as uuidV4 } from "uuid";
import crypto from "crypto"
import { config } from "@auth/config";
import { publicDirectMessage } from "@auth/queues/auth.producer";
import { authChennel } from "@auth/server";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

export const create = async (req:Request, res:Response) => {
    const { error } = await Promise.resolve(signupSchema.validate(req.body));
    if (error?.details) {
        throw new BadRequestError(error.details[0].message, "Signup create() method error")
    };
    const { username, email, password, country, profilePicture } = req.body;
    const checkUserExist: IAuthDocument = await getAuthUserByUsernameAndEmail(username, email);
    if (checkUserExist) {
        throw new BadRequestError("Invalid credentials. Email or Username", "Signup create() method error")
    }

    const profilePublicId = uuidV4();

    const uploadResult: UploadApiResponse = await uploads(profilePicture, `${profilePublicId}`, true, true) as UploadApiResponse;
    if (!uploadResult.public_id) {
        throw new BadRequestError("file upload error. try again", "Signup create() method error")
    }

    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20))
    const randomCharacters: string = randomBytes.toString('hex');

    const authData: IAuthDocument = {
        username: firstLetterUppercase(username),
        email: lowerCase(email),
        profilePublicId,
        password,
        country,
        profilePicture: uploadResult.secure_url,
        emailVerificationToken: randomCharacters,
    } as IAuthDocument;

    const result: IAuthDocument = await createAuthUser(authData);

    const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${result.emailVerificationToken}`;

    const messageDetail: IEmailMessageDetails = {
        receiverEmail: result.email,
        verifyLink: verificationLink,
        template: "verifyEmail"
    }

    const userJwt:string = signToken(result.id!,result.email!,result.username!) 

    await publicDirectMessage(authChennel, 'email-notification', 'auth-email', JSON.stringify(messageDetail), "verify email message has been send to notification service.");
    res.status(StatusCodes.CREATED).json({
        message:"user created successfully ",
        user:result,
        token:userJwt
    })


}