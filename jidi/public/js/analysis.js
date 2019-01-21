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
					for(var key0 in item ){

						for(var key1 in item.vegs){
							// console.log(key)
							for( var key2 in item.vegs[key1]){
								// console.log(item.vegs[key1][key])
								if(key2 == 'name'){
									var obj = {}
									obj.topName = item.vegs[key1][key2]
									obj.newvegs = item.vegs[key1]
									// console.log(item.vegs[key1][key2])
									newVegsArr.push(obj)
								}
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
				// console.log(item0)
				var name = item0.topName
				// console.log(name)
			
				if(onlyKey.indexOf(name)== -1 && name != ""){
					onlyKey.push(name)
					oBjNum++
					allVegsObj[oBjNum] = []
					allVegsObj[oBjNum].push(item0)
					

				}else{
					for(var key in allVegsObj){
						// console.log(item0.topName)
						// console.log(allVegsObj[key][0]['topName'])
						if(item0.topName == allVegsObj[key][0]['topName']){
							allVegsObj[key].push(item0)
						}
					}
				}
				// newAllvegObj[0].push= item0
				// console.log(newAllvegObj['0'])

			})
			// console.log(onlyKey)
			console.log(allVegsObj)
			// console.log(newAllvegObj)
			var allVegsObjArr = []
			for(var key in allVegsObj){
				allVegsObjArr.push(allVegsObj[key])
			}
			var htmlStr = template('analysisBoxTpl', {
				data : allVegsObjArr
			})
			$('#analysisBox').html(htmlStr)


			var htmlDetailStr = template('detailBoxTpl', {
				data : allVegsObjArr[0]
			})
			$('#detailBox').html(htmlDetailStr)


			console.log(allVegsObjArr)
		})

		{
			name:111
			arr:[]

		}
})