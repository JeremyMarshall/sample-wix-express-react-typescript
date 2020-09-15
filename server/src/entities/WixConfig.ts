import axios, { AxiosResponse } from 'axios';

interface IWixToken {
    access_token: string;
    refresh_token: string;
}

interface IWixAccessToken {
    access_token: string;
}
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

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public getTokensFromWix(authCode: string): Promise<IWixToken> {
        return axios.post<IWixToken>(`${this.auth_provider_base_url}/access`, {
            code: authCode,
            client_secret: this.secret,
            client_id: this.appId,
            grant_type: "authorization_code",
        }).then((resp) => resp.data);
    }

    private getAccessToken(refreshToken: string): Promise<IWixAccessToken>{
        return axios.post<IWixAccessToken>(`${this.auth_provider_base_url}/access`, {
            refresh_token: refreshToken,
            client_secret: this.secret,
            client_id: this.appId,
            grant_type: "refresh_token",
        }).then((resp) => resp.data);
    }
    public async getAppInstance(refreshToken: string) {
        try {
            console.log('getAppInstance with refreshToken = ' + refreshToken);
            console.log("==============================");
            const token  = await this.getAccessToken(refreshToken);
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
            const instance = (await appInstance.get('instance', body)).data;

            return instance;
        } catch (e) {
            console.log('error in getAppInstance');
            console.log({ e });
            return;
        }
    };
}

const WixConfigInstance = WixConfig.Instance;

export { WixConfigInstance };