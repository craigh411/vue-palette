<template>
    <div ref="sliderContainer" tabindex="0" class="slider-container" @click="changeColor" @mousedown="dragging = true" @mouseover="focus(true)" @mouseout="focus(false)" @keydown="moveSlider">
        <canvas ref="slider" height="150" width="30"></canvas>
        <div class="pointer" :style="{top: pointerPosition}" @mousedown="dragging = true"></div>
    </div>
</template>

<script type="text/javascript">
import ColorCanvas from './mixins/ColorCanvas';
import Color from './classes/Color';
export default {
    mixins: [ColorCanvas],
    mounted() {
        this.top = this.$refs.sliderContainer.getBoundingClientRect().top;
        document.addEventListener('mousemove', e => {
            if (this.dragging) {
                this.changeColor(e);
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
            this.$emit('loaded', this.sliderColors);
        },
        changeColor(e) {
            if (this.dragging || e.type === "click") {
                let y = e.clientY - this.top;
                this.setPointerPosition(y, e.type);
                this.setColor(this.getColorAt(1, this.pointerPosition));
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
                this.setColor(this.getColorAt(1, this.pointerPosition));
                this.store.updateSlider(this.hex);
            }
        },
        focus(doFocus) {
            if (doFocus) {
                this.$refs.sliderContainer.focus();
            } else {
                this.$refs.sliderContainer.blur();
            }
        },
        moveSliderToColor(color) {
            this.setColor(color);
            let coords = this.findColor(this.rgbValues, 1, 1, 0, 149);
            this.setPointerPosition(coords.y);
            this.setColor(this.getColorAt(coords.x, coords.y))
            this.store.updateSlider(this.hex);
        }
    },
    computed: {
        sliderColors() {
            let colors = [];
            for (let i = 0; i < 150; i++) {
                colors[i] = this.getColorAt(1, i);
            }
            return colors;
        },
        sliderColor() {
            return this.store.slider;
        }
    },
    watch: {
        color() {
            if (this.color) {
                this.store.updateSlider(this.hex);
            }
        },
        sliderColor(val) {
            if (val) {
                this.setColor(val);
                let coords = this.findColor(this.hex, 1, 1, 0, 149);
                this.setPointerPosition(coords.y);
            }
        }
    },
    data() {
        return {
            dragging: false,
            keyDown: false,
            pointerPosition: 0,
            top: 0,
            auto: false // whether or not the slider position was calculated automatically
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
    width: 30px;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    float: left;
}

.slider-container:focus {
    outline: none;
}
</style>
