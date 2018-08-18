use ansi_term::Colour;
use chaxel::Chaxel;
use failure;
use image;
use itertools::Itertools;
use palette::{self, Pixel, Shade};
use rusttype;

pub fn to_256_terminal(chaxels: &[Vec<Chaxel>]) -> String {
    chaxels
        .iter()
        .flat_map(|ref row| row.iter().map(to_256_term).chain(vec!["\n".to_string()]))
        .join("")
}

pub fn to_bitmap(
    chaxels: &[Vec<Chaxel>],
    height: f32,
) -> Result<image::ImageBuffer<image::Rgb<u8>, Vec<u8>>, failure::Error> {
    let scale = rusttype::Scale {
        x: height,
        y: height,
    };
    let font_data = include_bytes!("/System/Library/Fonts/Menlo.ttc");
    let collection = rusttype::FontCollection::from_bytes(font_data as &[u8])?;
    let font = collection.font_at(0)?;
    let metrics = font.v_metrics(scale);
    let offset = rusttype::point(0.0, metrics.ascent);
    // Height of each line, including any gaps. i.e., the distance between the
    // top of one line and the top of the next.
    let line_height = metrics.ascent - metrics.descent;

    let glyphs: Vec<rusttype::PositionedGlyph> = font
        .layout(&Chaxel::vec_to_string(&chaxels[0]), scale, offset)
        .collect();
    let width = glyphs
        .iter()
        .rev()
        .map(|g| g.position().x as f32 + g.unpositioned().h_metrics().advance_width)
        .next()
        .unwrap_or(0.0);

    let mut image = image::ImageBuffer::new(
        width.ceil() as u32,
        line_height as u32 * chaxels.len() as u32,
    );

    for (row_num, row) in chaxels.iter().enumerate() {
        let row_offset = line_height * row_num as f32;
        let glyphs: Vec<rusttype::PositionedGlyph> = font
            .layout(&Chaxel::vec_to_string(&row), scale, offset)
            .collect();
        for (index, g) in glyphs.iter().enumerate() {
            if let Some(bb) = g.pixel_bounding_box() {
                g.draw(|x, y, v| {
                    let color: palette::Hsv = row[index].fg;
                    let color: palette::Srgb = color.darken((1.0 - v) * color.value).into();
                    let x = x as i32 + bb.min.x;
                    let y = y as i32 + bb.min.y + row_offset as i32;
                    // There's still a possibility that the glyph clips the boundaries of the bitmap
                    if x >= 0 && x < image.width() as i32 && y >= 0 && y < image.height() as i32 {
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

    Ok(image)
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
