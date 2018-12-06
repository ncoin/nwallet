import { env } from '../../../environments/environment';
import { Debug } from '../../../utils/helper/debug';
import { StreamType } from '../../../interfaces/stream';

export abstract class NWalletStream<T = any> {
    public source: EventSource;
    protected type: StreamType;
    constructor(protected path: string, protected listener: (type: StreamType, event: MessageEvent, data: any) => void) {}

    public init(): this {
        Debug.assert(this.type !== undefined);
        const url = env.endpoint.stream(this.type, this.path);
        this.source = new EventSource(url, { withCredentials: true });
        this.source.addEventListener(this.type, this.onEvent());
        return this;
    }

    public close() {
        this.source.removeEventListener(this.type, this.onEvent());
        this.source.close();
    }

    public flush() {
        this.close();
        // ?
        this.source = undefined;
    }

    protected abstract process(json: any): T;

    private onEvent(): (event: MessageEvent) => void {
        return (event: MessageEvent) => {
            Debug.assert(event.type === this.type);
            const data = this.process(event.data);
            this.listener(this.type, event, data);
        };
    }
}
