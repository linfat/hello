$(function(){

	var vegStr = location.href.split('?')[1].split('&')
	// console.log(vegStr)
	var houseId = vegStr[0].split( '=' )[1]
	var vegId = vegStr[1].split( '=' )[1]
	var originVegId = vegId
	var vegIndex = vegStr[2].split( '=' )[1]
	var editorInfo = null
	console.log(vegId)


	/**
	*初始化野狗数据库节点
	**/
	var config = {
		  syncURL: "https://wd2274323339wrjwcl.wilddogio.com/vegData" //输入节点 URL
		}
		wilddog.initializeApp(config)
		var ref = wilddog.sync().ref()
	/* 
	*snapshot 里面的数据会一直和云端保持同步
	*/
	ref.on("value", function(snapshot) {
	    // console.log(snapshot.val())
	    // vegsData = snapshot.val()[houseId] //获取野狗数据库所选大棚的数据
	   var vegData = null
	   var  detailData =null
	   if (vegId.indexOf('F')>=0){
	   	 vegId = parseInt(vegId.substring(vegId.length-2, vegId.length)) >= 10 ? parseInt(vegId.substring(vegId.length-2, vegId.length))-1 : parseInt(vegId.substring(vegId.length-1, vegId.length))-1
	   	 var keyNum=0
	   	 for (var key in snapshot.val()[houseId]['firstLine'][vegId].vegs){
	   	 	if(keyNum == vegIndex){
	   	 	console.log(key)
	   	 	vegData = snapshot.val()[houseId]['firstLine'][vegId].vegs[key]
	   	 	}
	   	 	keyNum ++ 
	   	 }
	   	 
	   }else{
	 	 vegId = parseInt(vegId.substring(vegId.length-2, vegId.length)) >= 10 ? parseInt(vegId.substring(vegId.length-2, vegId.length))-1 : parseInt(vegId.substring(vegId.length-1, vegId.length))-1  	
	     var keyNum=0
	   	 for (var key in snapshot.val()[houseId]['secondLine'][vegId].vegs){

	   	 	if(keyNum == vegIndex){
	   	 	console.log(key)
	   	 	vegData = snapshot.val()[houseId]['secondLine'][vegId].vegs[key]
	   	 	}
	   	 	keyNum ++ 
	   	 }
	     console.log(vegData)


	   }
	var historyBoxTpl = null
	   // 添加历史记录
	 	$('.history').on('click', function(){
	 	historyBoxTpl = {
			   	masId : vegData.masId,
			   	name : vegData.name,
			   	sowDate : vegData.sowDate
			   }
			 var hisHtmlStr = template('historyBoxTpl', {
			 	data : historyBoxTpl
			 })  
			 $('#historyBox').html(hisHtmlStr)

			   
	 	})
	 	/*
	 	选择是否添加备注信息
	 	 */
	 	$('#historyBox').on('change', '.check', function(){
	 		$('.check').prop('checked') ? $('.historyInfoBox').show(300) : $('.historyInfoBox').hide(300)
	 	})
		
		$('.saveHistory').on('click', function(){
			console.log(1)
			var status = $.trim($('[name="status"]').val())
			var note = $.trim($('[name="note"]').val())
			location.href = `./detHistory.html?id=${historyBoxTpl.masId}&name=${vegData.name}
			&sowDate=${vegData.sowDate}&status=${status}&note=${note}&mark="editor"`
		})

		/*
		编辑页面信息发生改变时，禁用添加历史记录按钮
		 */
		 $('#vegDetail').on('change', 'input', function(){
		 	$('.history').addClass('disabled')
		 })

	   var timeStr = 1000*60*60*24
	   var dateDis = new Date() - new Date(vegData.sowDate)
	   vegData.passDay = parseInt(dateDis/timeStr)
	   vegData.upComingDay = vegData.estimate - vegData.passDay
	   vegData.metureDate = getMatureDate(vegData.sowDate, vegData.estimate )
	 	
	   $('.pro_title').html(vegData.name + '详情表')
	    console.log(vegData)
	    var detailHtmlStr = template('vegDetailTpl', {
	    	data : vegData
	    })

	    console.log(vegData)
	    var originInfo ={
	    	masId : vegData.masId,
	    	name : vegData.name,
	    	sowDate : vegData.sowDate

	    }
	    $('#vegDetail').html(detailHtmlStr)

	   // console.log(detailHtmlStr)
	  
	  $('.close').on('click', function(){
	  		$('.hideAlert').hide(300)
	  })
	   $('#save').on('click', function(){

	   	 editorInfo = {
	   		masId : $.trim($('[name="productId"]').val()),
	   		name : $.trim($('[name="name"]').val()),
	   		sowDate : $.trim($('[name="plantPro"]').val()),
	   		estimate : $.trim($('[name="estimateDay"]').val())
	   }

	   if(editorInfo.name == '' || editorInfo.sowDate=='' || editorInfo.estimate=='' ){
	   	$('.hideAlert').show(300)
	   	 return;
	   }
	
	    if (editorInfo.masId.indexOf('F')>=0){
		wilddog.sync().ref(`/${houseId}/firstLine/${vegId}/vegs/${vegIndex}`).update({
			name: editorInfo.name,
			masId: editorInfo.masId,
			estimate: editorInfo.estimate,
			sowDate: editorInfo.sowDate
		})	
	    .then(function(){
	    	location.href = './pandect.html?id=' + houseId
	    })
	    .catch(function(err){
	        alert('添加失败')
	    })
	   }else{
	    wilddog.sync().ref(`/${houseId}/secondLine/${vegId}/vegs/${vegIndex}`).update({
			name: editorInfo.name,
			masId: editorInfo.masId,
			estimate: editorInfo.estimate,
			sowDate: editorInfo.sowDate
		})	
	    .then(function(){
	    	location.href = './pandect.html?id=' + houseId
	    })
	    .catch(function(err){
	        alert('添加失败')
	    })
	   }
	 
	   })
		
	})


})

function getMatureDate(originDate, addDays){
   var timeStr = 1000*60*60*24
   var matureDateStr = new Date(originDate).getTime() + addDays * timeStr 
   var originDate = new Date(matureDateStr)
   var matureDate = originDate.getFullYear() + '-' + parseInt(originDate.getMonth()+ 1) + '-' + originDate.getDate() 
	   return matureDate
}
