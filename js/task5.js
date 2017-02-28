/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
  var a=document.getElementsByClassName("aqi-chart-wrap");

  var list="";
  if(pageState.nowGraTime=="day"){
    for(var k in chartData){
        var color="#000";
        if(chartData[k]<100){
            color="#C6EDE8";
        }else if(chartData[k]<200){
            color="#AED7ED";
        }else if(chartData[k]<300){
            color="#5CA7BA";
        }else if(chartData[k]<500){
            color="#E0A09E";
        }
    list += "<div title='"+k+"' style='height:"+chartData[k]+"px; width:10px;margin: 0 3px; background:"+color+";'></div>";
    }
  }else if(pageState.nowGraTime=="week"){
  
     for(var k in chartData){
        var color="#000";
        if(chartData[k]<100){
            color="#C6EDE8";
        }else if(chartData[k]<200){
            color="#AED7ED";
        }else if(chartData[k]<300){
            color="#5CA7BA";
        }else if(chartData[k]<500){
            color="#E0A09E";
        }
    list += "<div title='"+k+"' style='height:"+chartData[k]+"px; width:20px;margin: 0 10px;background:"+color+";'></div>";
    }
  }else{

    for(var k in chartData){
          var color="#000";
        if(chartData[k]<100){
            color="#C6EDE8";
        }else if(chartData[k]<200){
            color="#AED7ED";
        }else if(chartData[k]<300){
            color="#5CA7BA";
        }else if(chartData[k]<500){
            color="#E0A09E";
        }
    list += "<div title='"+k+"' style='height:"+chartData[k]+"px; width:100px;margin: 0 20px;background:"+color+";'></div>";
    }
  }
  
 
  a[0].innerHTML=list;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(a) {
  // 确定是否选项发生了变化 
   pageState.nowGraTime=a.target.value

  // 设置对应数据
   initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(a) {
  // 确定是否选项发生了变化 
  var b=document.getElementById("city-select");

  b.onchange=function(){
    pageState.nowSelectCity=b.value;
  }
  // 设置对应数据
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var a=document.getElementsByName("gra-time");

 
     for(i=0;i<a.length;i++){
       a[i].onclick=function(a){
          graTimeChange(a);
     }
  };
  
 
  

}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var a=aqiSourceData;

  var b=document.getElementById("city-select");
  var list="";
  for( var k in a){
    list += "<option>"+k+"</option>"
  }
  b.innerHTML=list;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  b.addEventListener("click",citySelectChange);
} 

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
   console.log(aqiSourceData);
   var Data=aqiSourceData[pageState.nowSelectCity];
   var Datas={};
   function month(x){
        var sum=0;
        var Daysum=0;
     for(var k in Data){
       if(k.indexOf(x)!=-1){
        sum += Data[k];
        Daysum++;
        Datas[x]=Math.round(sum / Daysum);
      
       }
     }
   }
    function weekdel(){
        var sum=0;
        var weeks=0;
        var Daysum=0;
      for(var k in Data){
        Daysum++;

       
        if(Daysum>=7){
            var Daysum=0;
            var sum=0;
            weeks++;
        }else{
           sum += Data[k];
        }
        Datas[weeks]=Math.round(sum / Daysum);
      
       }
     }
  if(pageState.nowGraTime=="day"){
     chartData=aqiSourceData[pageState.nowSelectCity];
  }else if(pageState.nowGraTime=="week"){
    weekdel();
    chartData=Datas;
  }else{
    month('2016-01');
    month('2016-02');
    month('2016-03');
    chartData=Datas;
  }
  console.log(chartData);

  // 处理好的数据存到 chartData 中
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();