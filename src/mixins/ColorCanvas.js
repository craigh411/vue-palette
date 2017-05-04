import ColorFactory from '../classes/ColorFactory';

export default {
    props: {
        startColor: {
            default: "#ff0000",
            type: String
        }
    },
    created() {
        document.addEventListener('mouseup', () => {
            this.dragging = false;
        });
        this.color = ColorFactory.create(this.startColor);
    },
    computed: {
        hex() {
            return this.color.hex();
        },
        rgbValues() {
            return this.color.rgbArray();
        },
        rgb() {
            return this.color.rgb();
        }
    },
    methods: {
        getColorAt(x, y) {
            let imageData = this.ctx.getImageData(x, y, 1, 1).data;
            return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
        },
        findColor(rgb, fromX, toX, fromY, toY, maxLuma = 255) {
            let position = {
                x: 0,
                y: 0
            };
            let min = null;
            for (let i = fromX; i <= toX; i++) {
                for (let j = fromY; j <= toY; j++) {
                    let data = this.ctx.getImageData(i, j, 1, 1).data;
                    let compColor = ColorFactory.create([data[0],data[1],data[2]]);
                    let diff = this.color.compare(compColor);

                    if (diff < min || !min && compColor.brightness() <= maxLuma) {
                        min = diff;
                        position = { x: i, y: j };
                    }
                }
            }

            return position;
        },
        setColor(color) {
            this.color = ColorFactory.create(color);
        }
    },
    data() {
        return {
            color: '',
            ctx: null,
            dragging: false
        }
    }
}
