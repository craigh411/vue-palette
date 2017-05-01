<template>
    <div class="color-picker">
        <div ref="main-picker" class="main-picker" @mousemove="changeColor($event, ctx1)" @click="changeColor($event, ctx1)" @mousedown="dragging = true" @mouseup="dragging = false">

            <div class="pointer" :style="getSelectPosition"></div>

            <canvas ref="block" height="150" width="150"></canvas>
        </div>
        <color-slider></color-slider>

        <canvas ref="strip" height="150" width="30" @mousemove="changeColor($event, ctx2, true)" @click="changeColor($event, ctx2, true)" @mousedown="dragging = true" @mouseup="dragging = false"></canvas>
        Hex:
        <input :value="hex" />
        <div class="rgb">
            R:
            <input :value="rgb[1]" @input="changeRgb($event, 'r')" size="2" /> G:
            <input :value="rgb[2]" @input="changeRgb($event, 'g')" size="2" /> B:
            <input :value="rgb[3]" @input="changeRgb($event, 'b')" size="2" />
        </div>
        {{dragging}}
    </div>

</template>

</template>

<script type="text/javascript">
import debounce from 'lodash.debounce';
import ColorSlider from './ColorSlider.vue'
export default {
    components: {
      ColorSlider
    },
    created() {
        this.color = this.startColor;
    },
    mounted() {
        this.buildColorStrip();
        this.buildColorBlock();
        this.getClosestMatch();
    },
    props: {
        startColor: {
            type: String,
            default: 'rgba(10, 186, 181, 1)'
        }
    },
    model: {
        event: 'select',
        value: 'color'
    },
    methods: {
        buildColorStrip() {
            var colorStrip = this.$refs.strip;
            this.ctx2 = colorStrip.getContext('2d');
            this.ctx2.rect(0, 0, 30, 150);
            var grd1 = this.ctx2.createLinearGradient(0, 0, 0, 150);
            grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
            grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
            grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
            grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
            grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
            grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
            grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
            this.ctx2.fillStyle = grd1;
            this.ctx2.fill();
        },
        buildColorBlock() {
            var colorBlock = this.$refs.block;
            this.ctx1 = colorBlock.getContext('2d');
            this.ctx1.rect(0, 0, 150, 150);
            this.fillGradient();
        },
        fillGradient() {
            this.ctx1.fillStyle = this.color;
            this.ctx1.fillRect(0, 0, 150, 150);
            var grdWhite = this.ctx2.createLinearGradient(0, 0, 150, 0);
            grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
            grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
            this.ctx1.fillStyle = grdWhite;
            this.ctx1.fillRect(0, 0, 150, 150);
            var grdBlack = this.ctx2.createLinearGradient(0, 0, 0, 150);
            grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
            grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
            this.ctx1.fillStyle = grdBlack;
            this.ctx1.fillRect(0, 0, 150, 150);
        },
        changeColor(e, ctx, fill = false) {
            if (this.dragging || e.type === "click") {
                let x = e.offsetX;
                let y = e.offsetY;
                let imageData = ctx.getImageData(x, y, 1, 1).data;
                this.color = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
                if (fill) {
                    this.fillGradient();
                }
                let db = debounce(() => {
                    console.log('debounce');
                    this.selectPosition = {
                        x: x,
                        y: y
                    }
                }, 150);
                db();
            }
        },
        logit() {
        },
        changeRgb(e, type) {
            let color = e.target.value;
            if (color && !isNaN(color)) {
                color = parseInt(color);
                color = Math.min(255, parseInt(color))
                color = Math.max(0, color);
                let rgb = this.rgb;
                console.log(rgb);
                switch (type) {
                    case 'r':
                        rgb[1] = color;
                        break;
                    case 'g':
                        rgb[2] = color;
                        break;
                    case 'b':
                        rgb[3] = color;
                        break;
                }
                this.color = "rgba(" + rgb[1] + "," + rgb[2] + "," + rgb[3] + ",1)";
            }
        },
        getClosestMatch() {
            let x = 1;
            let y = 0;
            let imageData = this.ctx2.getImageData(x, y, 1, 1).data;
            console.log(imageData);
            let rgb = this.rgb;
            let position = 0;
            let min = 1000;
            for (let i = 0; i <= 150; i++) {
                let data = this.ctx2.getImageData(1, i, 1, 1).data;
                let diff = Math.sqrt(Math.pow(rgb[1] - data[0], 2) + Math.pow(rgb[2] - data[1], 2) + Math.pow(rgb[3] - data[2], 2));
                if (diff < min) {
                    min = diff;
                    position = i;
                }
            }
            imageData = this.ctx2.getImageData(1, position, 1, 1).data;
            let oldColor = this.color;
            this.color = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
            this.fillGradient();
            this.ctx2.rect(0, position, 30, 3);
            this.ctx2.stroke();
            this.findColor(oldColor);
        },
        findColor(color) {
            this.color = color;
            let rgb = this.rgb;
            let position = {
                x: 0,
                y: 0
            };
            let min = 1000;
            for (let i = 0; i <= 150; i++) {
                for (let j = 0; j <= 150; j++) {
                    let data = this.ctx1.getImageData(i, j, 1, 1).data;
                    let diff = Math.sqrt(Math.pow(rgb[1] - data[0], 2) + Math.pow(rgb[2] - data[1], 2) + Math.pow(rgb[3] - data[2], 2));
                    if (diff < min) {
                        min = diff;
                        position = {
                            x: i,
                            y: j
                        };
                    }
                }
            }
            this.ctx1.beginPath();
            this.ctx1.arc(position.x, position.y, 3, 0, 2 * Math.PI);
            this.ctx1.stroke();
        }
    },
    computed: {
        hex() {
            let rgb = this.color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgb && rgb.length === 4) ? "#" +
                ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
        },
        rgb: {
            set(val) {
                console.log(val);
                this.color = val;
            },
            get() {
                return this.color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i)
            }
        },
        getSelectPosition() {
            return "top:" + this.selectPosition.y + "px;left:" + this.selectPosition.x + "px";
        }
    },
    watch: {
        color(val) {
            this.$emit('select', this.hex, this.color);
        }
    },
    data() {
        return {
            selectPosition: {
                x: 50,
                y: 50
            },
            x: 0,
            y: 0,
            dragging: false,
            color: 'rgba(255, 0, 0, 1)',
            ctx1: null,
            ctx2: null
        }
    }
}
</script>

<style scoped>
.color-picker {
    padding: 5px;
    background: #fff;
    border: 1px solid #999;
    width: 185px;
    position: relative;
}

.main-picker {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    cursor: pointer;
}

.pointer {
    position: absolute;
    width: 10px;
    height: 10px;
    border: 1px solid #fff;
    border-radius: 10px;
}

.rgb {
    margin-top: 10px;
}

.color-picker > canvas {
    cursor: pointer;
}
</style>
