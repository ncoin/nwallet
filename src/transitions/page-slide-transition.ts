import { Animation } from 'ionic-angular/animations/animation';
import { PageTransition } from 'ionic-angular/transitions/page-transition';

export class PageSlideTransition extends PageTransition {
    public static NAME = 'PageSlide';
    public static NAME2 = 'PageSlide';
    init() {
        super.init();
        const that = this;
        const enteringView = that.enteringView.pageRef();
        const leavingView = that.leavingView.pageRef();
        const animation = new Animation(that.plt);

        const scrollContentElAnimation = new Animation(this.plt, enteringView.nativeElement.querySelector('.scroll-content'));

        const topStyles = { transform: 'translateY(-200px)' };

        const leavingViewElAnimation = new Animation(that.plt, leavingView.nativeElement);
        const enteringViewElAnimation = new Animation(that.plt, enteringView.nativeElement.querySelector('ion-content'));
        const headerElAnimation = new Animation(that.plt, enteringView.nativeElement.querySelector('ion-header.header'));
        const bookDetailsElAnimation = new Animation(that.plt, enteringView.nativeElement.querySelector('.book-cover'));
        const bookContentElAnimation = new Animation(that.plt, enteringView.nativeElement.querySelector('.bookPage-readMode'));

        leavingViewElAnimation.beforeStyles({ filter: 'blur(5px)' }).afterClearStyles(['filter']);

        enteringViewElAnimation.beforeStyles({ backgroundColor: 'transparent', backgroundImage: 'none' });

        headerElAnimation.fromTo('transform', topStyles.transform, 'translateY(0)').afterClearStyles(['transform']);

        bookDetailsElAnimation.fromTo('transform', topStyles.transform, 'translateY(0)').afterClearStyles(['transform']);

        bookContentElAnimation.fromTo('backgroundColor', 'transparent', 'white').fromTo('transform', 'translateY(1000px)', 'translateY(0)');

        scrollContentElAnimation.beforeStyles({ overflow: 'visible' }).afterClearStyles(['overflow']);

        that.duration(500)
            .add(leavingViewElAnimation)
            .add(enteringViewElAnimation)
            .add(scrollContentElAnimation)
            .duration(400)
            .add(bookContentElAnimation)
            .add(headerElAnimation)
            .add(bookDetailsElAnimation);
    }
}
