import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios';

import type { AppConfig } from '@app-types/config.types';
import appConfig from '@config/app.json';
import { createTaggedLogger } from '@main/logger';

import { getVoSchemaForUrl, normalizeResponseData } from './normalizeVoResponse';

const app = appConfig as AppConfig;
const log = createTaggedLogger('API');

/** Hono(메인 내부 서버) API용 axios 인스턴스. config.api.baseURL = Hono 주소. */
export const apiClient: AxiosInstance = axios.create({
  baseURL: app.api?.baseURL,
  timeout: app.api?.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const endpoint = `${config.method?.toUpperCase()} ${config.url || ''}`;
    const query = config.params
      ? JSON.stringify(config.params)
      : undefined;
    const body = config.data
      ? JSON.stringify(config.data)
      : undefined;

    log.log('Request', { endpoint, query, body, });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터.
 * VO 응답(/projects, /traits, /abilities)은 해당 스키마로 parse해 없는 필드를 null로 채움.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const schema = getVoSchemaForUrl(response.config.url);
    if (schema) {
      response.data = normalizeResponseData(response.data, schema) as AxiosResponse['data'];
    }

    const endpoint = `${response.config.method?.toUpperCase()} ${response.config.url || ''}`;
    const statusCode = response.status;
    const body = response.data
      ? JSON.stringify(response.data)
      : undefined;

    log.log('Response', { endpoint, statusCode, body, });

    return response;
  },
  (error) => {
    if (error.response) {
      const endpoint = `${error.config?.method?.toUpperCase()} ${error.config?.url || ''}`;
      const statusCode = error.response.status;
      const body = error.response.data
        ? JSON.stringify(error.response.data)
        : undefined;

      log.error('Error Response', { endpoint, statusCode, body, });
    }
    else if (error.request) {
      const endpoint = `${error.config?.method?.toUpperCase()} ${error.config?.url || ''}`;

      log.error('Error', { endpoint, message: 'No response received', });
    }
    else {
      log.error('Error', { message: error.message, });
    }

    return Promise.reject(error);
  }
);
