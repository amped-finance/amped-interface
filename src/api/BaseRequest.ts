import axios, { AxiosError, AxiosResponse } from "axios";
import { APP_ENVIRONMENTS } from "config/env";

/**
 * App Variables
 */

export class BaseRequest {
  protected _route: string = "_";
  protected _client = axios.create({
    baseURL: APP_ENVIRONMENTS.API.ROOT_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Api-Key": APP_ENVIRONMENTS.API.API_KEY,
    },
    family: 4,
  });

  constructor() {
    this._client.interceptors.request.use(
      (config) => config,
      (err) => {
        return Promise.reject(err);
      }
    );
  }

  private _getUrl(url: string) {
    return `${this._route}${url}`;
  }

  public async get(url: string, params = {}, headers = {}) {
    try {
      const config = {
        params,
      };

      const response = await this._client.get(this._getUrl(url), {
        ...config,
        headers,
      });
      return this._responseHandler(response);
    } catch (error) {
      return this._errorHandler(error);
    }
  }

  public async put(
    url: string,
    data = {},
    opts?: {
      access_token?: string;
    }
  ) {
    try {
      const response = await this._client.put(this._getUrl(url), data, {
        headers: {
          Authorization: `Bearer ${opts?.access_token}`,
        },
      });
      return this._responseHandler(response);
    } catch (error) {
      return this._errorHandler(error);
    }
  }

  public async post(
    url: string,
    data = {},
    opts?: {
      access_token?: string;
    }
  ) {
    try {
      const response = await this._client.post(this._getUrl(url), data, {
        headers: {
          Authorization: `Bearer ${opts?.access_token}`,
        },
      });
      return this._responseHandler(response);
    } catch (error) {
      return this._errorHandler(error);
    }
  }

  public async del(
    url: string,
    data = {},
    opts?: {
      access_token?: string;
    }
  ) {
    try {
      const response = await this._client.delete(this._getUrl(url), {
        data,
        headers: {
          Authorization: `Bearer ${opts?.access_token}`,
        },
      });
      return this._responseHandler(response);
    } catch (error) {
      return this._errorHandler(error);
    }
  }

  private async _responseHandler(response: AxiosResponse) {
    return response.data;
  }

  private async _errorHandler(axiosError: any) {
    const { response } = axiosError;

    const status = response?.status;
    //@ts-ignore
    const message = response?.data || response?.data?.message;

    return Promise.reject({ status, message });
  }
}
