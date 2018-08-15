use ansi_term::Colour;
use itertools::Itertools;
use palette;
use Chaxel;

pub fn to_256_terminal(chaxels: &[Vec<Chaxel>]) -> String {
    chaxels
        .iter()
        .flat_map(|ref row| row.iter().map(to_256_term).chain(vec!["\n".to_string()]))
        .join("")
}

fn to_256_term(chaxel: &Chaxel) -> String {
    Colour::Fixed(to_256_terminal_color(chaxel.fg))
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
