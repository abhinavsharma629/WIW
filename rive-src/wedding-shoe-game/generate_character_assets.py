from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).parent
ASSETS = ROOT / "assets"
SCALE = 3


def canvas(width: int, height: int) -> Image.Image:
    return Image.new("RGBA", (width * SCALE, height * SCALE), (0, 0, 0, 0))


def points(values: list[tuple[int, int]]) -> list[tuple[int, int]]:
    return [(x * SCALE, y * SCALE) for x, y in values]


def gradient_mask(
    size: tuple[int, int],
    top: tuple[int, int, int, int],
    bottom: tuple[int, int, int, int],
) -> Image.Image:
    width, height = size
    image = Image.new("RGBA", size)
    pixels = image.load()
    for y in range(height):
        amount = y / max(height - 1, 1)
        color = tuple(
            round(top[channel] * (1 - amount) + bottom[channel] * amount)
            for channel in range(4)
        )
        for x in range(width):
            pixels[x, y] = color
    return image


def paste_masked(
    target: Image.Image,
    layer: Image.Image,
    mask: Image.Image,
) -> None:
    target.alpha_composite(Image.composite(layer, Image.new("RGBA", layer.size), mask))


def add_shadow(image: Image.Image, mask: Image.Image, offset=(5, 8), blur=10) -> None:
    shadow = Image.new("RGBA", image.size)
    shifted = Image.new("L", image.size)
    shifted.paste(mask, (offset[0] * SCALE, offset[1] * SCALE))
    shifted = shifted.filter(ImageFilter.GaussianBlur(blur * SCALE))
    color = Image.new("RGBA", image.size, (58, 39, 40, 80))
    shadow.alpha_composite(Image.composite(color, Image.new("RGBA", image.size), shifted))
    image.alpha_composite(shadow)


