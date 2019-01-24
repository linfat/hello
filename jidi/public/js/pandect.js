$(function(){
	var horseId = location.href.indexOf('?') >= 0 ? location.href.split('?')[1].split('=')[1] : 1
	var vegsData = null
	var allVegsData = null
	var editorInfo = null
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
		  syncURL: "https://wd2274323339wrjwcl.wilddogio.com/vegData" //输入节点 URL
		}
		wilddog.initializeApp(config)
		var ref = wilddog.sync().ref()
	/* 
	*snapshot 里面的数据会一直和云端保持同步
	*/
	ref.on("value", function(snapshot) {
	    allVegsData = snapshot.val()
	    console.log(allVegsData)
	    renderData(snapshot, horseId)
	   
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

	/**
	 * 清空功能
	 */
	$('#hourseInfo').on('click', '.emptyBtn', function(){
		emptyByOne($(this))

	})


/**
 * 
 将地块编号传入编辑页面
 */
$('#hourseInfo').on('click','.increase', function(){
	var valueId =  $(this).attr('data-id')
	$('#masId').attr('value',valueId)
})

/**
 *添加数据
 */
// $('.hideAlert').alert('close')
$('#close').on('click', function(){
	$('#hideAlert').hide(300)
})

$('.modelSave').on('click', function(){
	 editorInfo = {
	   		masId : $.trim($('[name="masId"]').val()),
	   		name : $.trim($('[name="name"]').val()),
	   		sowDate : $.trim($('[name="sowDate"]').val()),
	   		estimate : $.trim($('[name="estimate"]').val())
	   }


	   if(editorInfo.name == '' || editorInfo.sowDate=='' || editorInfo.estimate=='' ){
	   	$('#hideAlert').show(300)
		 return;
	   	
	   }
		var vegId = $(this).parent().parent().prev().attr('data-id')
		var vegIdStr =editorInfo.masId
		console.log(vegIdStr)
		var vegId = parseInt(vegIdStr.substring(vegIdStr.length-2, vegIdStr.length)) >= 10 ? parseInt(vegIdStr.substring(vegIdStr.length-2, vegIdStr.length))-1 : parseInt(vegIdStr.substring(vegIdStr.length-1, vegIdStr.length))-1

		// location.href = location.href + '?id=' + vegId
		var vegIndex = $(this).attr('data-index')

		var vegStr ='id=' + horseId +'&'+ 'vegId=' + vegId + '&' + 'vegIndex=' + vegIndex

      if (vegIdStr.indexOf('F')>=0){
      	
		wilddog.sync().ref(`/${horseId}/firstLine/${vegId}/vegs`).push({
			name: editorInfo.name,
			masId: editorInfo.masId,
			estimate: editorInfo.estimate,
			sowDate: editorInfo.sowDate
		})	
	    .then(function(newRef){
	    	$('#myModal').modal('hide')
	    })
	    .catch(function(err){
	        alert('添加失败')
	    })
	   }else{
	    wilddog.sync().ref(`/${horseId}/secondLine/${vegId}/vegs`).push({
			name: editorInfo.name,
			masId: editorInfo.masId,
			estimate: editorInfo.estimate,
			sowDate: editorInfo.sowDate
		})	
	    .then(function(){
	    	
	    	$('#myModal').modal('hide')
	    })
	    .catch(function(err){
	        alert('添加失败')
	    })
	   }

	
})

	/**
	 * 删除功能
	 */

	$('#hourseInfo').on('click', '.delete', function(){
		delByOne($(this))
	})

/**
 * 清空功能并添加历史记录
 */

$('#hourseInfo').on('click', '.emptyAndAdd', function(){
	console.log(1)
		var itemLen = $(this).parent().parent().children().length
		var tpmArr = []
		$(this).parent().parent().children().each(function(index, item){
			if(index != itemLen-1){
				tpmArr.push(item.outerText)
			}
		})
		 obj = {
			masId : tpmArr[0],
			name: tpmArr[1],
			sowDate: tpmArr[2]
		}
		 var hisHtmlStr = template('historyBoxTpl', {
			 	data : obj
			 })  
			 $('#historyBox').html(hisHtmlStr)

		// 删除功能 
		emptyByOne($(this), '1')
	})
	/**
	 * 删除功能并添加历史记录
	 */
	var obj  = null
	$('#hourseInfo').on('click', '.deleteAndAdd', function(){
		var itemLen = $(this).parent().parent().children().length
		var tpmArr = []
		$(this).parent().parent().children().each(function(index, item){
			if(index != itemLen-1){
				tpmArr.push(item.outerText)
			}
		})
		 obj = {
			masId : tpmArr[0],
			name: tpmArr[1],
			sowDate: tpmArr[2]
		}
		 var hisHtmlStr = template('historyBoxTpl', {
			 	data : obj
			 })  
			 $('#historyBox').html(hisHtmlStr)

		// 删除功能 
		delByOne($(this), '1')
	})

	/*
	  删除信息添加到历史记录中
	 */
	$('.saveHistory').on('click', function(){
		pushHis(obj)		
		})
/**
 * pushHis 将信息添加到历史记录列表中
* @param  {[Object]} obj 传入信息对象
 */
function pushHis(obj){
	var status = $.trim($('[name="status"]').val())
	var note = $.trim($('[name="note"]').val())
	var pageId = $('.pageBtn.active').text()

	location.href = `./detHistory.html?id=${obj.masId}&name=${obj.name}
	&sowDate=${obj.sowDate}&status=${status}&note=${note}`
	// location.href = location.href+`?id=${pageId}`
}

/**
 * emptyOne 
* @param  {[Object]} $(this) 传入this对象
* @param  {[Number]} 數字	是否是刪除
 */
function emptyByOne(that, status){
	var vegId = that.parent().parent().prev().attr('data-id')
		var vegIdStr = that.attr('data-id')
		var vegId = parseInt(vegIdStr.substring(vegIdStr.length-2, vegIdStr.length)) >= 10 ? parseInt(vegIdStr.substring(vegIdStr.length-2, vegIdStr.length))-1 : parseInt(vegIdStr.substring(vegIdStr.length-1, vegIdStr.length))-1

		// location.href = location.href + '?id=' + vegId
		var vegIndex = that.attr('data-index')

		var vegStr ='id=' + horseId +'&'+ 'vegId=' + vegId + '&' + 'vegIndex=' + vegIndex
		console.log(vegStr)


		if(vegIdStr.indexOf('F')>=0){

		var keyNum=0
	   	 for (var key in allVegsData[horseId]['firstLine'][vegId].vegs){
	   	 	if(keyNum == vegIndex){
	   	 	console.log(key)
	   	 	vegIndex = key
	   	 	}
	   	 	keyNum ++ 
	   	 }

			wilddog.sync().ref(`/${horseId}/firstLine/${vegId}/vegs/${vegIndex}`).update({
			name:'空地',
			masId:vegIdStr,
			estimate:'',
			sowDate:''
		})	
	    .then(function(){
	    	if(status == 1){
	    		return
	    	}
	    	alert('清空成功')
	    })
	    .catch(function(err){
	        alert('清空失败')
	    })
	}else{

		  	var keyNum=0
	   	 for (var key in allVegsData[horseId]['secondLine'][vegId].vegs){
	   	 	if(keyNum == vegIndex){
	   	 	console.log(key)
	   	 	vegIndex = key
	   	 	}
	   	 	keyNum ++ 
	   	 }

		wilddog.sync().ref(`/${horseId}/secondLine/${vegId}/vegs/${vegIndex}`).update({
			name:'空地',
			masId:vegIdStr,
			estimate:'',
			sowDate:''
		})	
	    .then(function(){
	    	if(status == 1){
	    		return
	    	}
	    	alert('清空成功')
	    })
	    .catch(function(err){
	        alert('清空失败')
	    })


		
	}
}
/**
 * delByone 删除指定的蔬菜编号
 * @param  {[Object]} $(this) 传入this对象
 * @param  {[Number]} 數字	是否是刪除
 */
function delByOne(that, status){

		var vegIdStr = that.attr('data-id')
		var vegId = parseInt(vegIdStr.substring(vegIdStr.length-2, vegIdStr.length)) >= 10 ? parseInt(vegIdStr.substring(vegIdStr.length-2, vegIdStr.length))-1 : parseInt(vegIdStr.substring(vegIdStr.length-1, vegIdStr.length))-1
		var vegIndex = that.attr('data-index')
		  if (vegIdStr.indexOf('F')>=0){

		  	var keyNum=0
	   	 for (var key in allVegsData[horseId]['firstLine'][vegId].vegs){
	   	 	if(keyNum == vegIndex){
	   	 	console.log(key)
	   	 	vegIndex = key
	   	 	}
	   	 	keyNum ++ 
	   	 }



		wilddog.sync().ref(`/${horseId}/firstLine/${vegId}/vegs/${vegIndex}`).remove()	
	    .then(function(){
	    	if(status == 1){
	    		return
	    	}
	    	alert('删除成功')
	    })
	    .catch(function(err){
	        alert('删除失败')
	    })
	   }else{

	   	var keyNum=0
	   	for (var key in allVegsData[horseId]['secondLine'][vegId].vegs){
	   		// console.log(key)
	   	 	if(keyNum == vegIndex){
	   	 	console.log(key)
	   	 	vegIndex = key
	   	 	}
	   	 	keyNum ++ 
	   	 }
	   	 // console.log(vegIndex)
	    wilddog.sync().ref(`/${horseId}/secondLine/${vegId}/vegs/${vegIndex}`).remove()	
	    .then(function(){
	    	if(status == 1){
	    		return
	    	}
	    	alert('删除成功')
	    })
	    .catch(function(err){
	        alert('删除失败')
	    })
	   }
}








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
	    vegsData.forEach(function(item,index){
	    	// console.log(item)
	    	for(var key in item.vegs){
	    		// console.log(item.vegs[key])
	    	
	    		dateDis = new Date() - new Date(item.vegs[key].sowDate)
			    item.vegs[key].passDay = parseInt(dateDis/timeStr)
			    item.vegs[key].upComingDay = item.vegs[key].estimate - item.vegs[key].passDay
			    item.vegs[key].metureDate = getMatureDate(item.vegs[key].sowDate, item.vegs[key].estimate )

	    	}
	    })

	    // console.log(vegsData)
	    // json对象转换成数组
	    vegsData.forEach(function(item, index){
	    	var arr = []
		
	    	for(var key in item.vegs){
	    		item.vegs[key].posId = key
	    		arr.push(item.vegs[key])
	    	}
	    	item.vegs =arr
	    	arr = []
	    	// console.log(item)
	    	
	    })

	    // console.log(fistLineData)
	    var horsesHtmlStr = template('hourseInfoTpl', {
	    	data : vegsData
	    })
	    $('#hourseInfo').html(horsesHtmlStr)


}
	
