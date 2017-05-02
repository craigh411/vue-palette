<template>
    <div class="color-picker">
        <div class="picker">
            <color-selector @color-selected="setColor" :spectrum="sliderColor" :start-color="sColor"></color-selector>

            <color-slider @color-selected="setSliderColor" :start-color="sSliderColor"></color-slider>
            <div class="hex">
                <input :class="{'error' : hexError}" :value="color" @blur="changeColor" placeholder="Hex" />
            </div>
            <div class="rgb">
                <div class="item">
                    <input :class="{'error' : hexError}" :value="r" placeholder="R" />
                </div>
                <div class="item">
                    <input :class="{'error' : hexError}" :value="g" placeholder="G" />
                </div>
                <div class="item">
                    <input :class="{'error' : hexError}" :value="b" placeholder="B" />
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
import ColorSlider from './ColorSlider.vue';
import ColorSelector from './ColorSelector.vue';
import ColorFormatter from './mixins/ColorFormatter';
export default {
    components: {
        ColorSlider,
        ColorSelector
    },
    mixins: [ColorFormatter],
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
            if (this.isHex(e.target.value)) {
                if (e.target.value !== this.color) {
                    this.targetColor = e.target.value;
                    this.sSliderColor = e.target.value;
                }
            } else {
                this.hexError = true;
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
    data() {
        return {
            color: '#ff0000',
            rgbVals: [],
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
}

.rgb > .item > label {
    float: left;
}

.rgb > .item > input {
    margin: 5px;
    margin-left: 0px;
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
    border: 1px solid #ff464a;
}
</style>
