
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';


class API {

  private static _instance: API;
  public axiosClient: AxiosInstance

  private constructor() {
    const instance = new URLSearchParams(window.location.search)?.get('instance');

    const config: AxiosRequestConfig = {
      baseURL: '/api',
      headers: { 'instance': instance }
    };
    this.axiosClient = axios.create(config);
  }

  public static get Instance(): API {
    return this._instance || (this._instance = new this());
  }
}

const Instance = API.Instance;

export default Instance;