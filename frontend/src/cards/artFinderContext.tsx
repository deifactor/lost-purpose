import { Art } from './cards';

const riderWaiteSmithAscii = require.context("../../assets/rider-waite-smith-ascii", true, /\.png$/);
const siliconDawnAscii = require.context("../../assets/silicon-dawn-ascii", true, /\.png$/);

export function context(art: Art): (id: string) => string {
  switch (art) {
    case Art.SiliconDawn: return siliconDawnAscii;
    case Art.RiderWaiteSmith: return riderWaiteSmithAscii;
  }
}
