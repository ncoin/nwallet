import { AssetFormatPipe } from './asset-format.pipe';
import { AssetNamePipe } from './asset-name.pipe';
import { AssetToUSDPipe } from './asset-to-usd.pipe';

describe('AssetFormatPipe', () => {
    it('create an instance', () => {
        const pipe = new AssetFormatPipe();
        expect(pipe).toBeTruthy();
    });
});

/** [obsolete] */
// describe('AssetNamePipe', () => {
//     it('create an instance', () => {
//         // const pipe = new AssetNamePipe();
//         // expect(pipe).toBeTruthy();
//     });
// });

describe('AssetToUSDPipe', () => {
    it('create an instance', () => {
        const pipe = new AssetToUSDPipe();
        expect(pipe).toBeTruthy();
    });
});
