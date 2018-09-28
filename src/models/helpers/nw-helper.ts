export class A {
    // todo from http response --sky`
    static fromJson<T>(src: { new (): T }, response: any): T {
        return Object.assign(new src(), response);
    }
}
