import { UseInterceptors } from "@nestjs/common";
import { AxiosErrorInterceptor } from "../interceptors/axiosError.interceptor";


export const UseAxiosErrorInterceptor = () => UseInterceptors(AxiosErrorInterceptor);