"""
Pure Python QR Code Generator for URL: https://github.com/im-chandanmahapatra/CHAI-WALA
QR Version 4, Error Correction M (33x33 matrix)
"""
from PIL import Image

def get_qr_matrix(text):
    # GF(256) math
    EXP = [0] * 512
    LOG = [0] * 256
    x = 1
    for i in range(255):
        EXP[i] = x
        EXP[i + 255] = x
        LOG[x] = i
        x = (x << 1) ^ (0x11D if (x & 0x80) else 0)

    def gf_mul(a, b):
        if a == 0 or b == 0:
            return 0
        return EXP[LOG[a] + LOG[b]]

    def rs_generator_poly(ec_len):
        poly = [1]
        for i in range(ec_len):
            poly = [gf_mul(p, EXP[i]) for p in poly] + [0]
            for j in range(len(poly) - 1):
                poly[j] ^= [gf_mul(p, 1) for p in [1] if False] or poly[j] # no-op
            # standard poly multiplication: poly = poly * (x + EXP[i])
        # proper poly multiplication:
        poly = [1]
        for i in range(ec_len):
            new_poly = [0] * (len(poly) + 1)
            for j, p in enumerate(poly):
                new_poly[j] ^= gf_mul(p, EXP[i])
                new_poly[j + 1] ^= p
            poly = new_poly
        # poly has degree ec_len, len = ec_len + 1, highest degree term first (coeff of x^ec_len is 1)
        return poly

    def rs_encode(data, ec_len):
        gen = rs_generator_poly(ec_len)
        remainder = list(data) + [0] * ec_len
        for i in range(len(data)):
            coef = remainder[i]
            if coef != 0:
                for j in range(len(gen)):
                    remainder[i + j] ^= gf_mul(gen[j], coef)
        return remainder[len(data):]

    # Data encoding for Version 4-M (64 data codewords: 2 blocks of 32 codewords, 18 EC codewords each)
    # Mode indicator: 0100 (Byte mode)
    bits = [0, 1, 0, 0]
    # Char count: 8 bits for Version 4 Byte mode
    data_bytes = text.encode('iso-8859-1')
    char_count = len(data_bytes)
    for b in format(char_count, '08b'):
        bits.append(int(b))
    for byte in data_bytes:
        for b in format(byte, '08b'):
            bits.append(int(b))
    # Terminator: up to 4 zeros
    term_len = min(4, 64 * 8 - len(bits))
    bits.extend([0] * term_len)
    # Pad to byte boundary
    while len(bits) % 8 != 0:
        bits.append(0)
    # Pad bytes alternating 236 (11101100), 17 (00010001)
    pad_bytes = [236, 17]
    pad_idx = 0
    while len(bits) < 64 * 8:
        for b in format(pad_bytes[pad_idx % 2], '08b'):
            bits.append(int(b))
        pad_idx += 1

    # Convert bits to 64 bytes
    codewords = []
    for i in range(0, len(bits), 8):
        byte_val = int("".join(str(x) for x in bits[i:i+8]), 2)
        codewords.append(byte_val)

    # 2 blocks of 32 data codewords
    block1 = codewords[:32]
    block2 = codewords[32:64]
    ec1 = rs_encode(block1, 18)
    ec2 = rs_encode(block2, 18)

    # Interleave data
    interleaved = []
    for i in range(32):
        interleaved.append(block1[i])
        interleaved.append(block2[i])
    for i in range(18):
        interleaved.append(ec1[i])
        interleaved.append(ec2[i])

    # Convert to bitstream
    all_bits = []
    for cw in interleaved:
        for b in format(cw, '08b'):
            all_bits.append(int(b))
    # Remainder bits for Version 4: 0 bits (V4 has 0 remainder bits)

    # Matrix size for Version 4 = 17 + 4*4 = 33
    size = 33
    mat = [[None] * size for _ in range(size)]
    reserved = [[False] * size for _ in range(size)]

    # 1. Finder patterns at (0,0), (0, size-7), (size-7, 0)
    def place_finder(r0, c0):
        for r in range(7):
            for c in range(7):
                is_black = (r in (0, 6) or c in (0, 6) or (2 <= r <= 4 and 2 <= c <= 4))
                mat[r0 + r][c0 + c] = 1 if is_black else 0
                reserved[r0 + r][c0 + c] = True
        # Separators
        for r in range(-1, 8):
            for c in range(-1, 8):
                rr, cc = r0 + r, c0 + c
                if 0 <= rr < size and 0 <= cc < size:
                    if not reserved[rr][cc]:
                        mat[rr][cc] = 0
                        reserved[rr][cc] = True

    place_finder(0, 0)
    place_finder(0, size - 7)
    place_finder(size - 7, 0)

    # 2. Alignment pattern for Version 4 at (24, 24)
    def place_alignment(r0, c0):
        for r in range(-2, 3):
            for c in range(-2, 3):
                rr, cc = r0 + r, c0 + c
                is_black = (abs(r) == 2 or abs(c) == 2 or (r == 0 and c == 0))
                mat[rr][cc] = 1 if is_black else 0
                reserved[rr][cc] = True

    place_alignment(24, 24)

    # 3. Timing patterns
    for i in range(8, size - 8):
        if not reserved[6][i]:
            mat[6][i] = 1 if (i % 2 == 0) else 0
            reserved[6][i] = True
        if not reserved[i][6]:
            mat[i][6] = 1 if (i % 2 == 0) else 0
            reserved[i][6] = True

    # Dark module at (4 * 4 + 9, 8) = (25, 8) for V4: (size - 8, 8)
    mat[size - 8][8] = 1
    reserved[size - 8][8] = True

    # Reserve format info areas
    # Around top-left: (0..8, 8) and (8, 0..8)
    for c in range(9):
        reserved[8][c] = True
    for r in range(9):
        reserved[r][8] = True
    # Around top-right: (8, size-8 .. size-1)
    for c in range(size - 8, size):
        reserved[8][c] = True
    # Around bottom-left: (size-8 .. size-1, 8)
    for r in range(size - 8, size):
        reserved[r][8] = True

    # 4. Place data bits using zigzag column traversal
    bit_idx = 0
    right = size - 1
    up = True
    while right > 0:
        if right == 6: # skip timing column
            right -= 1
        cols = [right, right - 1]
        row_range = range(size - 1, -1, -1) if up else range(size)
        for r in row_range:
            for c in cols:
                if not reserved[r][c]:
                    if bit_idx < len(all_bits):
                        mat[r][c] = all_bits[bit_idx]
                        bit_idx += 1
                    else:
                        mat[r][c] = 0
        up = not up
        right -= 2

    # 5. Apply Mask 0: (r + c) % 2 == 0
    for r in range(size):
        for c in range(size):
            if not reserved[r][c]:
                if (r + c) % 2 == 0:
                    mat[r][c] ^= 1

    # 6. Format bits for EC Level M (00) and Mask 0 (000) -> 00000
    # Pre-calculated 15-bit format code for M, Mask 0 with BCH(15,5) and mask 101010000010010:
    # 00000 -> BCH code: 0000000000 -> xor with 101010000010010 -> 101010000010010
    format_bits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0]

    # Place format bits
    # Around top-left finder:
    # format_bits[0..5] at (8, 0..5)
    for i in range(6):
        mat[8][i] = format_bits[i]
    mat[8][7] = format_bits[6]
    mat[8][8] = format_bits[7]
    mat[7][8] = format_bits[8]
    for i in range(9, 15):
        mat[14 - i][8] = format_bits[i]

    # Around other finders:
    for i in range(8):
        mat[8][size - 1 - i] = format_bits[i]
    for i in range(7):
        mat[size - 7 + i][8] = format_bits[8 + i]

    return mat

def save_qr_image(matrix, filepath, scale=12, quiet_zone=4):
    size = len(matrix)
    img_size = (size + 2 * quiet_zone) * scale
    img = Image.new('RGB', (img_size, img_size), '#FFFFFF')
    pixels = img.load()

    for r in range(size):
        for c in range(size):
            color = (20, 20, 20) if matrix[r][c] == 1 else (255, 255, 255)
            x0 = (c + quiet_zone) * scale
            y0 = (r + quiet_zone) * scale
            for y in range(y0, y0 + scale):
                for x in range(x0, x0 + scale):
                    pixels[x, y] = color

    img.save(filepath)
    print(f"QR code successfully saved to {filepath} ({img_size}x{img_size})")

if __name__ == "__main__":
    url = "https://github.com/im-chandanmahapatra/CHAI-WALA"
    matrix = get_qr_matrix(url)
    save_qr_image(matrix, "repo_qr.png")

