use ansi_term::Colour;
use chaxel::Chaxel;
use failure;
use image;
use itertools::Itertools;
use palette::{self, Pixel, Shade};
use rusttype;
use std::fs;
use std::path::Path;

// TODO: Change from Vec<Vec<Chaxel>> to Vec<Chaxel>

pub fn to_256_terminal(chaxels: &[Vec<Chaxel>]) -> String {
    chaxels
        .iter()
        .flat_map(|ref row| row.iter().map(to_256_term).chain(vec!["\n".to_string()]))
        .join("")
}

/// A `BitmapRenderer` renders two-dimensional arrays of chaxels onto images.
pub struct BitmapRenderer<'a> {
    font: rusttype::Font<'a>,
    height: f32,
}

impl<'a> BitmapRenderer<'a> {
    pub fn new(font: rusttype::Font, height: f32) -> BitmapRenderer {
        BitmapRenderer { font, height }
    }
    pub fn new_from_path<P: AsRef<Path>>(
        path: P,
        height: f32,
    ) -> Result<BitmapRenderer<'static>, failure::Error> {
        let bytes = fs::read(path)?;
        let collection = rusttype::FontCollection::from_bytes(bytes)?;
        let font = collection.font_at(0)?;
        Ok(BitmapRenderer::new(font, height))
    }

    pub fn render(
        &self,
        chaxels: &[Vec<Chaxel>],
    ) -> Result<image::ImageBuffer<image::Rgb<u8>, Vec<u8>>, failure::Error> {
        let glyphs: Vec<rusttype::PositionedGlyph> = self
            .font
            .layout(
                &Chaxel::vec_to_string(&chaxels[0]),
                self.scale(),
                self.offset(),
            ).collect();
        let width = glyphs
            .iter()
            .rev()
            .map(|g| g.position().x as f32 + g.unpositioned().h_metrics().advance_width)
            .next()
            .unwrap_or(0.0);

        let mut image = image::ImageBuffer::new(
            width.ceil() as u32,
            self.line_height() as u32 * chaxels.len() as u32,
        );

        self.render_to(chaxels, &mut image)?;
        Ok(image)
    }

    pub fn render_to(
        &self,
        chaxels: &[Vec<Chaxel>],
        image: &mut impl image::GenericImage<Pixel = image::Rgb<u8>>,
    ) -> Result<(), failure::Error> {
        for (row_num, row) in chaxels.iter().enumerate() {
            let row_offset = self.line_height() * row_num as f32;
            let glyphs: Vec<rusttype::PositionedGlyph> = self
                .font
                .layout(&Chaxel::vec_to_string(&row), self.scale(), self.offset())
                .collect();
            for (index, g) in glyphs.iter().enumerate() {
                if let Some(bb) = g.pixel_bounding_box() {
                    g.draw(|x, y, v| {
                        let color: palette::Hsv = row[index].fg;
                        let color: palette::Srgb = color.darken((1.0 - v) * color.value).into();
                        let x = x as i32 + bb.min.x;
                        let y = y as i32 + bb.min.y + row_offset as i32;
                        // There's still a possibility that the glyph clips the boundaries of the bitmap
                        if x >= 0 && x < image.width() as i32 && y >= 0 && y < image.height() as i32
                        {
                            image.put_pixel(
                                x as u32,
                                y as u32,
                                image::Rgb(color.into_format().into_raw()),
                            )
                        }
                    })
                }
            }
        }

        Ok(())
    }

    fn scale(&self) -> rusttype::Scale {
        rusttype::Scale {
            x: self.height,
            y: self.height,
        }
    }

    fn metrics(&self) -> rusttype::VMetrics {
        self.font.v_metrics(self.scale())
    }

    fn offset(&self) -> rusttype::Point<f32> {
        rusttype::point(0.0, self.metrics().ascent)
    }

    fn line_height(&self) -> f32 {
        let metrics = self.metrics();
        metrics.ascent - metrics.descent
    }
}

fn to_256_term(chaxel: &Chaxel) -> String {
    Colour::Fixed(to_256_terminal_color(chaxel.fg.into()))
        .paint(chaxel.character.to_string())
        .to_string()
}

/// Convert a color to the corresponding 256-color terminal.
fn to_256_terminal_color(color: palette::Srgb) -> u8 {
    let r = to_cube_index(color.red);
    let g = to_cube_index(color.green);
    let b = to_cube_index(color.blue);
    36 * r + 6 * g + b + 16
}

/// Returns the position of the value in the terminal's color cube's coordinate system.
fn to_cube_index(x: f32) -> u8 {
    // We use i32 to avoid overflow issues.
    let scaled = (x * 255.0) as i32;
    static BREAKPOINTS: [i32; 6] = [0, 95, 135, 175, 215, 255];
    BREAKPOINTS
        .iter()
        .enumerate()
        .min_by_key(|&(_, y)| (scaled - y).abs())
        .unwrap()
        .0 as u8
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn black() {
        assert_eq!(to_256_terminal_color(palette::Srgb::new(0.0, 0.0, 0.0)), 16)
    }

    #[test]
    fn almost_black() {
        assert_eq!(
            to_256_terminal_color(palette::Srgb::new(0.01, 0.01, 0.01)),
            16
        )
    }

    #[test]
    fn white() {
        assert_eq!(
            to_256_terminal_color(palette::Srgb::new(1.0, 1.0, 1.0)),
            231
        )
    }

    #[test]
    fn almost_white() {
        assert_eq!(
            to_256_terminal_color(palette::Srgb::new(0.99, 0.99, 0.99)),
            231
        )
    }

    #[test]
    fn red() {
        assert_eq!(
            to_256_terminal_color(palette::Srgb::new(1.0, 0.0, 0.0)),
            196
        )
    }

    #[test]
    fn green() {
        assert_eq!(to_256_terminal_color(palette::Srgb::new(0.0, 1.0, 0.0)), 46)
    }

    #[test]
    fn blue() {
        assert_eq!(to_256_terminal_color(palette::Srgb::new(0.0, 0.0, 1.0)), 21)
    }

    #[test]
    fn tan() {
        assert_eq!(
            to_256_terminal_color(palette::Srgb::new(
                215.0 / 255.0,
                175.0 / 255.0,
                135.0 / 255.0
            )),
            180
        )
    }
}
