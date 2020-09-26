import axios, { AxiosResponse } from 'axios';
import { Etcd3, IDeleteRangeResponse } from 'etcd3';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';


import { WixToken, AppInstance, Token, WixWebhook } from '../schema'

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


            etcdClient.lease(9 * 60, { autoKeepAlive: false })
                .put(`${this.appId}/${instance.instance.instanceId}/access_token`)
                .value(token.access_token)
                .then(val => console.log(`written ${this.appId}/${instance.instance.instanceId}/access_token`))
                .catch(e => console.log(`access_token error ${e}`));
            etcdClient.put(`${this.appId}/${instance.instance.instanceId}/refresh_token`)
                .value(token.refresh_token)
                .then(val => console.log(`written ${this.appId}/${instance.instance.instanceId}/refresh_token`))
                .catch(e => console.log(`refresh_token error ${e}`));

            console.log(JSON.stringify(instance));

            return instance;
        } catch (e) {
            console.log('error in getAppInstance');
            console.log({ e });
            throw (e);
        }
    };

    public decodeInstance(instance: string): Token | undefined {
        try {
            // spilt the instance into signature and data
            var pair = instance.split('.');
            var signature = this.decode(pair[0]);
            var data = pair[1];
            // sign the data using hmac-sha1-256
            var hmac = crypto.createHmac('sha256', this.secret as string);
            // @ts-ignore
            var newSignature = hmac.update(data).digest('binary');

            //   console.log(JSON.stringify(signature))

            const jsonStr = Buffer.from(data, 'base64').toString() as string;
            // console.log(`<<<${jsonStr}>>>`);
            const json = JSON.parse(jsonStr);
            const token = <Token>json;
            if (signature === newSignature) {
                etcdClient.lease(20 * 60, { autoKeepAlive: false })
                    .put(`token/${instance}`)
                    .value(jsonStr)
                    .then(val => console.log(`token/${instance}`))
                    .catch(e => console.log(`token error ${e}`));

                return token
            } else {
                return undefined
            }
        } catch (error) {
            return undefined
        }
    }
    private decode(data: string): string {
        var buf = Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
        return buf.toString('binary');
    }

    public async getToken(instanceId: string): Promise<string|undefined> {
        const accessToken = await etcdClient.get(`${this.appId}/${instanceId}/access_token`);
        if (typeof accessToken == 'string') {
            return accessToken as string;
        }

        const refreshToken = await etcdClient.get(`${this.appId}/${instanceId}/refresh_token`);
        if (typeof refreshToken != 'string') {
            return undefined;
        }
        const tokens = await this.getAccessToken(refreshToken as string);

        etcdClient.lease(9 * 60, { autoKeepAlive: false })
            .put(`${this.appId}/${instanceId}/access_token`)
            .value(tokens.access_token)
            .then(val => console.log(`written ${this.appId}/${instanceId}/access_token`))
            .catch(e => console.log(`access_token error ${e}`));

        return tokens.access_token;
    }

    public async deleteInstance(instanceId: string): Promise<IDeleteRangeResponse> {
        console.log(`deleting ${this.appId}/${instanceId}`);
        return await etcdClient.delete().prefix(`${this.appId}/${instanceId}`);
    }



    public verify(data: string): WixWebhook | undefined {
        interface VerifiedData {
            data: string
        }

        try {
            const verifiedData = <VerifiedData>jwt.verify(data, this.publicKey as string);
            const parsedData = JSON.parse(verifiedData.data);
            const prettyData = { data: { ...parsedData, data: JSON.parse(parsedData.data) } };
            
            console.log(prettyData.data);
            return <WixWebhook>prettyData.data;

        } catch (error) {
            console.log(error);
            return undefined;
        }

    }
}

const WixConfigInstance = WixConfig.Instance;

export { WixConfigInstance };