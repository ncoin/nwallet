export class SlideHelper {
    static getSlides<T>(items: T[], countPerPage: number): { items: T[] }[] {
        const slides: { items: T[] }[] = [];

        countPerPage = items.length > countPerPage ? countPerPage : items.length;
        let slideItems = items.splice(0, countPerPage);

        while (slideItems.length > 0) {
            slides.push({ items: slideItems });
            countPerPage = items.length > countPerPage ? countPerPage : items.length;
            slideItems = items.splice(0, countPerPage);
        }

        return slides;
    }
}
