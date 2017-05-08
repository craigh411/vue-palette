<template>
    <div class="color-picker">
        <div class="picker">
            <color-selector :spectrum="slider" :select-color="select" @color-selected="setColor"></color-selector>
            <color-slider @loaded="setSliderColors"></color-slider>
            <div class="hex">
                <input :class="{error : hexError}" @blur="updateColor($event.target.value)" :value="hex" placeholder="Hex" @paste="updateColor($event.target.value)" />
            </div>
            <div class="rgb">
                <div class="item">
                    <input :value="rgbVals[0]" @blur="setRGB(0, $event.target.value)" placeholder="R" />
                </div>
                <div class="item">
                    <input :value="rgbVals[1]" @blur="setRGB(1, $event.target.value)" placeholder="G" />
                </div>
                <div class="item">
                    <input :value="rgbVals[2]" @blur="setRGB(2, $event.target.value)" placeholder="B" />
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
import ColorSlider from './ColorSlider.vue';
import ColorSelector from './ColorSelector.vue';
import Color from './classes/Color';
import ColorFactory from './classes/ColorFactory'
import store from './Store.js';
export default {
    components: {
        ColorSlider,
        ColorSelector
    },
    provide: {
        'store': store
    },
    props: {
        selectColor: {
            default: "#ddedee",
            type: String
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.updateColor(this.selectColor);
        });
    },
    computed: {
        slider() {
            return store.slider;
        },
        hex() {
            return (this.color) ? this.color.hex() : "";
        },
        rgb() {
            return (this.color) ? this.color.rgb() : "";
        },
        rgbVals() {
            return (this.color) ? this.color.rgbArray() : [0, 0, 0];
        },
        hsv() {
            return (this.color) ? this.color.hsv() : {
                h: 1,
                s: 1,
                v: 1
            };
        }
    },
    methods: {
        setSliderColors(colors) {
            this.sliderColors = colors;
        },
        updateColor(hex) {
            if (Color.isHex(hex) && hex !== this.hex) {
                let color = ColorFactory.create(hex);
                color = color.hsv();
                let sliderColor = Object.assign(color, {
                    s: 100,
                    v: 100
                })
                sliderColor = Color.HSVtoRGB(sliderColor);
                sliderColor = ColorFactory.create(sliderColor);
                store.updateSlider(sliderColor.hex());
                this.select = null;
                this.$nextTick(() => {
                    this.select = Color.normaliseHex(hex);
                    this.color = ColorFactory.create(hex);
                });
            }
        },
        setColor(color, hex) {
            this.color = color;
            this.$emit('color-selected', this.hex, color);
        },
        setRGB(index, value) {
            let rgb = this.rgbVals;
            rgb[index] = Math.max(0, Math.min(255, parseInt(value)));
            let hex = Color.RgbToHex(rgb);
            this.updateColor(hex);
        }
    },
    data() {
        return {
            sliderColors: [],
            color: null,
            select: null,
            hexError: false
        }
    }
}
</script>

<style scoped>
.picker {
    float: left;
    clear: both;
    width: 200px;
}

.hex {
    float: left;
    clear: both;
    margin-top: 5px;
}

.color-picker input {
    font-family: tahoma;
    padding: 3px;
    border-radius: 2px;
    border: 1px solid #cfcfcf;
}

.hex > input {
    width: 150px;
}

.rgb > .item {
    float: left;
    width: 50px;
    font-size: 0.8em;
    padding: 5px;
    padding-left: 0px;
}

.rgb > .item > input {
    width: 40px;
    float: left;
}

.color-picker {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    background: #fff;
    border: 1px solid #999;
    padding: 7px;
    max-width: 193px;
    font-family: tahoma;
    overflow: auto;
}

.error {
    border: 1px solid #ff9391 !important;
    background: #feebfc;
}
</style>
