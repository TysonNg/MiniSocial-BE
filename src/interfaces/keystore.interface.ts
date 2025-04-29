export interface KeyStoreInterface{
    userId: string;
    accessToken: string;
    refreshToken: string;
    refreshTokenUsed: string[];
    publicKey: string;
}