extern crate ascender;
extern crate image;
extern crate rusttype;

use std::env;
use std::fs;

fn main() {
    let args = env::args().collect::<Vec<_>>();
    let image = image::open(&args[1])
        .expect("failed to load image")
        .to_rgb();
    let chaxels = ascender::to_chaxels(&image, 60);
    print!("{}", ascender::output::to_256_terminal(&chaxels));
    let bitmap = ascender::output::to_bitmap(&chaxels, 10.0).unwrap();

    bitmap.save(&args[2]).unwrap();
}
