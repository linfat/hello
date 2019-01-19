$(function(){
	var horseId = location.href.indexOf('?') >= 0 ? location.href.split('?')[1].split('=')[1] : 1
	var vegsData = null
	var allVegsData = null
	$('.pageBtn').each(function(index, item ){
		if(index == horseId-1){
			
			$(this).addClass('active').siblings().removeClass('active')
		}
	})
	// console.log(horseId)
	/**
	*初始化野狗数据库节点
	**/
	var config = {
		  syncURL: "https://wd0963251028wmtevt.wilddogio.com/vegData" //输入节点 URL
		}
		wilddog.initializeApp(config)
		var ref = wilddog.sync().ref()
	/* 
	*snapshot 里面的数据会一直和云端保持同步
	*/
	ref.on("value", function(snapshot) {
	    // console.log(snapshot.val())
	    renderData(snapshot, horseId)

	    // var roadLineData = snapshot.val()[mapId].roadLine
	    // var roadHtmlStr = template('roadLineTpl', {
	    // 	data : roadLineData
	    // })

	   
	})
	/**
	 * 页面变化
	 */
	$('.pageBtn').on('click', function(){
		$(this).addClass('active').siblings('li').removeClass('active')
		 horseId = $(this).text()
		ref.on("value", function(snapshot) {
	    renderData(snapshot, horseId)

	})

	})
	/*
	进入编辑页面
	 */
	$('#hourseInfo').on('click', '.editor', function(){

		// var vegId = $(this).parent().parent().prev().attr('data-id')
		var vegIdStr = $(this).attr('data-id')
		var vegId = parseInt(vegIdStr.substring(vegIdStr.length-2, vegIdStr.length)) >= 10 ? parseInt(vegIdStr.substring(vegIdStr.length-2, vegIdStr.length))-1 : parseInt(vegIdStr.substring(vegIdStr.length-1, vegIdStr.length))-1

		location.href = location.href + '?id=' + vegId
		var vegIndex = $(this).attr('data-index')

		var vegStr ='id=' + horseId +'&'+ 'vegId=' + vegIdStr + '&' + 'vegIndex=' + vegIndex
		$(this).attr('href','./editor.html?' + vegStr )
	})

})
function getMatureDate(originDate, addDays){
   var timeStr = 1000*60*60*24
   var matureDateStr = new Date(originDate).getTime() + addDays * timeStr 
   var originDate = new Date(matureDateStr)
   var matureDate = originDate.getFullYear() + '-' + parseInt(originDate.getMonth()+ 1) + '-' + originDate.getDate() 
	   return matureDate
}

/**
 * 渲染数据
 * @param  {String} snapshot 野狗初始化数据
 * @param  {String} horseId  获取数据ID
 */
function renderData(snapshot, horseId){
	allVegsData = snapshot.val() //获取野狗数据库数据
	    var fistLineData = snapshot.val()[horseId].firstLine
	    var secondLineData = snapshot.val()[horseId].secondLine
	    vegsData = fistLineData.slice(0).concat(secondLineData.slice(0))
	    var timeStr = 1000*60*60*24
	    var dateDis = null
	    vegsData.forEach(function(item){
	    	item.vegs.forEach(function(item){
	    		dateDis = new Date() - new Date(item.sowDate)
			    item.passDay = parseInt(dateDis/timeStr)
			    item.upComingDay = item.estimate - item.passDay
			    item.metureDate = getMatureDate(item.sowDate, item.estimate )
	    	})
	    })
	   console.log(vegsData)
	    // console.log(fistLineData)
	    var horsesHtmlStr = template('hourseInfoTpl', {
	    	data : vegsData
	    })

	    $('#hourseInfo').html(horsesHtmlStr)

	    // var roadLineData = snapshot.val()[mapId].roadLine
	    // var roadHtmlStr = template('roadLineTpl', {
	    // 	data : roadLineData
	    // })}



}
	