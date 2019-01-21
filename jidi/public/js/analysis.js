$(function(){
	/**
	*初始化野狗数据库节点
	**/
	var allVegData = null
	var allVegArr = []
	var config = {
		  syncURL: "https://wd2274323339wrjwcl.wilddogio.com/vegData" //输入节点 URL
		}
		wilddog.initializeApp(config)
		var ref = wilddog.sync().ref()
		ref.on("value", function(snapshot) {
			allVegData = snapshot.val()
			var arr = null	
			allVegData.forEach(function(item){
			allVegArr.push(item.firstLine.slice(0).concat(item.secondLine.slice(0)))
			})
			// console.log(allVegArr)
			var newVegsArr = []
			allVegArr.forEach(function(item, index){
				item.forEach(function(item, index){
					// console.log(item.vegs)
					// item.vegs.forEach(function(item, index){
					// 	console.log(item)
					// })
					// console.log(item)
					for(var key0 in item.vegs ){
						// console.log(item.vegs[key0])
						for(var key1 in item.vegs[key0]){
								if(key1 == 'name'){
									var obj = {}
									obj.topName = item.vegs[key0][key1]
									obj.newvegs = item.vegs[key0]
									newVegsArr.push(obj)						
									break
								}
						
						}
					}
				})
			})
			var newAllvegObj = {}
			// console.log(newVegsArr)
			var onlyKey = []
			var oBjNum = -1
			var allVegsObj={}
			newVegsArr.forEach(function(item0, index){
				var name = item0.topName	
				if(onlyKey.indexOf(name)== -1 && name != ""){
					onlyKey.push(name)
					oBjNum++
					allVegsObj[oBjNum] = []
					allVegsObj[oBjNum].push(item0)
					

				}else{
					for(var key in allVegsObj){
						if(item0.topName == allVegsObj[key][0]['topName']){
							allVegsObj[key].push(item0)
							break
						}
					}
				}

			})
			var allVegsObjArr = []
			for(var key in allVegsObj){
				allVegsObjArr.push(allVegsObj[key])
			}
			var htmlStr = template('analysisBoxTpl', {
				data : allVegsObjArr
			})
			$('#analysisBox').html(htmlStr)

			var htmlDetailStr = template('detailBoxTpl', {
				data : null
			})
			$('#detailBox').html(htmlDetailStr)

			
			allVegsObjArr.forEach(function(item0, index){
				// console.log(item)
				item0.forEach(function(item1, index){
					item1.newvegs.matureDay = getMatureDate(item1.newvegs.sowDate, item1.newvegs.estimate)
					// item1.newvegs.remainDay = getMatureDate(new Date(), item1.newvegs.sowDateitem1.newvegs.estimate)
					item1.newvegs.passDay =parseInt((new Date() - new Date(item1.newvegs.sowDate))/ (1000*60*60*24)) 
					item1.newvegs.remainDay = parseInt((new Date(item1.newvegs.matureDay) - new Date())/ (1000*60*60*24)) 
					// item0.newvegs.sowDate
				})
			
			})
			console.log(allVegsObjArr)
			/**
			 * 按照大棚查看详情
			 */
			var  topAllVegsArr = []
			allVegsObjArr.forEach(function(item, index){
				if(index == 0){
					topAllVegsArr = item.slice(0)
				}else{
				
					topAllVegsArr = topAllVegsArr.concat(item.slice(0))
				}
				
			})
		
			$('#analysisBox').on('click','.detail', function(){
				var data = null
				if($(this).attr('data-link') != 'top'){
					 var index = $(this).attr('data-id')
					  data =allVegsObjArr[index]
				}
			   data =topAllVegsArr
				 $('#analysisBox').html(htmlStr)
				var htmlDetailStr = template('detailBoxTpl', {
					data : data
				})
				$('#detailBox').html(htmlDetailStr)
			})
			/*
		按照时间升序查看详情
		 */
		$('#analysisBox').on('click','.orderByUp', function(){
			if($(this).attr('data-link') != 'top'){
					 var index = $(this).attr('data-id')
					  data =allVegsObjArr[index]
				}
			   data =topAllVegsArr
			 
			 var orderByUpVegsData = data.sort(function(obj1, obj2){
				  return obj1.newvegs.remainDay - obj2.newvegs.remainDay
			})
			 var htmlDetailStr = template('detailBoxTpl', {
					data : data
				})
				$('#detailBox').html(htmlDetailStr)
		})
			/*
		按照时间降序查看详情
		 */
		$('#analysisBox').on('click','.orderByDown', function(){
			if($(this).attr('data-link') != 'top'){
					 var index = $(this).attr('data-id')
					  data =allVegsObjArr[index]
				}
			   data =topAllVegsArr
			 
			 var orderByUpVegsData = data.sort(function(obj1, obj2){
				  return obj2.newvegs.remainDay - obj1.newvegs.remainDay 
			})
			 var htmlDetailStr = template('detailBoxTpl', {
					data : data
				})
				$('#detailBox').html(htmlDetailStr)
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