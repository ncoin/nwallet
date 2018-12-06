import { env } from '../../src/environments/environment';

// for test (remove me) --sky`
const nonceRange = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let once = '';
export function getNonce(): string {
    let nonce = '';
    for (let i = 0; i < 20; i++) {
        nonce += nonceRange.charAt(Math.floor(Math.random() * nonceRange.length));
    }

    const current = new Date();
    return `${env.name}_${current.getFullYear()}/${current.getMonth() + 1}/${current.getDate()}_nonce_${nonce}`;
}

export function getNonceOnce(): string {
    if (once) {
        return once;
    } else {
        let nonce = '';
        for (let i = 0; i < 20; i++) {
            nonce += nonceRange.charAt(Math.floor(Math.random() * nonceRange.length));
        }

        const current = new Date();
        once = `${env.name}_${current.getFullYear()}/${current.getMonth() + 1}/${current.getDate()}_nonce_${nonce}`;
        return once;
    }
}
