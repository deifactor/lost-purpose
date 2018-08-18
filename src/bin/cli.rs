extern crate ascender;
extern crate image;
extern crate rusttype;
#[macro_use]
extern crate structopt;

use std::path::PathBuf;
use structopt::StructOpt;

#[derive(StructOpt, Debug)]
#[structopt(name = "cli")]
struct Opt {
    /// The image to render as ASCII.
    #[structopt(name = "FILE", parse(from_os_str))]
    input: PathBuf,

    /// How many characters wide to make the image.
    #[structopt(short = "w", long = "ascii-width", default_value = "60")]
    ascii_width: u32,

    /// The height of the font for the output image, in pixels.
    #[structopt(short = "h", long = "font-height", default_value = "10.0")]
    font_height: f32,

    /// If specified, an image will be saved to the specified output path.
    #[structopt(name = "OUTPUT", parse(from_os_str))]
    output: Option<PathBuf>,
}

fn main() {
    let opt = Opt::from_args();
    let image = image::open(opt.input)
        .expect("failed to load image")
        .to_rgb();
    let chaxels = ascender::to_chaxels(&image, opt.ascii_width);
    print!("{}", ascender::output::to_256_terminal(&chaxels));
    if let Some(output) = opt.output {
        let bitmap = ascender::output::to_bitmap(&chaxels, opt.font_height).unwrap();
        bitmap.save(output).unwrap();
    }
}
