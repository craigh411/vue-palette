export default {
    created() {
            document.addEventListener('mouseup', () => {
                this.dragging = false;
            });
        },
        methods: {
            getColorAt(x, y) {
                let imageData = this.ctx.getImageData(x, y, 1, 1).data;
                return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
            },
            findColor(rgb, fromX, toX, fromY, toY) {
                let position = {
                    x: 0,
                    y: 0
                };
                let min = null;
                for (let i = fromX; i <= toX; i++) {
                    for (let j = fromY; j <= toY; j++) {
                        let data = this.ctx.getImageData(i, j, 1, 1).data;
                        // Return the difference between the canvas color and the search color
                        let diff = Math.sqrt(Math.pow(rgb[0] - data[0], 2) + Math.pow(rgb[1] - data[1], 2) + Math.pow(rgb[2] - data[2], 2));
                        if (diff < min || !min) {
                            min = diff;
                            position = { x: i, y: j };
                        }
                    }
                }

                return position;
            }
        },
        data() {
            return {
                ctx: null,
                dragging: false
            }
        }
}
