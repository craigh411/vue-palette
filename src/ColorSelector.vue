<template>
    <div class="selector" @click="changeColor" @mousedown="dragging = true">
        <canvas ref="selector" height="150" width="150"></canvas>
        <div class="pointer" :style="{left:pointerPosition.x, top: pointerPosition.y}" @mousedown="dragging = true"></div>
    </div>
</template>

<script type="text/javascript">
import ColorFormatter from './mixins/ColorFormatter';
import CanvasHelper from './mixins/CanvasHelper';
export default {
    mixins: [ColorFormatter, CanvasHelper],
    props: {
        spectrum: {
            default: 'rgba(255,0,0,1)',
            type: String
        },
        startPosition: {
            default: function() {
                return {
                    x: 10,
                    y: 10
                }
            },
            type: Object
        },
        startColor: {
            default: '#ff0000',
            type: String
        }
    },
    created() {
        this.setColor(this.spectrum);
        this.pointerPosition = this.startPosition;
        document.addEventListener('mousemove', e => {
            if (this.dragging) {
                this.changeColor(e);
            }
        });
    },
    mounted() {
        this.buildSelector();
        this.boundingBox = this.$refs.selector.getBoundingClientRect();
    },
    methods: {
        buildSelector() {
            this.ctx = this.$refs.selector.getContext('2d');
            this.ctx.rect(0, 0, 150, 150);
            this.fillGradient();
        },
        fillGradient() {
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(0, 0, 150, 150);
            var grdWhite = this.ctx.createLinearGradient(0, 0, 150, 0);
            grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
            grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
            this.ctx.fillStyle = grdWhite;
            this.ctx.fillRect(0, 0, 150, 150);
            var grdBlack = this.ctx.createLinearGradient(0, 0, 0, 150);
            grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
            grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
            this.ctx.fillStyle = grdBlack;
            this.ctx.fillRect(0, 0, 150, 150);
            this.color = this.getColorAt(
                this.forceRange(this.pointerPosition.x, 0, 150),
                this.forceRange(this.pointerPosition.y, 0, 150)
            );
        },
        forceRange(val, min, max) {
            return Math.max(min, Math.min(max, val))
        },
        changeColor(e) {
            if (e.type === "click" || this.dragging) {
                let x = this.forceRange(e.clientX - this.boundingBox.left, 0, 149);
                let y = this.forceRange(e.clientY - this.boundingBox.top, 0, 149);
                // Just ensure the correct colors are in the corners as they differ slightly due to gradient
                if (x <= 1 && y <= 1) {
                    this.color = 'rgba(255, 255, 255, 1)';
                } else if (y >= 149) {
                    this.color = 'rgba(0, 0, 0, 1)';
                } else if (x >= 149 && y <= 1) {
                    this.setColor(this.spectrum);
                } else {
                    this.color = this.getColorAt(x, y);
                }
                this.setPointerPosition(x, y);
            }
        },
        setPointerPosition(x, y) {
            this.pointerPosition = {
                y: Math.max(1, Math.min(150, y)) - 4,
                x: Math.max(1, Math.min(150, x) - 3)
            }
        }
    },
    watch: {
        spectrum(val) {
            this.color = val;
            this.fillGradient();
        },
        color() {
            if (this.color) {
                this.$emit('color-selected', this.color, this.hex, this.rgbValues);
            }
        },
        startColor(val) {
            if (val) {
                this.setColor(val);
                let coords = this.findColor(this.rgbValues, 1, 150, 1, 150);
                this.setPointerPosition(coords.x, coords.y);
                this.setColor(val);
            }
        }
    },
    data() {
        return {
            pointerPosition: {},
            boundingBox: null
        }
    }
}
</script>

<style scoped>
/*.selector > canvas {
    cursor: pointer;
}

.selector {
    display: inline-flex;
    position: relative;
    border: 1px solid #999;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}

.pointer {
    cursor: pointer;
    width: 5px;
    height: 5px;
    border-radius: 10px;
    border: 1px solid #fff;
    background: #000;
    margin-left: -3;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.8;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}*/

.pointer {
    cursor: pointer;
    width: 5px;
    height: 5px;
    border-radius: 10px;
    border: 1px solid #fff;
    background: #000;
    margin-left: -3;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.8;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}

.selector > canvas {
    cursor: pointer;
}

.selector {
    width: 150px;
    position: relative;
    border: 1px solid #999;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    margin-right: 7px;
    float: left;
}
</style>
