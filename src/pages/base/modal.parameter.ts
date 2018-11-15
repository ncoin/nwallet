export interface ModalParameter {
    /** navigation back */
    canBack?: boolean;
    canClose?: boolean;
    headerType?: 'none' | 'bar';
    navType: 'modal' | 'nav';
}
