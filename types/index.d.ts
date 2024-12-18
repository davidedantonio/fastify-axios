import { FastifyPluginCallback } from "fastify";
import { AxiosInstance, AxiosRequestConfig } from "axios";

declare module "fastify" {
  interface FastifyInstance {
    axios: AxiosInstance & Record<string, AxiosInstance>;
  }
}

export interface AxiosInterceptors {
  request?: (
    value: AxiosRequestConfig,
  ) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  errorRequest?: (error: any) => any;
  response?: (value: any) => any | Promise<any>;
  errorResponse?: (error: any) => any;
}

export interface FastifyAxiosClientOptions extends AxiosRequestConfig {
  interceptors?: AxiosInterceptors;
}

export interface FastifyAxiosOptions extends AxiosRequestConfig {
  clients?: Record<string, FastifyAxiosClientOptions>;
  interceptors?: AxiosInterceptors;
}

declare const fastifyAxios: FastifyPluginCallback<FastifyAxiosOptions>;

export default fastifyAxios;
