// the maths for this came from
// https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
// the conceptual solution came from
// https://stackoverflow.com/questions/52879235/determine-color-lightness-via-rgb
function getContrastingHex(rgb)
{
    const [_all, r, g, b] = rgb.match(/(..)(..)(..)/);
    const l = (0.2126 * parseInt('0x'+r) + 0.7152 * parseInt('0x'+g) + 0.0722 * parseInt('0x'+b))/255;

    if(l > 0.5)
    {
        return '#000';
    }
    return '#fff';
}

export default getContrastingHex;