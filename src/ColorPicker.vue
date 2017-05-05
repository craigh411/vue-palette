<template>
    <div class="color-picker">
        <div class="picker">
            <color-selector @color-selected="setColor" :spectrum="sliderColor" :start-color="sColor"></color-selector>

            <color-slider @color-selected="setSliderColor" :start-color="sSliderColor" @loaded="sliderVals = $event"></color-slider>
            <div class="hex">
                <input :class="{error : hexError}" :value="color" @blur="changeColor" placeholder="Hex" />
            </div>
            <div class="rgb">
                <div class="item">
                    <input :value="r" placeholder="R" />
                </div>
                <div class="item">
                    <input :value="g" placeholder="G" />
                </div>
                <div class="item">
                    <input :value="b" placeholder="B" />
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
import ColorSlider from './ColorSlider.vue';
import ColorSelector from './ColorSelector.vue';
import ColorFactory from './classes/ColorFactory';
import Color from './classes/Color';
export default {
    components: {
        ColorSlider,
        ColorSelector
    },
    props: {
        startColor: {
            default: '#ff0000',
            type: String
        },
        preferredFormat: {
            default: 'hex',
            type: String
        }
    },
    created() {
        this.sliderColor = this.startColor;
        this.color = this.startColor;
    },
    methods: {
        setSliderColor(rgb, hex, rgbArray, auto) {
            this.sliderColor = hex;
            this.sSliderColor = null;
            if (auto) {
                // This deals with changes that won't fire if values are set to previous values 
                // when entering colours manually, we are simply nulling them and updating them to
                // to fire the changes. The event sequence is a bit tricky though.
                this.sColor = null;
                this.$nextTick(() => {
                    this.sColor = this.targetColor;
                    this.$nextTick(() => {
                        this.color = null;
                        this.color = this.targetColor;
                    });
                });
            }
        },
        setColor(rgb, hex, rgbArray) {
            this.hexError = false;
            this.color = hex;
            this.rgbVals = rgbArray;
            this.$emit('color-selected', rgb, hex, rgbArray)
        },
        changeColor(e) {
            this.hexError = true;
            if (Color.isHex(e.target.value)) {
                if (e.target.value !== this.color) {
                    this.targetColor = e.target.value;
                    //this.sSliderColor = e.target.value;
                    this.findClosestSliderMatch(e.target.value, 1);
                }
                this.hexError = false;
            }
            if (this.hexError) {
                this.color = e.target.value
            }
        },
        findClosestSliderMatch(target, calls, closest) {
            console.log(calls);
            let difference = [];
            let targetColor = ColorFactory.create(target);
            target = Color.lab(targetColor.rgbArray());
            for (let i = 0; i < this.sliderVals.length; i++) {
                let color = Color.lab(this.sliderVals[i]);
                difference[i] = {
                    color: this.sliderVals[i],
                    diff: Color.compare(color, target)
                };
            }
            difference.sort((a, b) => {
                return a.diff - b.diff;
            });
            let color = Color.RgbToHex(difference[0].color);
            // if the first difference is large, let's check to see if
            console.log(difference[0].diff);
            if (!closest || closest.diff > 15 && calls < 10) {
                calls = calls + 1;
                closest = (!closest || closest.diff > difference[0].diff) ? difference[0] : closest;
                // Gradually lighten the color until we find a match
               this.findClosestSliderMatch(Color.RgbToHex(Color.lighten(targetColor.rgbArray(), 20)), calls, closest);
            } else {
                console.log(difference[0].diff)
                //targetColor = Color.RgbToHex(targetColor.rgbArray());
                console.log(closest)
                let result = ColorFactory.create(closest.color);
                targetColor = Color.RgbToHex(result.rgbArray());
                this.sSliderColor = targetColor;
            }
        }
    },
    computed: {
        r() {
            return (this.rgbVals[0] !== undefined) ? this.rgbVals[0] : "";
        },
        g() {
            return (this.rgbVals[1] !== undefined) ? this.rgbVals[1] : "";
        },
        b() {
            return (this.rgbVals[2] !== undefined) ? this.rgbVals[2] : "";
        }
    },
    watch: {
        sliderVals(vals) {}
    },
    data() {
        return {
            color: '#ff0000',
            rgbVals: [],
            sliderVals: [],
            sliderColor: '#ff0000',
            sColor: '#ff0000',
            sSliderColor: '#ff0000',
            targetColor: '#ff0000',
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
    max-width: 192px;
    font-family: tahoma;
}

.error {
    border: 1px solid #ff9391 !important;
    background: #feebfc;
}
</style>
