import * as jwt from 'jsonwebtoken';


export function generateTokenPair({id, email} : {id: string, email: string}, privateKey: string) {
    
    const accessToken = jwt.sign({id,email}, privateKey, { algorithm: 'RS256', expiresIn: '1d' });
    const refreshToken = jwt.sign({id,email}, privateKey, { algorithm: 'RS256', expiresIn: '7d' });
    
    return { 
    access_token:accessToken, 
    refresh_token:refreshToken 
    };
}

