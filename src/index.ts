import fp from "fastify-plugin";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { FastifyPluginAsync } from "fastify";

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

function applyInterceptors(
  instance: AxiosInstance,
  interceptors: AxiosInterceptors,
): void {
  if (interceptors.request || interceptors.errorRequest) {
    instance.interceptors.request.use(
      interceptors.request,
      interceptors.errorRequest,
    );
  }
  if (interceptors.response || interceptors.errorResponse) {
    instance.interceptors.response.use(
      interceptors.response as any,
      interceptors.errorResponse as any,
    );
  }
}

const fastifyAxios: FastifyPluginAsync<FastifyAxiosOptions> = async (
  fastify,
  opts,
) => {
  const { clients = {}, interceptors, ...defaultArgs } = opts;

  const instance = axios.create(defaultArgs) as AxiosInstance &
    Record<string, AxiosInstance>;

  if (interceptors) {
    applyInterceptors(instance, interceptors);
  }

  for (const name of Object.keys(clients)) {
    const { interceptors: clientInterceptors, ...clientArgs } = clients[
      name
    ] as FastifyAxiosClientOptions;
    const clientInstance = axios.create(clientArgs);

    if (clientInterceptors) {
      applyInterceptors(clientInstance, clientInterceptors);
    }

    instance[name] = clientInstance;
  }

  fastify.decorate("axios", instance);
};

export default fp(fastifyAxios, {
  fastify: ">= 2.0.0",
  name: "fastify-axios",
});
