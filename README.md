# Leaflet.FlowEcharts
A leaflet plugin for Baidu Echarts
## 基于leaflet 扩展echarts，使ECharts的地图可以加到leaflet上
改写了leaflet-echarts：参考https://github.com/wandergis/leaflet-echarts

# 主要变更
1. 添加对1.x新版本leaflet的支持，并保留对0.7.7版本的支持
2. 解除echarts事件绑定，在事件联动这个地方以及echarts的容器与地图容器在拖动和缩放中的适应上，采取重绘的方式，即地图发生拖动和缩放就对echarts进行重绘
3. 修复问题：原leaflet-echarts采用数组存储经纬度geoCoord，容易导致内存溢出，部分节点无法正确显示在界面上
4. 修复对多个echarts图层的鼠标悬浮/点击交互支持
5. 支持Echarts 2.2.7和3.x版本，其中 
1) flowEcharts2.js仅支持echarts2.2.7(官方版本)
2) flowEcharts.js同时支持两个版本，但必须引用lib下的echarts3.js（仅修改了一行代码，对其他功能无影响）




# 使用方法（Usage）

1. Confirm you have imported `leaflet` first 
2. Import `echarts-2.2.7.js` or `echarts-3.4.min.js`
3. Import `flowEcharts.js` 
4. As you can use this plugin like this,按照下面的方法使用

	```
    	var option={};//基本与百度相同
    	
    	L.flowEcharts(option).addTo(map);
   	 ```
	注意事项：因为采用的是重绘机制，需要解绑事件，因此option中的roam要设置为false,且不能有toolbox
5. If you don't konw how to use this plugin,hava a look at `/examples/index.html`,如果你不会用，看看examples目录下的`index.html` 

# 截图示例

![](https://github.com/flowfyre/Leaflet.FlowEcharts/blob/master/examples/demo.gif)

![](https://github.com/flowfyre/Leaflet.FlowEcharts/blob/master/examples/demo2.png)

![](https://github.com/flowfyre/Leaflet.FlowEcharts/blob/master/examples/echarts3.png)


# 参考

>[https://github.com/ecomfe/echarts](https://github.com/ecomfe/echarts)

>[https://github.com/wandergis/leaflet-echarts](https://github.com/wandergis/leaflet-echarts)
