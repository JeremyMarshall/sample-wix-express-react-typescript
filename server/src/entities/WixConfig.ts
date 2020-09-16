import axios, { AxiosResponse } from 'axios';
import { Etcd3 } from 'etcd3';

import { WixToken, AppInstance } from '../schema'

const etcdClient = new Etcd3();

class WixConfig {

    public appId: string | undefined;
    public publicKey: string | undefined;
    public secret: string | undefined;
    public permissionRequestUrl = 'https://www.wix.com/app-oauth-installation/consent';

    private auth_provider_base_url = 'https://www.wix.com/oauth';
    private instance_api_url = 'https://dev.wix.com/api/v1';

    private static _instance: WixConfig;

    private constructor() {
        this.appId = process.env.APP_ID;
        this.secret = process.env.SECRET;

        const publicKey = process.env.PUBLIC_KEY as string
        const buf = Buffer.from(publicKey.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
        this.publicKey = buf.toString('utf8');
    }

    public static get Instance(): WixConfig {
        return this._instance || (this._instance = new this());
    }

    public getTokensFromWix(authCode: string): Promise<WixToken> {
        return axios.post<WixToken>(`${this.auth_provider_base_url}/access`, {
            code: authCode,
            client_secret: this.secret,
            client_id: this.appId,
            grant_type: "authorization_code",
        }).then((resp) => resp.data);
    }

    private getAccessToken(refreshToken: string): Promise<WixToken> {
        return axios.post<WixToken>(`${this.auth_provider_base_url}/access`, {
            refresh_token: refreshToken,
            client_secret: this.secret,
            client_id: this.appId,
            grant_type: "refresh_token",
        }).then((resp) => resp.data);
    }
    public async getAppInstance(refreshToken: string): Promise<AppInstance> {
        try {
            console.log('getAppInstance with refreshToken = ' + refreshToken);
            console.log("==============================");
            const token = await this.getAccessToken(refreshToken);
            console.log('accessToken = ' + token);

            const body = {
                // *** PUT YOUR PARAMS HERE ***
                //query: {limit: 10},
            };
            const options = {
                headers: {
                    authorization: token.access_token,
                },
            };
            const appInstance = axios.create({
                baseURL: this.instance_api_url,
                headers: { authorization: token.access_token }
            });
            const instance = (await appInstance.get<AppInstance>('instance', body)).data;


            etcdClient.lease(9 * 60, {autoKeepAlive: false})
                .put(`${this.appId}/${instance.instance.instanceId}/access_token`)
                .value(token.access_token)
                .then(val=> console.log(`written ${this.appId}/${instance.instance.instanceId}/access_token`))
                .catch( e => console.log(`access_token error ${e}`));
            etcdClient.put(`${this.appId}/${instance.instance.instanceId}/refresh_token`)
                .value(token.refresh_token)
                .then(val=> console.log(`written ${this.appId}/${instance.instance.instanceId}/refresh_token`))
                .catch( e => console.log(`refresh_token error ${e}`));

            console.log(JSON.stringify(instance));

            return instance;
        } catch (e) {
            console.log('error in getAppInstance');
            console.log({ e });
            throw (e);
        }
    };
}

const WixConfigInstance = WixConfig.Instance;

export { WixConfigInstance };