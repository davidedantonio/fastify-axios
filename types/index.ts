import { FastifyPluginAsync } from "fastify";
import {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

declare module "fastify" {
  interface FastifyInstance {
    axios: AxiosInstance & Record<string, AxiosInstance>;
  }
}

export interface AxiosInterceptors {
  request?: (
    value: InternalAxiosRequestConfig,
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  errorRequest?: (error: unknown) => unknown;
  response?: (value: any) => any | Promise<any>;
  errorResponse?: (error: unknown) => unknown;
}

export interface FastifyAxiosClientOptions extends AxiosRequestConfig {
  interceptors?: AxiosInterceptors;
}

export interface FastifyAxiosOptions extends AxiosRequestConfig {
  clients?: Record<string, FastifyAxiosClientOptions>;
  interceptors?: AxiosInterceptors;
}

declare const fastifyAxios: FastifyPluginAsync<FastifyAxiosOptions>;

export default fastifyAxios;
