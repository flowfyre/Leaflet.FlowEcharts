 window.flowEchartsIndex=0;
 (function (factory, window) {

    // define an AMD module that relies on 'leaflet'
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);

    // define a Common JS module that relies on 'leaflet'
    } else if (typeof exports === 'object') {
        module.exports = factory(require('leaflet'));
    }

    // attach your plugin to the global 'L' variable
    if (typeof window !== 'undefined' && window.L) {
        window.L.flowEcharts = factory(L);
    }
}(function (L) {

  // implement your plugin
L.FlowEcharts = (L.version < "1.0" ? L.Class : L.Layer).extend({
    includes: (L.version < "1.0" ? L.Mixin.Events : []),
    _echartsContainer: null,
    _map: null,
    _ec: null,
    _option: null,//TODO: css for echarts container
    _echartsOption:null,
    

    initialize: function(echartsOption,option){
        this._option = option;
        this._echartsOption=echartsOption;
        
    },

   

    onAdd: function(map) {
        this._map = map;
        this._initEchartsContainer();
        map.on("moveend", this._redraw, this);
        this._redraw();
    },

    onRemove: function(map) {
        map.getPanes().overlayPane.removeChild(this._echartsContainer);
        map.off("moveend", this._redraw, this);
    },
    addTo:function(map){
        map.addLayer(this);
        return this;
    },
    _initEchartsContainer: function(){
        var size = this._map.getSize();        

        var _div = document.createElement('div');
        _div.style.position = 'absolute';
        _div.style.height = size.y + 'px';
        _div.style.width = size.x + 'px';
        _div.style.zIndex=flowEchartsIndex--;

        this._echartsContainer=_div;
        this._map.getPanes().overlayPane.appendChild(this._echartsContainer);
    },
    
    _resetCanvasPosition: function() {
        var bounds = this._map.getBounds();
        var topLeft = this._map.latLngToLayerPoint(bounds.getNorthWest());
        L.DomUtil.setPosition(this._echartsContainer, topLeft);
    },

    _redraw: function() {
        this._resetCanvasPosition();
        this._echartsContainer.innerHTML='';
        
        this.initECharts();
        this.setOption(this._echartsOption);
        return this;
    },

    clear: function(){
        this._echartsContainer.innerHTML='';
		    this.echartsOption = {};
    },

    redraw: function(){
        this._redraw();
    },
  
    /**
       * 经纬度转换为屏幕像素
       *
       * @param {Array.<number>} geoCoord  经纬度
       * @return {Array.<number>}
       * @private
       */
    geoCoord2Pixel : function(geoCoord) {
        var point = new L.latLng(geoCoord[1], geoCoord[0]);
        var pos = this._map.latLngToContainerPoint(point);
        return [pos.x, pos.y];
    },
    /**
       * 屏幕像素转换为经纬度
       *
       * @param {Array.<number>} pixel  像素坐标
       * @return {Array.<number>}
       * @public
       */
      pixel2GeoCoord : function(pixel) {
        var point = this._map.containerPointToLatLng(L.point(pixel[0], pixel[1]));
        return [point.lng, point.lat];
      },

      /**
       * 初始化echarts实例
       *
       * @return {ECharts}
       * @public
       */
      initECharts : function() {
        this._ec = echarts.init(this._echartsContainer);
        this._unbindEvent();
       
      },

    

      /**
       * 对echarts的setOption加一次处理
       * 用来为markPoint、markLine中添加x、y坐标，需要name与geoCoord对应
       *
       * @public
       * @param option
       * @param notMerge
       */
      setOption : function(option, notMerge) {

        var series = option.series || {};

       

        // 添加x、y
        for (var i = 0, item; item = series[i++];) {
          var markPoint = item.markPoint || {};
          var markLine = item.markLine || {};

          var data = markPoint.data;
          if (data && data.length) {
            for (var k = 0, len = data.length; k < len; k++) {
              
              this._AddPos(data[k]);
            }
          }

          data = markLine.data;
          if (data && data.length) {
            for (var k = 0, len = data.length; k < len; k++) {
              
              this._AddPos(data[k][0]);
              this._AddPos(data[k][1]);
            }
          }
        }

        this._ec.setOption(option, notMerge);
      },

      /**
       * 增加x、y坐标
       *
       * @param {Object} obj  markPoint、markLine data中的项，必须有name
       * @param {Object} geoCoord
       */
      _AddPos : function(obj) {

        var coord = obj.geoCoord;
        var pos = this.geoCoord2Pixel(coord);
        obj.x = pos[0]; //- this._mapOffset[0];
        obj.y = pos[1]; //- this._mapOffset[1];
      },


      /**
       * 解除绑定地图事件的处理方法
       *
       * @private
       */
      _unbindEvent : function() {
        
          this._ec.getZrender().un('dragstart', function(){});
          this._ec.getZrender().un('dragend', function(){});
          this._ec.getZrender().un('mouseup', function(){});
          this._ec.getZrender().un('mousedown', function(){});
          this._ec.getZrender().un('mousewheel', function(){});
        
      }

      
   

});
  

  L.flowEcharts = function(options, echartsOptions) {
    return new L.FlowEcharts(options, echartsOptions);
  };
  return L.flowEcharts;
  // return your plugin when you are done

}, window));