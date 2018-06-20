
export namespace Helper.Navigations {

    // todo rename & extension
    export function AnimateBackNavbar() {
        this.navBar.backButtonClick = function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            this.navCtrl.pop({
                animate: true,
                animation: 'ios-transition',
            });
        };
    }
}