def save(image: Image.Image, name: str) -> None:
    ASSETS.mkdir(exist_ok=True)
    image.resize(
        (image.width // SCALE, image.height // SCALE),
        Image.Resampling.LANCZOS,
    ).save(ASSETS / name, optimize=True)


def bride_body() -> None:
    image = canvas(270, 430)
    draw = ImageDraw.Draw(image)

    skirt_mask = Image.new("L", image.size)
    skirt_draw = ImageDraw.Draw(skirt_mask)
    skirt_draw.polygon(points([(86, 220), (176, 220), (241, 421), (27, 421)]), fill=255)
    add_shadow(image, skirt_mask, offset=(5, 5), blur=8)
    skirt = gradient_mask(image.size, (245, 214, 214, 255), (183, 113, 128, 255))
    paste_masked(image, skirt, skirt_mask)
    draw.line(points([(28, 418), (240, 418)]), fill=(202, 165, 104, 255), width=5 * SCALE)

    for y, radius in [(270, 5), (318, 4), (364, 5)]:
        for x in range(58, 218, 35):
            draw.ellipse(
                (x * SCALE, y * SCALE, (x + radius) * SCALE, (y + radius) * SCALE),
                outline=(221, 189, 131, 210),
                width=2 * SCALE,
            )

    blouse_mask = Image.new("L", image.size)
    blouse_draw = ImageDraw.Draw(blouse_mask)
    blouse_draw.rounded_rectangle(
        (79 * SCALE, 145 * SCALE, 184 * SCALE, 250 * SCALE),
        radius=29 * SCALE,
        fill=255,
    )
    blouse = gradient_mask(image.size, (250, 226, 224, 255), (205, 143, 152, 255))
    paste_masked(image, blouse, blouse_mask)
    draw.line(points([(88, 231), (174, 231)]), fill=(205, 169, 105, 255), width=4 * SCALE)

    draw.rounded_rectangle(
        (112 * SCALE, 118 * SCALE, 142 * SCALE, 166 * SCALE),
        radius=12 * SCALE,
        fill=(177, 111, 82, 255),
    )

    draw.ellipse(
        (71 * SCALE, 39 * SCALE, 164 * SCALE, 151 * SCALE),
        fill=(53, 34, 33, 255),
    )
    draw.ellipse(
        (77 * SCALE, 50 * SCALE, 154 * SCALE, 148 * SCALE),
        fill=(183, 116, 84, 255),
    )
    draw.polygon(
        points([(76, 82), (60, 94), (78, 99)]),
        fill=(183, 116, 84, 255),
    )
    draw.ellipse(
        (91 * SCALE, 78 * SCALE, 98 * SCALE, 87 * SCALE),
        fill=(39, 28, 27, 255),
    )
    draw.arc(
        (70 * SCALE, 92 * SCALE, 104 * SCALE, 126 * SCALE),
        start=38,
        end=112,
        fill=(119, 54, 68, 255),
        width=3 * SCALE,
    )
    draw.ellipse(
        (124 * SCALE, 48 * SCALE, 172 * SCALE, 103 * SCALE),
        fill=(49, 31, 31, 255),
    )
    draw.ellipse(
        (140 * SCALE, 95 * SCALE, 176 * SCALE, 144 * SCALE),
        fill=(49, 31, 31, 255),
    )
    draw.ellipse(
        (91 * SCALE, 60 * SCALE, 104 * SCALE, 73 * SCALE),
        fill=(218, 184, 125, 255),
    )
    draw.ellipse(
        (65 * SCALE, 103 * SCALE, 72 * SCALE, 114 * SCALE),
        fill=(213, 166, 112, 255),
    )

    draw.polygon(
        points([(172, 152), (213, 177), (193, 318), (160, 250)]),
        fill=(239, 205, 208, 150),
    )
    draw.line(points([(177, 154), (194, 317)]), fill=(207, 167, 104, 220), width=3 * SCALE)
    save(image, "bride-body.png")


def groom_body() -> None:
    image = canvas(260, 430)
    draw = ImageDraw.Draw(image)

    draw.rounded_rectangle(
        (65 * SCALE, 314 * SCALE, 111 * SCALE, 430 * SCALE),
        radius=19 * SCALE,
        fill=(41, 48, 64, 255),
    )
    draw.rounded_rectangle(
        (137 * SCALE, 304 * SCALE, 185 * SCALE, 430 * SCALE),
        radius=19 * SCALE,
        fill=(35, 42, 57, 255),
    )
    draw.rounded_rectangle(
        (65 * SCALE, 146 * SCALE, 190 * SCALE, 321 * SCALE),
        radius=30 * SCALE,
        fill=(39, 54, 81, 255),
        outline=(75, 91, 121, 255),
        width=3 * SCALE,
    )
    draw.polygon(
        points([(98, 145), (128, 215), (158, 145)]),
        fill=(245, 242, 236, 255),
    )
    draw.polygon(
        points([(76, 155), (113, 225), (91, 303), (62, 230)]),
        fill=(31, 43, 66, 255),
    )
    draw.polygon(
        points([(178, 155), (143, 225), (163, 303), (195, 228)]),
        fill=(29, 40, 62, 255),
    )
    draw.polygon(
        points([(112, 165), (128, 176), (111, 188), (128, 181), (145, 188), (128, 176), (145, 165), (128, 172)]),
        fill=(58, 45, 54, 255),
    )
    draw.rounded_rectangle(
        (114 * SCALE, 117 * SCALE, 145 * SCALE, 163 * SCALE),
        radius=12 * SCALE,
        fill=(178, 111, 81, 255),
    )

    draw.ellipse(
        (83 * SCALE, 38 * SCALE, 181 * SCALE, 150 * SCALE),
        fill=(46, 32, 29, 255),
    )
    draw.ellipse(
        (91 * SCALE, 53 * SCALE, 171 * SCALE, 149 * SCALE),
        fill=(183, 116, 84, 255),
    )
    draw.polygon(
        points([(171, 83), (191, 95), (170, 101)]),
        fill=(183, 116, 84, 255),
    )
    draw.ellipse(
        (148 * SCALE, 78 * SCALE, 155 * SCALE, 87 * SCALE),
        fill=(39, 28, 27, 255),
    )
    draw.arc(
        (144 * SCALE, 92 * SCALE, 181 * SCALE, 126 * SCALE),
        start=70,
        end=139,
        fill=(111, 58, 55, 255),
        width=3 * SCALE,
    )
    draw.polygon(
        points([(101, 56), (120, 34), (165, 43), (183, 64), (153, 57)]),
        fill=(43, 29, 27, 255),
    )
    draw.polygon(
        points([(104, 120), (127, 142), (156, 121), (151, 146), (124, 154), (102, 137)]),
        fill=(72, 45, 39, 165),
    )
    save(image, "groom-body.png")


def arm_asset(name: str, color_top, color_bottom, width: int, height: int, hand=False) -> None:
    image = canvas(width, height)
    mask = Image.new("L", image.size)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.rounded_rectangle(
        (8 * SCALE, 2 * SCALE, (width - 8) * SCALE, (height - 4) * SCALE),
        radius=(width // 3) * SCALE,
        fill=255,
    )
    layer = gradient_mask(image.size, color_top, color_bottom)
    paste_masked(image, layer, mask)
    draw = ImageDraw.Draw(image)
    draw.line(
        points([(width // 3, 8), (width // 3, height - 10)]),
        fill=(255, 255, 255, 45),
        width=3 * SCALE,
    )
    if hand:
        draw.ellipse(
            (
                3 * SCALE,
                (height - 30) * SCALE,
                (width - 3) * SCALE,
                height * SCALE,
            ),
            fill=(183, 116, 84, 255),
        )
    save(image, name)


def footwear() -> None:
    bride = canvas(82, 48)
    draw = ImageDraw.Draw(bride)
    draw.polygon(
        points([(8, 12), (49, 7), (75, 24), (62, 39), (11, 37)]),
        fill=(226, 199, 183, 255),
        outline=(173, 126, 112, 255),
    )
    draw.line(points([(51, 8), (60, 1)]), fill=(173, 126, 112, 255), width=4 * SCALE)
    save(bride, "bride-shoe.png")

    groom = canvas(88, 48)
    draw = ImageDraw.Draw(groom)
    draw.polygon(
        points([(5, 10), (51, 6), (82, 26), (72, 41), (8, 37)]),
        fill=(30, 35, 45, 255),
        outline=(88, 94, 107, 255),
    )
    draw.line(points([(13, 16), (57, 13)]), fill=(118, 123, 132, 180), width=2 * SCALE)
    save(groom, "groom-shoe.png")


if __name__ == "__main__":
    bride_body()
    groom_body()
    arm_asset(
        "bride-upper-arm.png",
        (205, 138, 105, 255),
        (166, 94, 70, 255),
        42,
        86,
    )
    arm_asset(
        "bride-forearm-hand.png",
        (205, 138, 105, 255),
        (166, 94, 70, 255),
        42,
        104,
        hand=True,
    )
    arm_asset(
        "groom-upper-arm.png",
        (252, 249, 243, 255),
        (207, 214, 224, 255),
        48,
        88,
    )
    arm_asset(
        "groom-forearm-hand.png",
        (252, 249, 243, 255),
        (207, 214, 224, 255),
        48,
        106,
        hand=True,
    )
    footwear()
