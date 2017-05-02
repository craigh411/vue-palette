export default {
    computed: {
        hex() {
            return "#" +
                ("0" + this.rgbValues[0].toString(16)).slice(-2) +
                ("0" + this.rgbValues[1].toString(16)).slice(-2) +
                ("0" + this.rgbValues[2].toString(16)).slice(-2);
        },
        rgbValues() {
            let rgb = this.color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return [parseInt(rgb[1], 10), parseInt(rgb[2], 10), parseInt(rgb[3], 10)];
        }
    },
    methods: {
        isHex(color) {
            return /^#([A-Fa-f0-9]{3}){1,2}$/.test(color);
        },
        getRgbVals(color){
            let rgb = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return [parseInt(rgb[1], 10), parseInt(rgb[2], 10), parseInt(rgb[3], 10)];
        },
        hexToRgb(hex) {
            if (this.isHex(hex)) {
                let color = hex.substring(1).split('');
                color = (color.length === 3) ? [color[0], color[0], color[1], color[1], color[2], color[2]] : color;
                color = '0x' + color.join('');
                return 'rgba(' + [(color >> 16) & 255, (color >> 8) & 255, color & 255].join(',') + ',1)';
            }
            throw new Error('Invalid Hex Value');
        },
        setColor(color) {
            if (this.isHex(color)) {
                this.color = this.hexToRgb(color);
            } else {
                this.color = color;
            }
        }
    },
    data() {
        return {
            color: '' // Color RGB value
        }
    }
}
