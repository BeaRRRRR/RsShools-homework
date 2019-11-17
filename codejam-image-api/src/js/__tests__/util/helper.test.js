import rgbaToHex from '../../util/helper';

describe('helper', () => {
  it('should convert rgba to hex', () => {
    expect(rgbaToHex(10,1,233)).toEqual('#0A01E9'.toLowerCase());
  });
});
