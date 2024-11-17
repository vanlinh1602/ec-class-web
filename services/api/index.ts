import {
  ApiResponse,
  ApisauceConfig,
  ApisauceInstance,
  create,
} from 'apisauce';

import { ApiProblems } from '@/types/api';

function getApiProblem(response: ApiResponse<any>): ApiProblems {
  let problem: ApiProblems = { kind: 'unknown' };
  switch (response.problem) {
    case 'CONNECTION_ERROR':
      problem = { kind: 'cannot-connect', temporary: true };
      break;
    case 'NETWORK_ERROR':
      problem = { kind: 'cannot-connect', temporary: true };
      break;
    case 'TIMEOUT_ERROR':
      problem = { kind: 'timeout', temporary: true };
      break;
    case 'SERVER_ERROR':
      problem = { kind: 'server', error: response.originalError };
      break;
    case 'CLIENT_ERROR':
      switch (response.status) {
        case 401:
          problem = { kind: 'unauthorized' };
          break;
        case 403:
          problem = { kind: 'forbidden' };
          break;
        case 404:
          problem = { kind: 'not-found' };
          break;
        default:
          problem = { kind: 'rejected' };
      }
      break;
    case 'CANCEL_ERROR':
      problem = { kind: 'cancelled' };
      break;
    case 'UNKNOWN_ERROR':
    default:
  }

  if (response.originalError) {
    problem.error = response.originalError;
  }

  return problem;
}

export default class Api {
  api: ApisauceInstance;

  config: ApisauceConfig;

  constructor(config: ApisauceConfig) {
    this.config = config;
    this.api = create(config);
  }

  post = async <T>(
    path: string,
    params?: any
  ): Promise<{ kind: 'ok'; data: T } | ApiProblems> => {
    const response: ApiResponse<any> = await this.api.post(path, params);

    if (response.ok) {
      return { kind: 'ok', data: response.data };
    }
    return getApiProblem(response);
  };

  get = async <T>(
    path: string,
    params?: any
  ): Promise<{ kind: 'ok'; data: T } | ApiProblems> => {
    const response: ApiResponse<any> = await this.api.get(path, params);
    if (response.ok) {
      return { kind: 'ok', data: response.data };
    }
    return getApiProblem(response);
  };

  put = async <T>(
    path: string,
    params?: any
  ): Promise<{ kind: 'ok'; data: T } | ApiProblems> => {
    const response: ApiResponse<any> = await this.api.put(path, params);

    if (response.ok) {
      return { kind: 'ok', data: response.data };
    }
    return getApiProblem(response);
  };

  delete = async <T>(
    path: string,
    params?: any
  ): Promise<{ kind: 'ok'; data: T } | ApiProblems> => {
    const response: ApiResponse<any> = await this.api.delete(path, params);

    if (response.ok) {
      return { kind: 'ok', data: response.data };
    }
    return getApiProblem(response);
  };

  download = async (
    path: string,
    params?: any
  ): Promise<{ kind: 'ok'; data: Blob | undefined } | ApiProblems> => {
    const response: ApiResponse<Blob> = await this.api.post(path, params, {
      responseType: 'blob',
    });

    if (response.ok) {
      return { kind: 'ok', data: response.data };
    }
    return getApiProblem(response);
  };

  upload = async <T>(
    path: string,
    files: File[],
    params?: CustomObject<any>
  ): Promise<{ kind: 'ok'; data: T | undefined } | ApiProblems> => {
    const formData = new FormData();
    formData.append('file', files[0]);
    if (params) {
      Object.keys(params).forEach((key) => {
        formData.append(key, params[key]);
      });
    }

    const response: ApiResponse<any> = await this.api.post(path, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (response.ok) {
      return { kind: 'ok', data: response.data };
    }
    return getApiProblem(response);
  };
}
