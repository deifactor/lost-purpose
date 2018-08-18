/// This module takes an image and converts it into chaxels. A chaxel is a
/// single element of the output ASCII art and is defined in the `Chaxel` type.
use image;
use palette;

/// A chaxel contains the character to render at a given position as well as its
/// foreground and (optionally) its background. The word 'chaxel' is derived
/// from a combination of 'character' and 'pixel'.
pub struct Chaxel {
    pub character: char,
    pub fg: palette::Srgb,
}

impl Chaxel {
    pub fn vec_to_string(chaxels: &[Chaxel]) -> String {
        chaxels.iter().map(|chax| chax.character).collect()
    }
}

/// Converts the image to a series of chaxels. The returned two-dimensional
/// vector is stored in row-major order, so you access it like `vec[y][x]`.
pub fn to_chaxels<P: image::Pixel<Subpixel = u8> + 'static>(
    image: &image::ImageBuffer<P, Vec<P::Subpixel>>,
    ascii_width: u32,
) -> Vec<Vec<Chaxel>> {
    if image.width() == 0 || image.height() == 0 {
        return vec![];
    }

    // The factor of 2.0 is because in general monospace fonts are about twice
    // as tall as they are wide.
    let ascii_height = ((image.height() as f32) * (ascii_width as f32)
        / (2.0 * image.width() as f32))
        .round() as u32;

    // Each pixel in this image will correspond to one chaxel in the output.
    let resized = image::imageops::resize(
        image,
        ascii_width,
        ascii_height,
        image::FilterType::CatmullRom,
    );
    (0..ascii_height)
        .map(|row| {
            (0..ascii_width)
                .map(|col| pixel_to_chaxel(resized.get_pixel(col, row)))
                .collect()
        }).collect()
}

fn pixel_to_chaxel<P: image::Pixel<Subpixel = u8>>(pixel: &P) -> Chaxel {
    let rgb = pixel.to_rgb();
    let fg = palette::Srgb::new(
        f32::from(rgb[0]) / 255.0,
        f32::from(rgb[1]) / 255.0,
        f32::from(rgb[2]) / 255.0,
    );
    let fg_hsv: palette::Hsv<_, _> = fg.into();
    static CHARS: [char; 14] = [
        '.', ',', ':', ';', 'n', 'o', 'x', 'd', '0', 'K', 'X', 'M', 'W', '@',
    ];
    // We apply a 'gamma' to the character selection, since darker input colors
    // will result in both darker output colors *and* fewer set pixels.
    let character = CHARS[(fg_hsv.value.powf(0.75) * (CHARS.len() - 1) as f32).round() as usize];
    Chaxel { character, fg }
}
