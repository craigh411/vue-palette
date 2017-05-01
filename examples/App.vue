<template>
<div style="margin-top:50px;">
<color-slider @color-selected="setColor" start-color="#0ABAB5"></color-slider>
<div class="block" :style="{background: color}" >{{color}}</div>
</div>
</template>

<script type="text/javascript">
import ColorSlider from '../src/ColorSlider.vue';

export default{
	components:{
		ColorSlider
	},
	methods:{
      setColor(rgb, hex){
      	this.color = hex;
      }
	},
	data(){
		return{
			color: '#fff'
		}
	}
}
</script>

<style>
.block{
	width:100px;
	height:100px;
	border:1px solid black;
	margin:10px;
	float:left;
}
</style>