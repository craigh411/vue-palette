<template>
    <div ref="sliderContainer" tabindex="0" class="slider-container" @mousemove="changeColor" @click="changeColor" @mousedown="dragging = true" @mouseover="focus(true)" @mouseout="focus(false)" @keydown="moveSlider">
        <canvas ref="slider" height="150" width="30"></canvas>
        <div class="pointer" :style="{top: pointerPosition}" @mousedown="dragging = true"></div>
    </div>
</template>

<script type="text/javascript">
import ColorFormatter from './mixins/ColorFormatter';
import CanvasHelper from './mixins/CanvasHelper';
export default {
    mixins: [ColorFormatter, CanvasHelper],
    props: {
        startColor: {
            default: 'rgba(255,0,0, 1)',
            type: String
        }
    },
    created() {
        if(this.isHex(this.startColor)){
          this.color = this.hexToRgb(this.startColor);
        }else{
          this.color =  this.startColor;          
        }


    },
    mounted() {
        this.top = this.$refs.sliderContainer.getBoundingClientRect().top;
        document.addEventListener('mouseup', () => {
            this.dragging = false;
        });
        document.addEventListener('mousemove', e => {
            if (this.dragging) {
                if (e.clientY < this.top) {
                    this.setPointerPosition(0)
                }
            }
        });
        this.build();
    },
    methods: {
        build() {
            this.ctx = this.$refs.slider.getContext('2d');
            this.ctx.rect(0, 0, 30, 150);
            var grd = this.ctx.createLinearGradient(0, 0, 0, 150);
            grd.addColorStop(0, 'rgba(255, 0, 0, 1)');
            grd.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
            grd.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
            grd.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
            grd.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
            grd.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
            grd.addColorStop(1, 'rgba(255, 0, 0, 1)');
            this.ctx.fillStyle = grd;
            this.ctx.fill();
            this.setPointerPosition(this.findColor(this.rgbValues, 1, 1, 0, 150).y);
        },
        changeColor(e) {
            if (this.dragging || e.type === "click") {
                let y = e.clientY - this.top;
                this.setPointerPosition(y, e.type);
                this.color = this.getColorAt(1, this.pointerPosition);
            }
        },
        setPointerPosition(y, type = null) {
            this.pointerPosition = Math.max(0, Math.min(149, y));
        },
        moveSlider(e) {
            if (e.code === "ArrowUp" || e.code === "ArrowDown") {
                e.preventDefault();
                let moveOffset = (e.code === "ArrowUp") ? -1 : 1;
                let newPosition = this.pointerPosition + moveOffset;
                this.setPointerPosition(newPosition, "click");
                this.color = this.getColorAt(1, this.pointerPosition)
            }
        },
        focus(doFocus) {
            if (doFocus) {
                this.$refs.sliderContainer.focus();
            } else {
                this.$refs.sliderContainer.blur();
            }
        }
    },
    watch: {
        color() {
            this.$emit('color-selected', this.color, this.hex, this.rgbValues);
        }
    },
    data() {
        return {
            dragging: false,
            keyDown: false,
            pointerPosition: 0,
            top: 0
        }
    }
}
</script>

<style scoped>
canvas {
    cursor: pointer;
    border: 1px solid #999;
}

.pointer {
    cursor: pointer;
    width: 36px;
    height: 5px;
    border: 1px solid #999;
    background: #fff;
    margin-left: -3;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.8;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}

.slider-container {
    position: relative;
    display: inline-flex;
}

.slider-container:focus {
    outline: none;
}
</style>