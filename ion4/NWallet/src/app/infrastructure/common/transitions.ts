import { Nav, ModalOptions } from '@ionic/angular';

// export interface NavOptions {
//     animate?: boolean;
//     animation?: string;
//     direction?: string;
//     duration?: number;
//     easing?: string;
//     id?: string;
//     keyboardClose?: boolean;
//     progressAnimation?: boolean;
//     disableApp?: boolean;
//     minClickBlockDuration?: number;
//     ev?: any;
//     updateUrl?: boolean;
//     isNavRoot?: boolean;
// }

// todo rearchitecturing --sky`
export namespace NWTransition {
    // this.navCtrl.push(
    //     WalletDetailPage,
    //     { wallet: wallet },

    // );

    export function Slide(direction: 'left' | 'right' = 'left'): NavOptions {
        return {
            animate: true,
            animation: 'ios-transition',
            direction: direction,
        };
    }
}

export namespace NWModalTransition {
    export function Slide(direction: 'left' | 'right' = 'left'): ModalOptions {
        return {
            showBackdrop: true,
            // enableBackdropDismiss?: boolean;
            // enterAnimation?: string;
            // leaveAnimation?: string;
        };
    }
}
