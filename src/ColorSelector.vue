<template>
    <div class="selector" @click="changeColor" @mouseover="selected = true" @mouseout="selected = false" @mousedown.prevent="dragging = true">
        <canvas ref="selector" height="150" width="150"></canvas>
        <div class="pointer" :style="{left:pointerPosition.x, top: pointerPosition.y}" @mousedown.prevent="dragging = true"></div>
    </div>
</template>

<script type="text/javascript">
import ColorCanvas from "./mixins/ColorCanvas";
export default {
    mixins: [ColorCanvas],
    props: {
        spectrum: {
            default: "#ff0000",
            type: String
        },
        selectColor: {
            default: "#eeeeee",
            type: String
        }
    },
    created() {
        this.setColor(this.spectrum);
        this.pointerPosition = {
            x: 0,
            y: 0
        };
        document.addEventListener("mousemove", e => {
            if (this.dragging) {
                this.changeColor(e);
                e.preventDefault(); // stop selection of page elements
            }
        });
        document.addEventListener("keydown", e => {
            if (this.selected) {
                this.movePointer(e);
                e.preventDefault();
            }
        });
        this.bus.$on("reflow", () => {
            this.$nextTick(() => {
                this.boundingBox = this.$refs.selector.getBoundingClientRect();
            });
        });
    },
    mounted() {
        this.buildSelector();
        this.boundingBox = this.$refs.selector.getBoundingClientRect();
        const coords = this.findColor(this.rgbValues, 1, 150, 1, 150);
        this.setPointerPosition(coords.x, coords.y);
    },
    methods: {
        buildSelector() {
            this.ctx = this.$refs.selector.getContext("2d");
            this.ctx.rect(0, 0, 150, 150);
            this.fillGradient();
        },
        fillGradient() {
            this.ctx.fillStyle = this.rgb;
            this.ctx.fillRect(0, 0, 150, 150);
            var grdWhite = this.ctx.createLinearGradient(0, 0, 150, 0);
            grdWhite.addColorStop(0, "rgba(255,255,255,1)");
            grdWhite.addColorStop(1, "rgba(255,255,255,0)");
            this.ctx.fillStyle = grdWhite;
            this.ctx.fillRect(0, 0, 150, 150);
            var grdBlack = this.ctx.createLinearGradient(0, 0, 0, 150);
            grdBlack.addColorStop(0, "rgba(0,0,0,0)");
            grdBlack.addColorStop(1, "rgba(0,0,0,1)");
            this.ctx.fillStyle = grdBlack;
            this.ctx.fillRect(0, 0, 150, 150);
            this.setColor(this.getColorAt(
                this.forceRange(this.pointerPosition.x, 0, 150),
                this.forceRange(this.pointerPosition.y, 0, 150)
            ));
        },
        forceRange(val, min, max) {
            return Math.max(min, Math.min(max, val));
        },
        changeColor(e) {
            if (e.type === "click" || this.dragging) {
                const x = this.forceRange(e.clientX - this.boundingBox.left, 0, 149);
                const y = this.forceRange(e.clientY - this.boundingBox.top, 0, 149);
                // Just ensure the correct colors are in the corners as they differ slightly due to gradient
                this.setColorByCoordinates(x, y);
            }
        },
        setColorByCoordinates(x, y) {
            if (x <= 1 && y <= 1) {
                this.setColor("#fff");
            } else if (y >= 149) {
                this.setColor("#000");
            } else if (x >= 149 && y <= 1) {
                this.setColor(this.spectrum);
            } else {
                this.setColor(this.getColorAt(x, y));
            }
            this.setPointerPosition(x, y);
        },
        setPointerPosition(x, y) {
            this.pointerPosition = {
                y: Math.max(1, Math.min(150, y)) - 4,
                x: Math.max(1, Math.min(150, x) - 3)
            };
        },
        movePointer(e) {
            if (e.code === "ArrowUp" || e.code === "ArrowDown") {
                let y = this.pointerPosition.y;
                y = (e.code === "ArrowUp") ? y + 3 : y + 5;
                this.setColorByCoordinates(this.pointerPosition.x + 3, y);
            } else if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
                let x = this.pointerPosition.x;
                x = (e.code === "ArrowLeft") ? x + 2 : x + 4;
                this.setColorByCoordinates(x, this.pointerPosition.y + 4);
            }
        }
    },
    watch: {
        spectrum(val) {
            this.setColor(val);
            this.fillGradient();
        },
        color() {
            if (this.color) {
                this.$nextTick(() => {
                    this.$emit("color-selected", this.color);
                });
            }
        },
        selectColor(val) {
            if (val) {
                this.setColor(val);
                const coords = this.findColor(this.rgbValues, 1, 150, 1, 150);
                this.setPointerPosition(coords.x, coords.y);
            }
        }
    },
    data() {
        return {
            pointerPosition: {},
            boundingBox: null,
            selected: false
        };
    }
};
</script>

<style scoped>
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
