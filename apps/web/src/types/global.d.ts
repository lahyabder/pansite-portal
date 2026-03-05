export { };

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        _paq?: any[];
    }
}
