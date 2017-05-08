<template>
    <div>

        <!-- <color-slider @color-selected="setColor"></color-slider> -->
        <color-picker @color-selected="setColor" select-color="#ffdada"></color-picker>
        <div class="block" :style="{background: hex}">{{hex}}</div>
        <div>rgb: {{rgb}}</div>
        <div>rgb values: {{rgbVals}}</div>
        <div>HSV: {{hsv}}</div>
        <div>HSL: {{hsl}}</div>
        <div>UP Lab: {{upLab}}</div>
        <div>XYZ: {{xyz}}</div>
    </div>
</template>

<script type="text/javascript">
import ColorFactory from '../src/classes/ColorFactory.js';
import ColorPicker from '../src/ColorPicker.vue';
import ColorSlider from '../src/ColorSlider.vue';
export default {
    components: {
        ColorPicker,
        ColorSlider
    },
    created() {
        //let color = ColorFactory.create([255,0,0]);
        //console.log(color.getBrightness())
        // console.log(color.compare(ColorFactory.create([0,0,0])));
    },
    methods: {
        setSliderColor(rgb, hex) {
            this.sliderColor = hex;
        },
        setColor(hex, color) {
            this.color = color;
        }
    },
    computed: {
        hex() {
            return (this.color) ? this.color.hex() : "#ff0000";
        },
        rgb() {
            return (this.color) ? this.color.rgb() : "";
        },
        rgbVals() {
            return (this.color) ? this.color.rgbArray() : [0, 0, 0];
        },
        hsv() {
            return (this.color) ? this.color.hsv() : {
                h: 0,
                s: 0,
                v: 0
            };
        },
        upLab() {
            return (this.color) ? this.color.upLab() : {
                l: 0,
                a: 0,
                b: 0
            };
        },
        xyz() {
            return (this.color) ? this.color.xyz() : {
                x: 0,
                y: 0,
                z: 0
            };
        },
        hsl() {
            return (this.color) ? this.color.hsl() : [0,0,0];
        }
    },
    data() {
        return {
            color: null,
            sliderColor: '#0ABAB5'
        }
    }
}
</script>

<style>
.block {
    width: 100px;
    height: 100px;
    border: 1px solid black;
    margin: 10px;
    float: left;
}

.color-picker {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    background: #fff;
    border: 1px solid #999;
    padding: 5px;
    display: inline-flex;
}

.slider {
    margin-left: 5px;
}
</style>
