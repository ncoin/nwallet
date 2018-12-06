import { PromiseCompletionSource } from '../../../common/models';
import { NWData } from '../../models/nwallet';
import { LoggerService } from '../common/logger/logger.service';

export class TokenIssuer {
    private isProcessing: boolean;
    private tokenSource: PromiseCompletionSource<NWData.Token>;
    private tokenCache: NWData.Token;

    constructor(private logger: LoggerService) {
        this.isProcessing = false;
        this.tokenSource = new PromiseCompletionSource<NWData.Token>();
    }

    public get tokenType(): string {
        return this.tokenCache === NWData.Token.Empty ? 'new' : 'refresh';
    }

    public flush(): void {
        this.tokenCache = NWData.Token.Empty;
        if (this.tokenSource.isCompleted()) {
            this.tokenSource = new PromiseCompletionSource<NWData.Token>();
        }
    }

    public tryGetRefreshToken(): NWData.Token {
        return this.tokenCache && this.tokenCache.isExpired() ? this.tokenCache : undefined;
    }

    public async process(tokenRequest: () => Promise<NWData.Token>): Promise<NWData.Token> {
        if (this.isProcessing) {
            return this.tokenSource.getResultAsync();
        }

        try {
            this.isProcessing = true;

            if (this.tokenCache && !this.tokenCache.isExpired()) {
                this.isProcessing = false;
                this.logger.debug('[token-issuer] process result : cache token');
                return this.tokenCache;
            }

            const token = await tokenRequest();
            if (token) {
                if (token.access_token === 'invalid') {
                    this.logger.debug('[token-issuer] process result : invalid token', token);
                } else {
                    this.logger.debug('[token-issuer] process result : success');
                    this.tokenCache = token;
                    this.tokenSource.setResult(this.tokenCache);
                }
            }

            return this.tokenSource.getResultAsync();
        } finally {
            this.isProcessing = false;
        }
    }
}
