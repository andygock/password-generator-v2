// word lists
import orchardStreetLong from './orchard-street-long';
import long from './eff-long';
import short1 from './eff-short1';
import short2 from './eff-short2';

const arrOrchardStreetLong = orchardStreetLong.split('|');
const arrLong = long.split('|');
const arrShort1 = short1.split('|');
const arrShort2 = short2.split('|');
const words = {
  'orchard-street-long': arrOrchardStreetLong,
  'eff-long': arrLong,
  'eff-short1': arrShort1,
  'eff-short2': arrShort2,
};

export default words;
