<template>
    <div class="picker-container" v-show="show">
        <div class="color-picker" @mouseout="$emit('editing', false)" @mouseover="$emit('editing',true)">

            <div class="picker">

                <color-selector :spectrum="slider" :select-color="select" @color-selected="setColor"></color-selector>
                <color-slider @loaded="setSliderColors"></color-slider>

                <div class="hex">
                    <input :class="{error : hexError}" @blur="updateColor($event.target.value)" :value="hex" placeholder="Hex" @paste="updateColor($event.target.value)" ref="hex" @select="allowSelect" />
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
    </div>
</template>

<script type="text/javascript">
import ColorSlider from "./ColorSlider.vue";
import ColorSelector from "./ColorSelector.vue";
import Color from "./classes/Color";
import ColorFactory from "./classes/ColorFactory";
import Vue from "vue";
const bus = new Vue({});
export default {
    components: {
        ColorSlider,
        ColorSelector
    },
    provide: {
        "bus": bus
    },
    inject: ["store"],
    props: {
        selectColor: {
            default: "#ddedee",
            type: String
        },
        show: {
            default: false,
            type: Boolean
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.updateColor(this.selectColor);
        });
    },
    computed: {
        slider() {
            return this.store.slider;
        },
        hex() {
            return (this.color) ? this.color.hex() : "";
        },
        rgb() {
            return (this.color) ? this.color.rgb() : "";
        },
        rgbVals() {
            return (this.rgb) ? this.rgb.getRgbValues() : [0, 0, 0];
        },
        hsv() {
            return (this.color) ? this.color.hsv().getHsv() : {
                h: 1,
                s: 1,
                v: 1
            };
        },
        dragging() {
            return this.store.dragging;
        }
    },
    methods: {
        setSliderColors(colors) {
            this.sliderColors = colors;
        },
        allowSelect() {
            return false;
        },
        updateColor(hex) {
            if (Color.isHex(hex) && hex !== this.hex) {
                let color = ColorFactory.create(hex);
                color = color.hsv().getHsv();
                let sliderColor = Object.assign(color, {
                    s: 100,
                    v: 100
                });
                console.log(sliderColor);
                sliderColor = Color.HSVtoRGB(sliderColor);
                sliderColor = ColorFactory.create(sliderColor);
                this.store.updateSlider(sliderColor.hex());

                this.select = null;
                this.$nextTick(() => {
                    this.select = Color.normaliseHex(hex);
                    this.color = ColorFactory.create(hex);
                });
            }
        },
        setColor(color, hex) {
            this.color = color;
            this.$emit("color-selected", this.hex, color);
        },
        setRGB(index, value) {
            const rgb = this.rgbVals;
            rgb[index] = Math.max(0, Math.min(255, parseInt(value)));
            const hex = Color.RgbToHex(rgb);
            this.updateColor(hex);
        }
    },
    watch: {
        show(show) {
            if (show) {
                bus.$emit("reflow");
            }
        }
    },
    data() {
        return {
            sliderColors: [],
            color: null,
            select: null,
            hexError: false
        };
    }
};
</script>

<style scoped>
.picker-container {
    position: absolute;
    z-index: 999;
}

.selection-area {
    z-index: 1001;
}

.picker {
    float: left;
    clear: both;
    padding: 5px;
}

.hex {
    float: left;
    clear: both;
    margin-top: 5px;
}

.color-picker input {
    font-family: tahoma;
    border-radius: 2px;
    border: 1px solid #cfcfcf;
    position: relative;
}

.hex > input {
    width: 150px;
    z-index: 999;
}

.rgb {
    float: left;
    clear: both;
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
    font-family: tahoma;
    overflow: auto;
}

.error {
    border: 1px solid #ff9391 !important;
    background: #feebfc;
}
</style>
