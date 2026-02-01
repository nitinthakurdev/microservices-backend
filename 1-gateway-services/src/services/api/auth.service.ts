import axios, { AxiosResponse } from "axios";
import { AxiosService } from "@gateway/services/axios";
import { config } from "@gateway/config";
import { IAuth } from "@nitinthakurdev/jobber-package";

export let axiosAuthInstance: ReturnType<typeof axios.create>


class AuthService {
    axiosService: AxiosService;
    constructor() {
        this.axiosService = new AxiosService(`${config.AUTH_BASE_URL}/api/v1/auth`, 'auth')
        axiosAuthInstance = this.axiosService.axiosHandler;
    };

    async getCurrentUser(): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosAuthInstance.get("/currentuser");
        return response
    };

    async getRefreshToken(username: string): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosAuthInstance.get(`/refresh-token/${username}`);
        return response
    };

    async changePassword(currentPassword: string, newPassword: string): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosAuthInstance.put("/change-password", { currentPassword, newPassword });
        return response
    };

    async resendEmail(data: { userId: number, email: string }): Promise<AxiosResponse> {
        const response: AxiosResponse = await axiosAuthInstance.post("/resend-email", data);
        return response
    };

    async signUp(body: IAuth): Promise<AxiosResponse> {
        const response: AxiosResponse = await this.axiosService.axiosHandler.post("/sign-up", body);
        return response
    };

    async signIn(body: IAuth): Promise<AxiosResponse> {
        const response: AxiosResponse = await this.axiosService.axiosHandler.post("/sign-in", body);
        return response
    };

    async resetPassword(token: string, password: string, confirmPassword: string): Promise<AxiosResponse> {
        const response: AxiosResponse = await this.axiosService.axiosHandler.post(`/reset-password/${token}`, { password, confirmPassword });
        return response
    };

    async forgetPassword(email: string): Promise<AxiosResponse> {
        const response: AxiosResponse = await this.axiosService.axiosHandler.post("/forgot-password", { email });
        return response
    };

    async getGigs(query: string, size: string, from: string, type: string): Promise<AxiosResponse> {
        const response: AxiosResponse = await this.axiosService.axiosHandler.post(`/search/gig/${from}/${size}/${type}?${query}`);
        return response
    };

    async getGig(gigId: string): Promise<AxiosResponse> {
        const response: AxiosResponse = await this.axiosService.axiosHandler.post(`/search/gig/${gigId}`);
        return response
    };

    async seed(count: string): Promise<AxiosResponse> {
        const response: AxiosResponse = await this.axiosService.axiosHandler.post(`/seed/${count}`);
        return response
    };


}


export const authService: AuthService = new AuthService();

