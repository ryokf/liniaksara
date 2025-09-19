declare module 'midtrans-client' {
    export = MidtransClient;

    namespace MidtransClient {
        class Snap {
            constructor(config: { isProduction: boolean; serverKey: string; clientKey?: string });
            createTransaction(parameters: object): Promise<{ token: string }>;
        }

        class CoreApi {
            constructor(config: { isProduction: boolean; serverKey: string; clientKey?: string });
            charge(parameters: object): Promise<object>;
        }
    }
}