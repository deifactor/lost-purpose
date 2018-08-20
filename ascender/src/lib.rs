extern crate ansi_term;
extern crate failure;
extern crate image;
extern crate itertools;
extern crate palette;
extern crate rusttype;

mod chaxel;
mod output;

pub use chaxel::ChaxelConverter;
pub use output::to_256_terminal;
pub use output::BitmapRenderer;
