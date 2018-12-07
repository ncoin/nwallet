import { Signature } from '../../interfaces/signature';

const devSigs = {
    test: {
        name: '821088888888',
        signature: <Signature>{
            publicKey: 'GC3MRRLOPMAFQQ6M6OHWHELCCLXPK4QWPBUNNEG5KS7CKH4YCFAFNCS5',
            secretKey: 'SAAETUPOTOAQ742JKW4ZSLVGTKEPF22IABSLXY7GQI7ESSPLFXGZBBJA'
        }
    },

    sky: {
        name: '821068116550',
        signature: <Signature>{
            publicKey: 'GB37D3KYP7OS6DHFUNMEKCUEYPGZFO5RUBNDV4G6S575GWUXDKVBZCVX',
            secretKey: 'SCFYXFYU2LKDVRSLMK43CZBD2X45EJEG3SN6OCNZFMBK6G2Q74N5DBLY'
        }
    }
};

export const devSig = {
    use: true,
    user: devSigs.test
};
