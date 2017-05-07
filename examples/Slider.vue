<template>
     <div class="color-picker">
        <div class="picker">
        <color-selector :spectrum="slider" :select-color="select" @color-selected="setColor"></color-selector>
        <color-slider @loaded="setSliderColors"></color-slider>
            <div class="hex">
                <input :class="{error : hexError}" @blur="updateSlider($event.target.value)" :value="color" placeholder="Hex" />
            </div>
            <div class="rgb">
                <div class="item">
                    <input  placeholder="R" />
                </div>
                <div class="item">
                    <input  placeholder="G" />
                </div>
                <div class="item">
                    <input  placeholder="B" />
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
import ColorSlider from '../src/ColorSlider.vue';
import ColorSelector from '../src/ColorSelector.vue';
import Color from '../src/classes/Color';
import ColorFactory from '../src/classes/ColorFactory'
import bus from '../src/EventBus.js';
export default {
    components: {
        ColorSlider,
        ColorSelector
    },
    provide: {
        'bus': bus
    },
    computed: {
        slider() {
            return bus.slider;
        }
    },
    methods: {
        setSliderColors(colors) {
            this.sliderColors = colors;
        },
        updateSlider(hex) {
            if (Color.isHex(hex)) {
                bus.updateSlider(this.getClosestSliderMatch(hex));
                this.select = null;
                this.$nextTick(() => {
                    this.select = Color.normaliseHex(hex);
                });
            }
        },
        getClosestSliderMatch(target) {
            let difference = [];
            let targetColor = ColorFactory.create(target);
            target = Color.lab(targetColor.rgbArray());
            if (targetColor.brightness() < 100) {
                target = ColorFactory.create(Color.RgbToHex(Color.lighten(targetColor.rgbArray(), 50)));
                target = Color.lab(target.rgbArray())
            }
            for (let i = 0; i < this.sliderColors.length; i++) {
                let color = Color.lab(this.sliderColors[i]);
                difference[i] = {
                    color: this.sliderColors[i],
                    diff: Color.compare(color, target)
                };
            }
            difference.sort((a, b) => {
                return a.diff - b.diff;
            });
            return Color.RgbToHex(difference[0].color);
        },
        setColor(color, hex) {
            this.color = hex;
        }
    },
    data() {
        return {
            sliderColors: [],
            color: '#ff0000',
            select: '#ff0000',
            hexError:false
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
    overflow:auto;
}

.error {
    border: 1px solid #ff9391 !important;
    background: #feebfc;
}
</style>