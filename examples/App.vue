<template>
    <div>
        <color-picker :start-color="hex" @color-selected="setColor"></color-picker>

        <div class="block" :style="{background: hex}">{{hex}}</div>
        <div class="colors">
            <div>rgb: {{rgbString}}</div>
            <div>rgb values: {{rgbVals}}</div>
            <div>HSV: {{hsv}}</div>
            <div>HSL: {{hsl}}</div>
            <div>UP Lab: {{upLab}}</div>
            <div>XYZ: {{xyz}}</div>
        </div>
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
        document.addEventListener('click', () => {
            if (!this.editing) {
                this.showPicker = false;
            }
        })
        this.color = ColorFactory.create("#ffdada");
    },
    methods: {
        setSliderColor(rgb, hex) {
            this.sliderColor = hex;
        },
        setColor(color) {
            this.color = color;
        },
        close() {
            if (!this.edited) {
                this.showPicker = false;
            }
        },
        open() {
            this.edited = false;
            this.editing = true;
            this.showPicker = true;
        },
        setEditing(val) {
            this.editing = val;
            this.edited = true;
        }
    },
    computed: {
        hex() {
            return (this.color) ? this.color.hex() : "#ff0000";
        },
        rgb() {
            return (this.color) ? this.color.rgb() : "";
        },
        rgbString() {
            return (this.rgb) ? this.rgb.toString() : "";
        },
        rgbVals() {
            return (this.rgb) ? this.rgb.getRgbValues() : [0, 0, 0];
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
            return (this.color) ? this.color.hsl() : [0, 0, 0];
        }
    },
    data() {
        return {
            color: null,
            sliderColor: '#0ABAB5',
            showPicker: false,
            editing: false,
            edited: false
        }
    }
}
</script>

<style>
.text-picker {
    position: relative;
}

.block {
    width: 100px;
    height: 100px;
    border: 1px solid black;
    margin: 10px;
    margin-top: 300px;
    float: left;
}

.colors {
    margin-top: 300px;
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
