$(function(){
	var ctx = document.getElementById("myChart").getContext('2d');
	var config = {
		  syncURL: "https://wd7324344485udhfdu.wilddogio.com/histoty" //输入节点 URL
		}
		wilddog.initializeApp(config)
		var ref = wilddog.sync().ref()
		ref.on("value", function(snapshot) {
			console.log(snapshot.val())
			var hisData = snapshot.val()
			var hisHtmlStr =template('historyBoxTpl', {
				data : hisData
			})
			$('#historyBox').html(hisHtmlStr)
			
			getData(hisData)
			createChart(numData.successNum,numData.failNum, numData.unkonwnNum)
			$('.shaixuanBtn').on('click', function(){
				myChart.destroy()
				getData(hisData)
				createChart(numData.successNum,numData.failNum, numData.unkonwnNum)
			})


		
		
		})


/**
 * getData 獲取渲染餅圖所需要的數據
 */
function getData(hisData){
	// console.log($('#datePre').val())
			
				var unkonwnNum = 0
				var successNum = 0
				var failNum = 0
				var biginDate 
				var endDate
				var myChart
				var tpmArr = []
				for( var key in  hisData){
					tpmArr.push(hisData[key])
				}
				
				// 
				var dateOrderByUp = tpmArr.sort( function (obj1, obj2){
					return new Date(obj1.sowDate)  - new Date(obj2.sowDate)
				})
				console.log(dateOrderByUp)

				beginDate = $('#datePre').val() == "" ? dateOrderByUp[0]['sowDate'] : $('#datePre').val()
				console.log(beginDate)
				endDate = $('#dateNext').val() == "" ? dateOrderByUp[dateOrderByUp.length-1]['sowDate'] : $('#dateNext').val()
				console.log(endDate)
				dateOrderByUp.forEach(function(item, index){
					if(new Date(item.sowDate) >= new Date(beginDate) && new Date(item.sowDate) <= new Date(endDate)){
						switch (item['status']) {
							case '-1':
							unkonwnNum++
							break;
							case '0':
							successNum++
							break;
							case '1':
							failNum++
							break;
							
						}
					}
				})
				console.log(unkonwnNum)
				return numData ={
					successNum : successNum,
					failNum : failNum,
					unkonwnNum : unkonwnNum
				}
}

/**
 * createChart 創建餅圖
 * @param  {successNum} Nuber 成功的數值
 * @param  {failNum} Nuber 失敗的數值
 * @param  {failNum} Nuber 未知狀態的數值
 */
function createChart(successNum,failNum, unkonwnNum){
	 myChart = new Chart(ctx, {
		    type: 'pie',
		    data: {
		        labels: ["成功", "失敗", "未知"],
		        datasets: [{
		            label: '# of Votes',
		            data: [successNum, failNum, unkonwnNum],
		            backgroundColor: [
		                'rgba(255, 99, 132, 0.2)',
		                'rgba(54, 162, 235, 0.2)',
		                'rgba(255, 206, 86, 0.2)'
		                
		            ],
		            borderColor: [
		                'rgba(255,99,132,1)',
		                'rgba(54, 162, 235, 1)',
		                'rgba(255, 206, 86, 1)'
		            ],
		            borderWidth: 1
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true

		                }
		            }]
		        }
		    }
		});
}

})