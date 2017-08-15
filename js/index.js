var index = (function() {
	var worker = new Worker("js/worker.js");
	
	function sendToWorker(file) {
		worker.postMessage(file);
		
		console.log("File sent to worker for inspection.");
	}
	
	function printResult(result) {
		if (document.getElementById("result"))
				document.getElementById("result").outerHTML = "";
			
		var res = "", imgSize = "";
		var status = document.getElementById("status");
		
		if (result instanceof Object) {
			status.classList.remove("blink");
			status.innerHTML = "Worker is done reading.";
			
			Object.keys(result).forEach(function(el, i) {
				if (el != "url" && el != "data")
					res += '<h2>'+el+'</h2><p><code>'+result[el]+'</code></p>';
			});
			
			if (result.type.indexOf("image") > -1) {
				var img = '<img src="'+result.url+'" />',
						imgObj = new Image();
						
				imgObj.onload = function() {
					imgSize = '<h2>dimensions</h2><p><code>'+this.width+' x '+this.height+'</code></p>';
					document.getElementById("result").innerHTML = imgSize + document.getElementById("result").innerHTML;
				};
				
				imgObj.src = result.url;
				res += '<h2>content</h2><p>' + img + '</p>';
				
			} else if (result.type.indexOf("video") > -1) {
				var video = '<video src="'+result.url+'" type="'+result.type+'" controls></video>';
				res += '<h2>content</h2><p>' + video + '</p>';
			}
		
			var node = document.createElement("div");
			node.id = "result";
			node.innerHTML = res;
			document.body.appendChild(node);
			return;
		}
		
		status.innerHTML = result;
		status.classList.add("blink");
		return;
	}
	
	worker.onmessage = function(e) {
		printResult(e.data);
	};
	
	document.getElementById("toWorker").addEventListener("change", function(e) {
		sendToWorker(e.target.files[0]);
	}, false);
	
})();