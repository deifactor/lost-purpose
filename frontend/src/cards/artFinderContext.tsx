import { Art } from './cards';

const riderWaiteSmithAscii = require.context("../../assets/rider-waite-smith-ascii", true, /\.jpg/);
const siliconDawnAscii = require.context("../../assets/silicon-dawn-ascii", true, /\.jpg/);

export function context(art: Art): (id: string) => string {
  switch (art) {
    case Art.SiliconDawn: return siliconDawnAscii;
    case Art.RiderWaiteSmith: return riderWaiteSmithAscii;
  }
}
