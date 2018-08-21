/// This module takes an image and converts it into chaxels. A chaxel is a
/// single element of the output ASCII art and is defined in the `Chaxel` type.
use image;
use palette::{self, Pixel, Shade};

/// A chaxel contains the character to render at a given position as well as its
/// foreground and (optionally) its background. The word 'chaxel' is derived
/// from a combination of 'character' and 'pixel'.
pub struct Chaxel {
    pub character: char,
    pub fg: palette::Hsv,
}

impl Chaxel {
    pub fn vec_to_string(chaxels: &[Chaxel]) -> String {
        chaxels.iter().map(|chax| chax.character).collect()
    }
}

#[derive(Clone, Debug)]
pub struct ChaxelConverter {
    /// The list of characters we can use, with the first character representing
    /// the 'lightest' character and the last representing the 'darkest'.
    /// Must not be empty.
    pub palette: Vec<char>,
    /// Any chaxel whose value is less than this will get replaced with zero.
    /// 0.05 is a fairly reasonable value for this.
    pub min_value: f32,
    /// The value is raised to this power (after being thresholded by min_value)
    /// to determine the output color. Should satisfy 0.0 <= gamma <= 1.0.
    pub gamma: f32,
}

impl ChaxelConverter {
    /// A ChaxelConverter with some fairly reasonable
    pub fn default() -> ChaxelConverter {
        ChaxelConverter {
            palette: vec!['.', ':', ';', 'n', 'o', 'x', 'd', 'K', 'X', 'M', '@'],
            min_value: 0.05,
            gamma: 0.5,
        }
    }

    pub fn to_chaxels<P: image::Pixel<Subpixel = u8> + 'static>(
        &self,
        image: &image::ImageBuffer<P, Vec<P::Subpixel>>,
        ascii_width: u32,
    ) -> Vec<Vec<Chaxel>> {
        if image.width() == 0 || image.height() == 0 {
            return vec![];
        }

        // Monospace fonts are about twice as tall as they're wide, but we want
        // to compress the line-height a bit to make the art look more solid. So
        // 2.0 * 80% = 1.6.
        let ascii_height = ((image.height() as f32) * (ascii_width as f32)
            / (1.6 * image.width() as f32))
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
                    .map(|col| self.pixel_to_chaxel(resized.get_pixel(col, row)))
                    .collect()
            }).collect()
    }

    /// Converts an individual pixel to its chaxel. This does not do any sort of
    /// color clustering, though it does apply the threshold + gamma correction.
    fn pixel_to_chaxel<P: image::Pixel<Subpixel = u8>>(&self, pixel: &P) -> Chaxel {
        let rgb = pixel.to_rgb();
        let fg: palette::Hsv = palette::Srgb::from_raw(&rgb.data).into_format().into();
        Chaxel {
            character: self.character_for_value(fg.value),
            fg: self.adjust_color(fg),
        }
    }

    fn character_for_value(&self, value: f32) -> char {
        let approx_index = value * (self.palette.len() - 1) as f32;
        let index = approx_index.round() as usize;
        self.palette[index]
    }

    /// Applies the threshold + gamma to the given color.
    fn adjust_color(&self, color: palette::Hsv) -> palette::Hsv {
        let target_value = if color.value < self.min_value {
            0.0
        } else {
            color.value.powf(self.gamma)
        };
        color.lighten(target_value - color.value)
    }
}
