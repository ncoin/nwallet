// todo secure --sky`
export interface Signature {
    publicKey: string;
    secretKey: string;
}

type SignatureExpr = (signature: Signature) => string;
const asd: SignatureExpr = undefined;
